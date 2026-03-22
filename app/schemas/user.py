from pydantic import BaseModel, EmailStr, Field, field_validator
from datetime import datetime
from app.enums.user import UserRole
import re


class UserCreate(BaseModel):
    name: str = Field(..., min_length=2)
    email: EmailStr
    password: str = Field(..., min_length=8, max_length=128)

    @field_validator("password")
    @classmethod
    def password_strength(cls, v: str) -> str:
        if not re.search(r"[A-Z]", v):
            raise ValueError("Password must contain at least one uppercase letter.")
        if not re.search(r"[0-9]", v):
            raise ValueError("Password must contain at least one digit.")
        if not re.search(r"[^a-zA-Z0-9]", v):
            raise ValueError("Password must contain at least one special character.")
        return v
    
    @field_validator("name")
    @classmethod
    def name_no_special_chars(cls, v: str) -> str:
        if not re.match(r"^[a-zA-Z\s\-']+$", v):
            raise ValueError("Name contains invalid characters.")
        return v.strip()
    
class UserUpdate(BaseModel):
    name: str | None = Field(default=None, min_length=2, max_length=64)
    email: EmailStr | None = None

class UserChangePassword(BaseModel):
    current_password: str
    new_password: str = Field(..., min_length=8, max_length=128)

    @field_validator("new_password")
    @classmethod
    def password_strength(cls, v: str) -> str:
        if not re.search(r"[A-Z]", v):
            raise ValueError("Password must contain at least one uppercase letter.")
        if not re.search(r"[0-9]", v):
            raise ValueError("Password must contain at least one digit.")
        if not re.search(r"[^a-zA-Z0-9]", v):
            raise ValueError("Password must contain at least one special character.")
        return v
    
class UserForgotPassword(BaseModel):
    email: EmailStr


class UserResetPassword(BaseModel):
    email: str
    otp: str
    new_password: str = Field(..., min_length=8, max_length=128)


class UserVerifyEmail(BaseModel):
    user_id: str
    otp: str


class UserResponse(BaseModel):

    id: str
    name: str
    email: str
    role: UserRole
    is_active: bool
    is_verified: bool
    created_at: datetime
    updated_at: datetime
    last_login_at: datetime | None = None


class UserMeResponse(UserResponse):
    pass


class UserAdminResponse(UserResponse):
    verification_token: str | None = None
    reset_password_token: str | None = None

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"