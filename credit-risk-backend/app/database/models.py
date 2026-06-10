# from sqlalchemy import Column
# from sqlalchemy import Integer
# from sqlalchemy import Float
# from sqlalchemy import String
# from sqlalchemy import DateTime
# from sqlalchemy import ForeignKey

# from sqlalchemy.orm import relationship

# from datetime import datetime

# from app.database.db import Base


# # =========================
# # USER MODEL
# # =========================

# class User(Base):

#     __tablename__ = "users"

#     id = Column(
#         Integer,
#         primary_key=True,
#         index=True
#     )

#     name = Column(
#         String,
#         nullable=False
#     )

#     email = Column(
#         String,
#         unique=True,
#         nullable=False
#     )

#     password = Column(
#         String,
#         nullable=False
#     )

#     role = Column(
#         String,
#         default="borrower"
#     )

#     created_at = Column(
#         DateTime,
#         default=datetime.utcnow
#     )

#     predictions = relationship(
#         "Prediction",
#         back_populates="user"
#     )


# # =========================
# # PREDICTION MODEL
# # =========================

# class Prediction(Base):

#     __tablename__ = "predictions"

#     id = Column(
#         Integer,
#         primary_key=True,
#         index=True
#     )

#     user_id = Column(
#         Integer,
#         ForeignKey("users.id")
#     )

#     loan_amnt = Column(Float)

#     annual_inc = Column(Float)

#     int_rate = Column(Float)

#     prediction = Column(Integer)

#     default_probability = Column(Float)

#     risk_category = Column(String)

#     created_at = Column(
#         DateTime,
#         default=datetime.utcnow
#     )

#     user = relationship(
#         "User",
#         back_populates="predictions"
#     )

from sqlalchemy import Column, Integer, Float, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database.db import Base


class User(Base):

    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)

    name = Column(String, nullable=False)

    email = Column(String, unique=True, nullable=False)

    password = Column(String, nullable=False)

    role = Column(String, default="borrower")

    created_at = Column(DateTime, default=datetime.utcnow)

    predictions = relationship(
        "Prediction",
        back_populates="user"
    )

    accounts = relationship(
        "Account",
        back_populates="user"
    )

    beneficiaries = relationship(
        "Beneficiary",
        back_populates="user"
    )

    loan_applications = relationship(
        "LoanApplication",
        back_populates="user"
    )

    financial_health_score = relationship(
        "FinancialHealthScore",
        back_populates="user",
        uselist=False
    )

class Account(Base):
    __tablename__ = "accounts"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(
        Integer,
        ForeignKey("users.id")
    )

    account_number = Column(
        String,
        unique=True,
        nullable=False
    )

    account_type = Column(
        String,
        default="Savings"
    )

    balance = Column(
        Float,
        default=0.0
    )

    status = Column(
        String,
        default="Active"
    )

    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )

    user = relationship(
        "User",
        back_populates="accounts"
    )

    transactions = relationship(
    "Transaction",
    back_populates="account"
)


class Prediction(Base):
    __tablename__ = "predictions"

    id = Column(Integer, primary_key=True, index=True)

    # ✅ FIX: allow NULL temporarily (prevents crash if DB not migrated yet)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)

    loan_amnt = Column(Float)
    annual_inc = Column(Float)
    int_rate = Column(Float)

    prediction = Column(Integer)
    default_probability = Column(Float)
    risk_category = Column(String)

    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="predictions")

class Transaction(Base):
    __tablename__ = "transactions"

    id = Column(Integer, primary_key=True, index=True)

    account_id = Column(
        Integer,
        ForeignKey("accounts.id")
    )

    transaction_type = Column(
        String,
        nullable=False
    )

    amount = Column(
        Float,
        nullable=False
    )

    description = Column(
        String,
        nullable=True
    )

    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )

    account = relationship(
        "Account",
        back_populates="transactions"
    )


class Transfer(Base):
    __tablename__ = "transfers"

    id = Column(Integer, primary_key=True, index=True)

    source_account_id = Column(
        Integer,
        ForeignKey("accounts.id"),
        nullable=False
    )

    destination_account_id = Column(
        Integer,
        ForeignKey("accounts.id"),
        nullable=False
    )

    amount = Column(Float, nullable=False)
    description = Column(String, nullable=True)
    status = Column(String, default="COMPLETED")

    created_at = Column(DateTime, default=datetime.utcnow)

    source_account = relationship(
        "Account",
        foreign_keys=[source_account_id]
    )

    destination_account = relationship(
        "Account",
        foreign_keys=[destination_account_id]
    )

class Beneficiary(Base):
    __tablename__ = "beneficiaries"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    beneficiary_name = Column(String, nullable=False)
    beneficiary_account_number = Column(String, nullable=False)
    bank_name = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="beneficiaries")


class LoanApplication(Base):
    __tablename__ = "loan_applications"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    loan_amount = Column(Float, nullable=False)
    tenure_months = Column(Integer, nullable=False)
    annual_income = Column(Float, nullable=False)
    existing_loans = Column(Integer, default=0)
    approval_status = Column(String, default="PENDING")
    risk_assessment = Column(String, nullable=True)
    default_probability = Column(Float, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="loan_applications")


class FinancialHealthScore(Base):
    __tablename__ = "financial_health_scores"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    overall_score = Column(Float, nullable=False)
    score_category = Column(String, nullable=False)
    balance_score = Column(Float, nullable=False)
    transaction_score = Column(Float, nullable=False)
    credit_score = Column(Float, nullable=False)
    last_updated = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="financial_health_score")
