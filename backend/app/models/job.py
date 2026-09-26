import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Integer, Float, Boolean, DateTime, ForeignKey, Text, JSON
from sqlalchemy.orm import relationship
from backend.app.core.database import Base

class Job(Base):
    __tablename__ = "jobs"

    id = Column(String(50), primary_key=True, default=lambda: str(uuid.uuid4()), index=True)
    title = Column(String(255), index=True, nullable=False)
    company = Column(String(255), index=True, nullable=False)
    location = Column(String(255), nullable=False)
    employment_type = Column(String(50), default="Full-time", nullable=False)  # Full-time, Contract, Remote
    work_mode = Column(String(50), default="Hybrid", nullable=False)  # Remote, Hybrid, On-site
    department = Column(String(100), nullable=True)
    experience_level = Column(String(50), default="Mid-Senior", nullable=False)  # Junior, Mid-Level, Senior, Lead
    experience_years_required = Column(Integer, default=3, nullable=False)
    education_required = Column(String(100), default="Bachelor's in CS or equivalent", nullable=False)
    salary_min = Column(Integer, default=100000, nullable=False)
    salary_max = Column(Integer, default=150000, nullable=False)
    description = Column(Text, nullable=False)
    responsibilities = Column(JSON, default=list, nullable=False)  # List[str]
    benefits = Column(JSON, default=list, nullable=False)  # List[str]
    growth_index = Column(Integer, default=85, nullable=False)
    posted_date = Column(String(50), default="Recently", nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc), nullable=False)

    # Relationships
    required_skills = relationship("JobSkill", back_populates="job", cascade="all, delete-orphan")

class JobSkill(Base):
    __tablename__ = "job_skills"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()), index=True)
    job_id = Column(String(50), ForeignKey("jobs.id", ondelete="CASCADE"), nullable=False, index=True)
    skill_id = Column(String(36), ForeignKey("skills.id", ondelete="CASCADE"), nullable=False, index=True)
    importance = Column(String(50), default="high", nullable=False)  # critical, high, medium, nice-to-have
    weight = Column(Float, default=1.0, nullable=False)
    minimum_level = Column(String(50), default="Intermediate", nullable=False)  # Beginner, Intermediate, Advanced, Expert
    required = Column(Boolean, default=True, nullable=False)

    # Relationships
    job = relationship("Job", back_populates="required_skills")
    skill = relationship("Skill", back_populates="job_skills")

class JobMatch(Base):
    __tablename__ = "job_matches"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()), index=True)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    job_id = Column(String(50), ForeignKey("jobs.id", ondelete="CASCADE"), nullable=False, index=True)
    overall_score = Column(Integer, default=0, nullable=False)
    skill_coverage_score = Column(Integer, default=0, nullable=False)
    skill_importance_score = Column(Integer, default=0, nullable=False)
    experience_alignment_score = Column(Integer, default=0, nullable=False)
    evidence_quality_score = Column(Integer, default=0, nullable=False)
    education_match_score = Column(Integer, default=0, nullable=False)
    preference_match_score = Column(Integer, default=0, nullable=False)
    breakdown_json = Column(JSON, default=dict, nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc), nullable=False)
