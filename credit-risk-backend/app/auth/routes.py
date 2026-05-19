from fastapi import APIRouter
from fastapi import Depends
from fastapi import HTTPException
from fastapi import status

from sqlalchemy.orm import Session

from app.database.db import SessionLocal
from app.database.models import User
from google.oauth2 import id_token
from app.auth.jwt import create_access_token
from app.database.db import SessionLocal
from app.database.models import User

from google.auth.transport import requests
import os
from dotenv import load_dotenv

load_dotenv()

GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")
print("GOOGLE CLIENT ID:", GOOGLE_CLIENT_ID)
from app.schemas.auth_schema import (
    UserRegister,
    UserLogin,
    TokenResponse
)

from app.auth.auth_handler import (
    hash_password,
    verify_password,
    create_access_token
)


router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)


def get_db():
    """
    Creates a new database session for each request.
    """

    db = SessionLocal()

    try:
        yield db

    finally:
        db.close()


@router.post(
    "/register",
    status_code=status.HTTP_201_CREATED
)
def register_user(
    user: UserRegister,
    db: Session = Depends(get_db)
):
    """
    Registers a new borrower account.
    """

    existing_user = db.query(User).filter(
        User.email == user.email
    ).first()

    if existing_user:

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )

    hashed_password = hash_password(user.password)

    new_user = User(
        name=user.name,
        email=user.email,
        password=hashed_password,
        role="borrower"
    )

    db.add(new_user)

    db.commit()

    db.refresh(new_user)

    return {
        "message": "User registered successfully"
    }


@router.post(
    "/login",
    response_model=TokenResponse
)
def login_user(
    user: UserLogin,
    db: Session = Depends(get_db)
):
    """
    Authenticates user and returns JWT token.
    """

    existing_user = db.query(User).filter(
        User.email == user.email
    ).first()

    if not existing_user:

        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )

    if existing_user.password != "google_oauth_user":
        is_valid_password = verify_password(
            user.password,
            existing_user.password
        )

        if not is_valid_password:
            raise HTTPException(...)
    else:
        raise HTTPException(
            status_code=400,
            detail="Use Google login for this account"
        )

    token_payload = {
        "sub": existing_user.email,
        "role": existing_user.role
    }

    access_token = create_access_token(
        token_payload
    )

    return {
            "access_token": access_token,
            "token_type": "bearer",
            "role": existing_user.role,
            "name": existing_user.name,
            "email": existing_user.email
        }

@router.post("/google-login")
def google_login(
    token_data: dict,
    db: Session = Depends(get_db)
):

    try:
        token = token_data.get("credential")  # OK

        if not token:
            raise HTTPException(status_code=400, detail="Missing token")

        google_user = id_token.verify_oauth2_token(
            token,
            requests.Request(),
            GOOGLE_CLIENT_ID
        )

        print("GOOGLE USER:", google_user) 
        # 🔥 DEBUG

        email = google_user["email"]
        name = google_user.get("name", "Google User")

        existing_user = db.query(User).filter(
            User.email == email
        ).first()

        if not existing_user:
            existing_user = User(
                name=name,
                email=email,
                password="google_oauth_user",
                role="borrower"
            )

            db.add(existing_user)
            db.commit()
            db.refresh(existing_user)

        access_token = create_access_token({
            "sub": existing_user.email,
            "role": existing_user.role
        })

        return {
            "access_token": access_token,
            "token_type": "bearer",
            "role": existing_user.role,
            "name": existing_user.name,
            "email": existing_user.email
        }

    except Exception as e:
        print("GOOGLE LOGIN ERROR:", str(e))
        raise HTTPException(
            status_code=401,
            detail=f"Invalid Google token: {str(e)}"
        )