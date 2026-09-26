from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from backend.app.core.database import get_db
from backend.app.models.user import User
from backend.app.models.profile import Profile
from backend.app.schemas.profile import ProfileUpdateRequest, ProfileResponse
from backend.app.api.deps import get_current_user_optional

router = APIRouter(prefix="/profile", tags=["Profile"])

@router.get("", response_model=ProfileResponse)
def get_profile(user: User = Depends(get_current_user_optional), db: Session = Depends(get_db)):
    profile = db.query(Profile).filter(Profile.user_id == user.id).first()
    if not profile:
        profile = Profile(
            user_id=user.id,
            full_name="Alex Morgan",
            headline="Frontend Engineer | React & TypeScript Specialist",
            location="San Francisco, CA (Open to Hybrid/Remote)",
            bio="Frontend Engineer with 3+ years building high-performance web apps.",
            education_summary="B.S. in Computer Science, UC Berkeley (2022)",
            graduation_year=2022,
            target_roles=["Frontend Engineer", "Full Stack Developer"],
            career_preferences={
                "workMode": "Hybrid",
                "targetSalaryMin": 140000,
                "targetSalaryMax": 175000,
                "locations": ["San Francisco, CA", "Remote"]
            }
        )
        db.add(profile)
        db.commit()
        db.refresh(profile)

    return ProfileResponse(
        id=profile.id,
        user_id=profile.user_id,
        full_name=profile.full_name,
        avatar_url=profile.avatar_url,
        headline=profile.headline,
        location=profile.location,
        bio=profile.bio,
        education_summary=profile.education_summary,
        graduation_year=profile.graduation_year,
        target_roles=profile.target_roles or [],
        career_preferences=profile.career_preferences or {},
        metrics_cache=profile.metrics_cache or {},
        created_at=profile.created_at.isoformat(),
        updated_at=profile.updated_at.isoformat()
    )

@router.put("", response_model=ProfileResponse)
def update_profile(
    request: ProfileUpdateRequest,
    user: User = Depends(get_current_user_optional),
    db: Session = Depends(get_db)
):
    profile = db.query(Profile).filter(Profile.user_id == user.id).first()
    if not profile:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Profile not found")

    update_data = request.model_dump(exclude_unset=True)
    for k, v in update_data.items():
        setattr(profile, k, v)
    
    db.commit()
    db.refresh(profile)

    return ProfileResponse(
        id=profile.id,
        user_id=profile.user_id,
        full_name=profile.full_name,
        avatar_url=profile.avatar_url,
        headline=profile.headline,
        location=profile.location,
        bio=profile.bio,
        education_summary=profile.education_summary,
        graduation_year=profile.graduation_year,
        target_roles=profile.target_roles or [],
        career_preferences=profile.career_preferences or {},
        metrics_cache=profile.metrics_cache or {},
        created_at=profile.created_at.isoformat(),
        updated_at=profile.updated_at.isoformat()
    )
