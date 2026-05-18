from pydantic import BaseModel


class LoanApplication(BaseModel):

    loan_amnt: float
    term: int
    int_rate: float
    installment: float
    annual_inc: float
    dti: float
    delinq_2yrs: float
    inq_last_6mths: float
    open_acc: float
    pub_rec: float
    revol_util: float
    total_acc: float
    bc_util: float

    home_ownership: str
    purpose: str
    application_type: str