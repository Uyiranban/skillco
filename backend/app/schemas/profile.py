from typing import Optional, List, Dict, Any
from pydantic import BaseModel

class ProfileUpdateRequest(BaseModel):
    full_name: Optional[str] = None
    avatar_url: Optional[str] = None
    headline: Optional[str] = None
    location: Optional[str] = None
    bio: Optional[str] = None
    education_summary: Optional[str] = None
    graduation_year: Optional[int] = None
    target_roles: Optional[List[str]] = None
    career_preferences: Optional[Dict[str, Any]] = None

class ProfileResponse(BaseModel):
    id: str
    user_id: str
    full_name: str
    avatar_url: Optional[str] = None
    headline: Optional[str] = None
    location: Optional[str] = None
    bio: Optional[str] = None
    education_summary: Optional[str] = None
    graduation_year: Optional[int] = None
    target_roles: List[str] = []
    career_preferences: Dict[str, Any] = {}
    metrics_cache: Dict[str, Any] = {}
    created_at: str
    updated_at: str

    class Config:
        from_attributes = True
