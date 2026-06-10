from pydantic import BaseModel


class BeneficiaryCreate(BaseModel):
    beneficiary_name: str
    beneficiary_account_number: str
    bank_name: str | None = None


class BeneficiaryResponse(BaseModel):
    id: int
    beneficiary_name: str
    beneficiary_account_number: str
    bank_name: str | None
    created_at: str

    class Config:
        from_attributes = True
