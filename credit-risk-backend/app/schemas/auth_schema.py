from pydantic import BaseModel
from pydantic import EmailStr

# REGISTER SCHEMA


class UserRegister(BaseModel):

    name: str

    email: EmailStr

    password: str


# LOGIN SCHEMA


class UserLogin(BaseModel):

    email: EmailStr

    password: str



# TOKEN RESPONSE


from pydantic import BaseModel
from typing import Optional

class TokenResponse(BaseModel):
    access_token: str
    token_type: str
    role: str
    name: Optional[str] = None
    email: Optional[str] = None