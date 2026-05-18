from fastapi import FastAPI
from sqlalchemy.orm import Session
from fastapi.middleware.cors import CORSMiddleware

from app.schemas.loan_schema import LoanApplication

import joblib
import json

from app.utils.preprocess import preprocess_input

# Database imports
from app.database.db import engine, SessionLocal
from app.database.models import Base, Prediction


# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI()
# CORS configuration
app.add_middleware(
    CORSMiddleware,

    allow_origins=[
        "http://localhost:5173"
    ],

    allow_credentials=True,

    allow_methods=["*"],

    allow_headers=["*"],
)


# Load trained model
model = joblib.load(
    "app/model/final_xgboost_model.pkl"
)


# Load feature columns
with open(
    "app/model/feature_columns.json",
    "r"
) as f:
    feature_columns = json.load(f)


@app.get("/")
def home():

    return {
        "message": "Credit Risk API Running"
    }


@app.post("/predict")
def predict_loan(data: LoanApplication):

    # Convert input to dataframe
    input_data = preprocess_input(
        data.dict(),
        feature_columns
    )

    # Prediction
    prediction = model.predict(input_data)[0]

    probability = float(
        model.predict_proba(input_data)[0][1]
    )

    # Risk categorization
    if probability < 0.3:
        risk = "Low Risk"

    elif probability < 0.7:
        risk = "Medium Risk"

    else:
        risk = "High Risk"

    # Save to database
    db = SessionLocal()

    prediction_record = Prediction(
        loan_amnt=data.loan_amnt,
        annual_inc=data.annual_inc,
        int_rate=data.int_rate,

        prediction=int(prediction),

        default_probability=probability,

        risk_category=risk
    )

    db.add(prediction_record)

    db.commit()

    db.close()

    # API response
    return {
        "prediction": int(prediction),
        "default_probability": probability,
        "risk_category": risk
    }

@app.get("/history")
def get_prediction_history():

    db = SessionLocal()

    predictions = db.query(Prediction).all()

    result = []

    for p in predictions:

        result.append({
            "id": p.id,
            "loan_amount": p.loan_amnt,
            "annual_income": p.annual_inc,
            "interest_rate": p.int_rate,

            "prediction": p.prediction,

            "default_probability": p.default_probability,

            "risk_category": p.risk_category,

            "created_at": p.created_at
        })

    db.close()

    return result