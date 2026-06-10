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

