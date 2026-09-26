import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Integer, Boolean, DateTime, ForeignKey, Text, JSON
from sqlalchemy.orm import relationship
from backend.app.core.database import Base

class SkillAssessment(Base):
    __tablename__ = "skill_assessments"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()), index=True)
    skill_id = Column(String(36), ForeignKey("skills.id", ondelete="CASCADE"), nullable=False, index=True)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    difficulty = Column(String(50), default="Intermediate", nullable=False)  # Beginner, Intermediate, Advanced
    time_limit_minutes = Column(Integer, default=20, nullable=False)
    passing_score = Column(Integer, default=75, nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)

    # Relationships
    skill = relationship("Skill", back_populates="assessments")
    questions = relationship("AssessmentQuestion", back_populates="assessment", cascade="all, delete-orphan")

class AssessmentQuestion(Base):
    __tablename__ = "assessment_questions"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()), index=True)
    assessment_id = Column(String(36), ForeignKey("skill_assessments.id", ondelete="CASCADE"), nullable=False, index=True)
    question_type = Column(String(50), default="multiple_choice", nullable=False)  # multiple_choice, code_challenge, architectural
    prompt = Column(Text, nullable=False)
    code_snippet = Column(Text, nullable=True)
    options = Column(JSON, default=list, nullable=True)  # List[str] for multiple choice
    correct_option_index = Column(Integer, nullable=True)
    rubric = Column(JSON, default=dict, nullable=True)  # Criteria for code grading
    points = Column(Integer, default=25, nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)

    # Relationships
    assessment = relationship("SkillAssessment", back_populates="questions")
    answers = relationship("AssessmentAnswer", back_populates="question", cascade="all, delete-orphan")

class AssessmentAnswer(Base):
    __tablename__ = "assessment_answers"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()), index=True)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    question_id = Column(String(36), ForeignKey("assessment_questions.id", ondelete="CASCADE"), nullable=False, index=True)
    selected_option = Column(Integer, nullable=True)
    submitted_code = Column(Text, nullable=True)
    score_awarded = Column(Integer, default=0, nullable=False)
    ai_feedback = Column(Text, nullable=True)
    passed = Column(Boolean, default=False, nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)

    # Relationships
    user = relationship("User", back_populates="assessment_answers")
    question = relationship("AssessmentQuestion", back_populates="answers")

class AssessmentAttempt(Base):
    __tablename__ = "assessment_attempts"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()), index=True)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    assessment_id = Column(String(36), ForeignKey("skill_assessments.id", ondelete="CASCADE"), nullable=False, index=True)
    total_score = Column(Integer, default=0, nullable=False)
    passed = Column(Boolean, default=False, nullable=False)
    feedback = Column(Text, nullable=True)
    completed_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
