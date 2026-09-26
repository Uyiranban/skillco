from typing import Optional, List, Dict, Any
from pydantic import BaseModel

class SkillCreateRequest(BaseModel):
    name: str
    category: Optional[str] = "Frontend"
    claimed_level: Optional[str] = "Intermediate"

class UserSkillResponse(BaseModel):
    id: str
    user_id: str
    skill_id: str
    name: str
    category: str
    claimed_level: str
    verified_level: Optional[str] = None
    status: str  # CLAIMED, PENDING_REVIEW, SUPPORTED, VERIFIED, REJECTED
    confidence: int
    evidence_count: int = 0
    created_at: str
    updated_at: str

    class Config:
        from_attributes = True

class SkillItemDTO(BaseModel):
    id: str
    name: str
    category: str
    level: str
    claimedLevel: Optional[str] = None
    verifiedLevel: Optional[str] = None
    verificationStatus: str
    confidence: int
    evidenceCount: int = 0
    confidenceBreakdown: Optional[Dict[str, int]] = None
    timeline: Optional[List[Dict[str, Any]]] = None
