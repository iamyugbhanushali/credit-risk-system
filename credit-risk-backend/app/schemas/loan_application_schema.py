from pydantic import BaseModel


class LoanApplicationCreate(BaseModel):
    loan_amount: float
    tenure_months: int
    annual_income: float
    existing_loans: int = 0


class LoanApplicationResponse(BaseModel):
    id: int
    user_id: int
    loan_amount: float
    tenure_months: int
    annual_income: float
    existing_loans: int
    approval_status: str
    risk_assessment: str | None
    default_probability: float | None
    created_at: str

    class Config:
        from_attributes = True
