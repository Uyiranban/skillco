import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Integer, DateTime, ForeignKey, Text, JSON
from sqlalchemy.orm import relationship
from backend.app.core.database import Base

class SkillEvidence(Base):
    __tablename__ = "skill_evidence"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()), index=True)
    user_skill_id = Column(String(36), ForeignKey("user_skills.id", ondelete="CASCADE"), nullable=False, index=True)
    evidence_type = Column(String(50), nullable=False)  # PROJECT, GITHUB, CERTIFICATE, TECHNICAL_ASSESSMENT, OTHER
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    url = Column(String(500), nullable=True)
    status = Column(String(50), default="PENDING_REVIEW", nullable=False)  # PENDING_REVIEW, SUPPORTED, VERIFIED, REJECTED
    relevance_score = Column(String(50), default="Medium", nullable=False)  # High, Medium, Low
    quality_score = Column(String(50), default="Moderate", nullable=False)  # Strong, Moderate, Weak
    ai_confidence = Column(Integer, default=50, nullable=False)
    metadata_json = Column(JSON, default=dict, nullable=False)  # detected tech, personal contribution, etc.
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc), nullable=False)

    # Relationships
    user_skill = relationship("UserSkill", back_populates="evidence_items")
    files = relationship("EvidenceFile", back_populates="evidence", cascade="all, delete-orphan")
    reviews = relationship("VerificationReview", back_populates="evidence", cascade="all, delete-orphan")

class EvidenceFile(Base):
    __tablename__ = "evidence_files"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()), index=True)
    evidence_id = Column(String(36), ForeignKey("skill_evidence.id", ondelete="CASCADE"), nullable=False, index=True)
    storage_path = Column(String(500), nullable=False)
    file_name = Column(String(255), nullable=False)
    mime_type = Column(String(100), nullable=False)
    file_size = Column(Integer, default=0, nullable=False)  # In bytes
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)

    # Relationships
    evidence = relationship("SkillEvidence", back_populates="files")

class VerificationReview(Base):
    __tablename__ = "verification_reviews"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()), index=True)
    evidence_id = Column(String(36), ForeignKey("skill_evidence.id", ondelete="CASCADE"), nullable=False, index=True)
    status = Column(String(50), nullable=False)  # SUPPORTED, VERIFIED, REJECTED
    ai_confidence = Column(Integer, default=50, nullable=False)
    relevance_score = Column(String(50), default="Medium", nullable=False)
    quality_score = Column(String(50), default="Moderate", nullable=False)
    detected_level = Column(String(50), nullable=True)
    reasoning = Column(Text, nullable=False)
    strengths = Column(JSON, default=list, nullable=False)  # List[str]
    gaps = Column(JSON, default=list, nullable=False)  # List[str]
    reviewed_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)

    # Relationships
    evidence = relationship("SkillEvidence", back_populates="reviews")
