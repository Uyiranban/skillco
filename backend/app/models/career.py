import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Integer, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from backend.app.core.database import Base

class CareerPath(Base):
    __tablename__ = "career_paths"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()), index=True)
    name = Column(String(255), unique=True, index=True, nullable=False)
    target_role = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)

    # Relationships
    steps = relationship("CareerPathStep", back_populates="career_path", cascade="all, delete-orphan", order_by="CareerPathStep.step_order")

class CareerPathStep(Base):
    __tablename__ = "career_path_steps"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()), index=True)
    career_path_id = Column(String(36), ForeignKey("career_paths.id", ondelete="CASCADE"), nullable=False, index=True)
    skill_id = Column(String(36), ForeignKey("skills.id", ondelete="CASCADE"), nullable=False, index=True)
    step_order = Column(Integer, default=1, nullable=False)
    estimated_duration = Column(String(50), default="3-4 weeks", nullable=False)
    description = Column(Text, nullable=True)
    required_level = Column(String(50), default="Advanced", nullable=False)

    # Relationships
    career_path = relationship("CareerPath", back_populates="steps")
    skill = relationship("Skill", back_populates="career_path_steps")
