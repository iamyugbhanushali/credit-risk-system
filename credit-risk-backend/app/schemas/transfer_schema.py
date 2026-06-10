from pydantic import BaseModel


class TransferRequest(BaseModel):
    source_account_id: int
    destination_account_number: str
    amount: float
    description: str | None = None
