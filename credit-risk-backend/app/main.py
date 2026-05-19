from fastapi import FastAPI
from sqlalchemy.orm import Session
from fastapi.middleware.cors import CORSMiddleware

import joblib
import json

from app.schemas.loan_schema import LoanApplication
from app.utils.preprocess import preprocess_input
from app.auth.deps import get_current_user
from fastapi import Depends
from app.database.db import engine, SessionLocal
from app.database.models import Base, Prediction
from app.database.models import User
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
    data: LoanApplication,
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