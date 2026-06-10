from pydantic import BaseModel


class FinancialHealthScoreResponse(BaseModel):
    score: float
    category: str
    balance_health: float
    transaction_health: float
    credit_health: float
    recommendations: list[str]

    class Config:
        from_attributes = True
