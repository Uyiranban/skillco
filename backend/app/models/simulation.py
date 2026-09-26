import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from backend.app.core.database import Base

class WhatIfSimulation(Base):
    __tablename__ = "what_if_simulations"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()), index=True)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    title = Column(String(255), nullable=False)
    base_state = Column(JSON, default=dict, nullable=False)  # Snapshot of candidate profile
    hypothetical_skills = Column(JSON, default=list, nullable=False)  # Skills simulated & target levels
    projected_results = Column(JSON, default=dict, nullable=False)  # Calculated match scores, gaps, salary delta
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)

    # Relationships
    user = relationship("User", back_populates="what_if_simulations")
