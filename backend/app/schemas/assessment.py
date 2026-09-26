from typing import Optional, List, Dict, Any
from pydantic import BaseModel

class AssessmentQuestionDTO(BaseModel):
    id: str
    question_type: str
    prompt: str
    code_snippet: Optional[str] = None
    options: Optional[List[str]] = None
    points: int = 25

class SkillAssessmentDTO(BaseModel):
    id: str
    skill_name: str
    title: str
    description: Optional[str] = None
    difficulty: str
    time_limit_minutes: int
    passing_score: int
    questions: List[AssessmentQuestionDTO] = []

class AssessmentSubmissionRequest(BaseModel):
    answers: Dict[str, Any]  # question_id -> option_index or code string

class AssessmentResultResponse(BaseModel):
    assessment_id: str
    skill_name: str
    total_score: int
    passed: bool
    ai_feedback: str
    verified_level: Optional[str] = None
    new_confidence: int = 85
