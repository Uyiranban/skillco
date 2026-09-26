from typing import Optional, List, Dict, Any
from pydantic import BaseModel

class CareerPathStepDTO(BaseModel):
    id: str
    skill_name: str
    step_order: int
    estimated_duration: str
    description: Optional[str] = None
    required_level: str
    current_status: Optional[str] = "CLAIMED"
    current_confidence: Optional[int] = 0

class CareerPathDTO(BaseModel):
    id: str
    name: str
    target_role: str
    description: Optional[str] = None
    steps: List[CareerPathStepDTO] = []
    progress_percentage: int = 0
