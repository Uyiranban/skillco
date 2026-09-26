from typing import Optional, List, Dict, Any
from pydantic import BaseModel

class JobSkillRequirementDTO(BaseModel):
    skill_name: str
    category: Optional[str] = "Frontend"
    importance: str  # critical, high, medium, nice-to-have
    weight: float = 1.0
    minimum_level: str = "Intermediate"
    required: bool = True

class JobResponse(BaseModel):
    id: str
    title: str
    company: str
    location: str
    employment_type: str
    work_mode: str
    department: Optional[str] = None
    experience_level: str
    experience_years_required: int
    education_required: str
    salary_min: int
    salary_max: int
    description: str
    responsibilities: List[str] = []
    benefits: List[str] = []
    growth_index: int = 85
    posted_date: str = "Recently"
    required_skills: List[JobSkillRequirementDTO] = []

    class Config:
        from_attributes = True

class JobMatchResultDTO(BaseModel):
    job: JobResponse
    match_score: int
    matched_skills: List[Dict[str, Any]] = []
    partial_skills: List[Dict[str, Any]] = []
    missing_skills: List[Dict[str, Any]] = []
    score_breakdown: Dict[str, Any] = {}
    verified_boost: int = 0
    readiness_level: str = "Strong Fit"
    growth_index: int = 85
