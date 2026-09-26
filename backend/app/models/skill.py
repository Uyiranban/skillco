import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Integer, DateTime, ForeignKey, Index
from sqlalchemy.orm import relationship
from backend.app.core.database import Base

class Skill(Base):
    __tablename__ = "skills"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()), index=True)
    name = Column(String(100), unique=True, index=True, nullable=False)
    category = Column(String(50), nullable=False, default="Frontend")  # Frontend, Backend, Data, Cloud, Tools, AI, General
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)

    # Relationships
    user_skills = relationship("UserSkill", back_populates="skill")
    job_skills = relationship("JobSkill", back_populates="skill")
    career_path_steps = relationship("CareerPathStep", back_populates="skill")
    assessments = relationship("SkillAssessment", back_populates="skill")

class UserSkill(Base):
    __tablename__ = "user_skills"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()), index=True)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    skill_id = Column(String(36), ForeignKey("skills.id", ondelete="CASCADE"), nullable=False, index=True)
    claimed_level = Column(String(50), default="Intermediate", nullable=False)  # Beginner, Intermediate, Advanced, Expert
    verified_level = Column(String(50), nullable=True)  # Beginner, Intermediate, Advanced, Expert
    status = Column(String(50), default="CLAIMED", nullable=False)  # CLAIMED, PENDING_REVIEW, SUPPORTED, VERIFIED, REJECTED
    confidence = Column(Integer, default=50, nullable=False)  # 0-100
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc), nullable=False)

    # Relationships
    user = relationship("User", back_populates="user_skills")
    skill = relationship("Skill", back_populates="user_skills")
    evidence_items = relationship("SkillEvidence", back_populates="user_skill", cascade="all, delete-orphan")

    __table_args__ = (
        Index("idx_user_skill_unique", "user_id", "skill_id", unique=True),
    )

class SkillGap(Base):
    __tablename__ = "skill_gaps"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()), index=True)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    skill_id = Column(String(36), ForeignKey("skills.id", ondelete="CASCADE"), nullable=False, index=True)
    importance = Column(String(50), default="high", nullable=False)
    impact_score = Column(Integer, default=80, nullable=False)
    roles_unlocked_count = Column(Integer, default=5, nullable=False)
    estimated_weeks = Column(Integer, default=3, nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
