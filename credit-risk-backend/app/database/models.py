from sqlalchemy import Column
from sqlalchemy import Integer
from sqlalchemy import Float
from sqlalchemy import String
from sqlalchemy import DateTime

from datetime import datetime

from app.database.db import Base


class Prediction(Base):

    __tablename__ = "predictions"

    id = Column(Integer, primary_key=True, index=True)

    loan_amnt = Column(Float)
    annual_inc = Column(Float)
    int_rate = Column(Float)

    prediction = Column(Integer)

    default_probability = Column(Float)

    risk_category = Column(String)

    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )