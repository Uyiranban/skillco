from typing import Optional, List, Dict, Any
from pydantic import BaseModel

class SimulatedSkillItem(BaseModel):
    name: str
    target_level: str = "Advanced"
    target_status: str = "VERIFIED"
    target_confidence: int = 90

class WhatIfSimulationRequest(BaseModel):
    hypothetical_skills: List[SimulatedSkillItem]
    save_simulation: bool = False
    title: Optional[str] = "What-If Scenario"

class WhatIfSimulationResponse(BaseModel):
    before_readiness: int
    after_readiness: int
    readiness_delta: int
    before_top_matches: List[Dict[str, Any]]
    after_top_matches: List[Dict[str, Any]]
    unlocked_roles_count: int
    estimated_salary_uplift: int
    skill_impact_breakdown: List[Dict[str, Any]]
