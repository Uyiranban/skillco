import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from backend.app.core.config import settings
from backend.app.core.database import engine, Base
from backend.app.api.auth import router as auth_router
from backend.app.api.profiles import router as profiles_router
from backend.app.api.skills import router as skills_router
from backend.app.api.evidence import router as evidence_router
from backend.app.api.jobs import router as jobs_router
from backend.app.api.assessments import router as assessments_router
from backend.app.api.career import router as career_router
from backend.app.api.simulations import router as simulations_router
from backend.app.api.ai import router as ai_router
from backend.app.api.health import router as health_router

# Ensure tables exist
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="SkillPilot AI-Powered Career Intelligence Platform - FastAPI & PostgreSQL Backend",
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount local storage directory for uploaded evidence files
os.makedirs(settings.STORAGE_DIR, exist_ok=True)
app.mount("/api/storage", StaticFiles(directory=settings.STORAGE_DIR), name="storage")

# Include Routers
app.include_router(health_router, prefix=settings.API_V1_STR)
app.include_router(auth_router, prefix=settings.API_V1_STR)
app.include_router(profiles_router, prefix=settings.API_V1_STR)
app.include_router(skills_router, prefix=settings.API_V1_STR)
app.include_router(evidence_router, prefix=settings.API_V1_STR)
app.include_router(jobs_router, prefix=settings.API_V1_STR)
app.include_router(assessments_router, prefix=settings.API_V1_STR)
app.include_router(career_router, prefix=settings.API_V1_STR)
app.include_router(simulations_router, prefix=settings.API_V1_STR)
app.include_router(ai_router, prefix=settings.API_V1_STR)

@app.get("/")
def root():
    return {
        "app": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "docs": "/docs",
        "health": "/api/health"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.app.main:app", host="0.0.0.0", port=8000, reload=True)
