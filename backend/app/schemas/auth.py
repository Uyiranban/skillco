from typing import Optional
from pydantic import BaseModel, EmailStr

class UserRegisterRequest(BaseModel):
    email: EmailStr
    password: str
    full_name: str
    headline: Optional[str] = "Software Engineer"
    location: Optional[str] = "San Francisco, CA"

class UserLoginRequest(BaseModel):
    email: EmailStr
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user_id: str
    email: str

class UserResponse(BaseModel):
    id: str
    email: str
    full_name: Optional[str] = None
    avatar_url: Optional[str] = None
    created_at: str

    class Config:
        from_attributes = True
