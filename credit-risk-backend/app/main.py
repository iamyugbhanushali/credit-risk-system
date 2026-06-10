from fastapi import FastAPI
from sqlalchemy.orm import Session
from fastapi.middleware.cors import CORSMiddleware

import joblib
import json

from app.schemas.loan_schema import LoanApplication as LoanPredictionInput
from app.utils.preprocess import preprocess_input
from app.auth.deps import get_current_user
from fastapi import Depends
from app.database.db import engine, SessionLocal
from app.database.models import (
    Base,
    User,
    Prediction,
    Account,
    Transaction,
    Transfer,
    Beneficiary,
    LoanApplication,
    FinancialHealthScore
)
from app.schemas.account_schema import AccountCreate
from app.schemas.transaction_schema import TransactionRequest
from app.schemas.transfer_schema import TransferRequest
from app.schemas.beneficiary_schema import BeneficiaryCreate
from app.schemas.loan_application_schema import LoanApplicationCreate
from app.auth.routes import router as auth_router

# create tables
Base.metadata.create_all(bind=engine)

app = FastAPI()
app.include_router(auth_router)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# model
model = joblib.load("app/model/final_xgboost_model.pkl")

with open("app/model/feature_columns.json", "r") as f:
    feature_columns = json.load(f)


@app.get("/")
def home():
    return {"message": "Credit Risk API Running"}


# =========================
# FIXED PREDICT ENDPOINT
# =========================
@app.post("/predict")
def predict_loan(
    data: LoanPredictionInput,
    current_user: User = Depends(get_current_user)
):

    db = SessionLocal()

    try:
        input_data = preprocess_input(data.dict(), feature_columns)

        prediction = model.predict(input_data)[0]
        probability = float(model.predict_proba(input_data)[0][1])

        risk = (
            "Low Risk" if probability < 0.3
            else "Medium Risk" if probability < 0.7
            else "High Risk"
        )

        prediction_record = Prediction(
        user_id=current_user.id,   # 🔥 THIS WAS MISSING
        loan_amnt=data.loan_amnt,
        annual_inc=data.annual_inc,
        int_rate=data.int_rate,
        prediction=int(prediction),
        default_probability=probability,
        risk_category=risk
    )
        print("USER:", current_user.id, current_user.email)

        db.add(prediction_record)
        db.commit()

        return {
            "prediction": int(prediction),
            "default_probability": probability,
            "risk_category": risk
        }

    except Exception as e:
        print("PREDICT ERROR:", e)
        return {"error": str(e)}

    finally:
        db.close()
    
# =========================
# HISTORY (FIXED SESSION SAFETY)
# =========================
@app.get("/history")
def get_prediction_history(current_user: User = Depends(get_current_user)):

    db = SessionLocal()

    try:
        predictions = db.query(Prediction).filter(
            Prediction.user_id == current_user.id
        ).order_by(Prediction.id.desc()).all()

        return [
            {
                "id": p.id,
                "loan_amount": p.loan_amnt,
                "annual_income": p.annual_inc,
                "interest_rate": p.int_rate,
                "prediction": p.prediction,
                "default_probability": p.default_probability,
                "risk_category": p.risk_category,
                "created_at": str(p.created_at)
            }
            for p in predictions
        ]

    finally:
        db.close()

# =========================
# ACCOUNT CREATION
# =========================
@app.post("/accounts")
def create_account(
    data: AccountCreate,
    current_user: User = Depends(get_current_user)
):

    db = SessionLocal()

    try:

        account_count = db.query(Account).count()

        account_number = (
            f"ACC{100000 + account_count + 1}"
        )

        account = Account(
            user_id=current_user.id,
            account_number=account_number,
            account_type=data.account_type,
            balance=0.0,
            status="Active"
        )

        db.add(account)
        db.commit()
        db.refresh(account)

        return {
            "message": "Account Created",
            "account_number": account.account_number
        }

    finally:
        db.close()


@app.get("/accounts")
def get_accounts(
    current_user: User = Depends(get_current_user)
):

    db = SessionLocal()

    try:

        accounts = db.query(Account).filter(
            Account.user_id == current_user.id
        ).all()

        return [
            {
                "id": a.id,
                "account_number": a.account_number,
                "account_type": a.account_type,
                "balance": a.balance,
                "status": a.status
            }
            for a in accounts
        ]

    finally:
        db.close()


@app.post("/deposit")
def deposit_money(
    data: TransactionRequest,
    current_user: User = Depends(get_current_user)
):

    db = SessionLocal()

    try:

        account = db.query(Account).filter(
            Account.id == data.account_id,
            Account.user_id == current_user.id
        ).first()

        if not account:
            return {"error": "Account not found"}

        account.balance += data.amount

        transaction = Transaction(
            account_id=account.id,
            transaction_type="DEPOSIT",
            amount=data.amount,
            description=data.description
        )

        db.add(transaction)
        db.commit()

        return {
            "message": "Deposit successful",
            "new_balance": account.balance
        }

    finally:
        db.close()


@app.post("/withdraw")
def withdraw_money(
    data: TransactionRequest,
    current_user: User = Depends(get_current_user)
):

    db = SessionLocal()

    try:

        account = db.query(Account).filter(
            Account.id == data.account_id,
            Account.user_id == current_user.id
        ).first()

        if not account:
            return {"error": "Account not found"}

        if account.balance < data.amount:
            return {"error": "Insufficient balance"}

        account.balance -= data.amount

        transaction = Transaction(
            account_id=account.id,
            transaction_type="WITHDRAW",
            amount=data.amount,
            description=data.description
        )

        db.add(transaction)
        db.commit()

        return {
            "message": "Withdrawal successful",
            "new_balance": account.balance
        }

    finally:
        db.close()


@app.get("/transactions")
def get_transactions(
    current_user: User = Depends(get_current_user)
):

    db = SessionLocal()

    try:

        transactions = (
            db.query(Transaction)
            .join(Account)
            .filter(Account.user_id == current_user.id)
            .order_by(Transaction.id.desc())
            .all()
        )

        return [
            {
                "id": t.id,
                "type": t.transaction_type,
                "amount": t.amount,
                "description": t.description,
                "created_at": str(t.created_at)
            }
            for t in transactions
        ]

    finally:
        db.close()


@app.post("/transfer")
def transfer_money(
    data: TransferRequest,
    current_user: User = Depends(get_current_user)
):

    db = SessionLocal()

    try:
        source_account = db.query(Account).filter(
            Account.id == data.source_account_id,
            Account.user_id == current_user.id
        ).first()

        if not source_account:
            return {"error": "Source account not found"}

        if source_account.account_number == data.destination_account_number:
            return {"error": "Cannot transfer to the same account"}

        destination_account = db.query(Account).filter(
            Account.account_number == data.destination_account_number
        ).first()

        if not destination_account:
            return {"error": "Destination account not found"}

        if source_account.balance < data.amount:
            return {"error": "Insufficient balance"}

        source_account.balance -= data.amount
        destination_account.balance += data.amount

        transfer_record = Transfer(
            source_account_id=source_account.id,
            destination_account_id=destination_account.id,
            amount=data.amount,
            description=data.description,
            status="COMPLETED"
        )

        db.add(transfer_record)

        db.add(Transaction(
            account_id=source_account.id,
            transaction_type="TRANSFER_OUT",
            amount=data.amount,
            description=f"Transfer to {destination_account.account_number}: {data.description or ''}".strip()
        ))

        db.add(Transaction(
            account_id=destination_account.id,
            transaction_type="TRANSFER_IN",
            amount=data.amount,
            description=f"Transfer from {source_account.account_number}: {data.description or ''}".strip()
        ))

        db.commit()

        return {
            "message": "Transfer successful",
            "new_balance": source_account.balance
        }

    finally:
        db.close()


@app.get("/transfers")
def get_transfers(
    current_user: User = Depends(get_current_user)
):

    db = SessionLocal()

    try:
        transfers = (
            db.query(Transfer)
            .order_by(Transfer.id.desc())
            .all()
        )

        results = []

        for transfer in transfers:
            if transfer.source_account and transfer.source_account.user_id == current_user.id:
                direction = "Sent"
                counterparty = transfer.destination_account.account_number
            elif transfer.destination_account and transfer.destination_account.user_id == current_user.id:
                direction = "Received"
                counterparty = transfer.source_account.account_number
            else:
                continue

            results.append({
                "id": transfer.id,
                "direction": direction,
                "source_account_number": transfer.source_account.account_number,
                "destination_account_number": transfer.destination_account.account_number,
                "amount": transfer.amount,
                "description": transfer.description,
                "status": transfer.status,
                "created_at": str(transfer.created_at),
                "counterparty": counterparty
            })

        return results

    finally:
        db.close()