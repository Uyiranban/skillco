import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Integer, DateTime, ForeignKey, Text, JSON
from sqlalchemy.orm import relationship
from backend.app.core.database import Base

class Profile(Base):
    __tablename__ = "profiles"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()), index=True)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False, index=True)
    full_name = Column(String(255), nullable=False)
    avatar_url = Column(String(500), nullable=True)
    headline = Column(String(255), nullable=True)
    location = Column(String(255), nullable=True)
    bio = Column(Text, nullable=True)
    education_summary = Column(String(255), nullable=True)
    graduation_year = Column(Integer, nullable=True)
    target_roles = Column(JSON, default=list, nullable=False)  # List[str]
    career_preferences = Column(JSON, default=dict, nullable=False)  # Dict with salary, remote, etc.
    metrics_cache = Column(JSON, default=dict, nullable=False)  # Cached career intelligence scores
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc), nullable=False)

    # Relationships
    user = relationship("User", back_populates="profile")
