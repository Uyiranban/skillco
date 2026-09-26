import os
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import text
from backend.app.core.database import get_db
from backend.app.core.config import settings

router = APIRouter(tags=["Health"])

@router.get("/health")
def health_check(db: Session = Depends(get_db)):
    db_status = "healthy"
    try:
        db.execute(text("SELECT 1"))
    except Exception as e:
        db_status = f"unhealthy: {str(e)}"

    gemini_status = "configured" if settings.GEMINI_API_KEY else "unconfigured (using heuristic fallback)"

    return {
        "status": "online",
        "api": "healthy",
        "version": settings.VERSION,
        "database": db_status,
        "ai_engine": gemini_status,
        "storage": settings.STORAGE_BACKEND
    }
