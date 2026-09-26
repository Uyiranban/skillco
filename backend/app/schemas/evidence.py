from typing import Optional, List, Dict, Any
from pydantic import BaseModel

class EvidenceSubmitRequest(BaseModel):
    skill_name: str
    evidence_type: str  # PROJECT, GITHUB, CERTIFICATE, TECHNICAL_ASSESSMENT, OTHER
    title: str
    description: Optional[str] = None
    url: Optional[str] = None
    claimed_level: Optional[str] = "Intermediate"
    target_role: Optional[str] = "Frontend Engineer"
    personal_contribution: Optional[str] = None
    relevant_paths: Optional[str] = None
    certificate_id: Optional[str] = None
    issuer: Optional[str] = None
    code_snippet: Optional[str] = None
    attached_files: Optional[List[Dict[str, Any]]] = None

class VerificationReviewResponse(BaseModel):
    id: str
    evidence_id: str
    status: str  # SUPPORTED, VERIFIED, REJECTED
    ai_confidence: int
    relevance_score: str
    quality_score: str
    detected_level: Optional[str] = None
    reasoning: str
    strengths: List[str] = []
    gaps: List[str] = []
    reviewed_at: str

    class Config:
        from_attributes = True

class EvidenceResponse(BaseModel):
    id: str
    user_skill_id: str
    skill_name: str
    evidence_type: str
    title: str
    description: Optional[str] = None
    url: Optional[str] = None
    status: str
    relevance_score: str
    quality_score: str
    ai_confidence: int
    review: Optional[VerificationReviewResponse] = None
    created_at: str

    class Config:
        from_attributes = True
