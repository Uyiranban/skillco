from typing import Optional, List, Dict, Any
from pydantic import BaseModel

class ChatMessageRequest(BaseModel):
    message: str
    conversation_id: Optional[str] = None
    target_role: Optional[str] = "Frontend Engineer"
    active_tab: Optional[str] = "overview"

class ChatActionBadge(BaseModel):
    label: str
    type: str  # action, filter, simulation, drilldown
    query: Optional[str] = None
    action_type: Optional[str] = None
    skill_name: Optional[str] = None

class ChatMessageResponse(BaseModel):
    conversation_id: str
    reply: str
    suggested_actions: List[str] = []
    action_badges: List[ChatActionBadge] = []
    timestamp: str

class AIAnalysisRequest(BaseModel):
    skill_name: str
    claimed_level: str
    target_role: str
    evidence_type: str
    title: str
    description: Optional[str] = None
    url: Optional[str] = None
    personal_contribution: Optional[str] = None
    code_snippet: Optional[str] = None
