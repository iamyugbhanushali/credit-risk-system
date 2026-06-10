from pydantic import BaseModel


class AccountCreate(BaseModel):
    account_type: str


class AccountResponse(BaseModel):
    id: int
    account_number: str
    account_type: str
    balance: float
    status: str

    class Config:
        from_attributes = True