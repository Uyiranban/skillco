from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from backend.app.core.database import get_db
from backend.app.models.user import User
from backend.app.models.skill import Skill, UserSkill
from backend.app.schemas.skill import SkillCreateRequest, UserSkillResponse, SkillItemDTO
from backend.app.repositories.skill_repository import SkillRepository
from backend.app.api.deps import get_current_user_optional

router = APIRouter(prefix="/skills", tags=["Skills"])

@router.get("", response_model=List[UserSkillResponse])
def get_user_skills(user: User = Depends(get_current_user_optional), db: Session = Depends(get_db)):
    repo = SkillRepository(db)
    user_skills = repo.get_user_skills(user.id)
    results = []
    for us in user_skills:
        results.append(UserSkillResponse(
            id=us.id,
            user_id=us.user_id,
            skill_id=us.skill_id,
            name=us.skill.name if us.skill else "Skill",
            category=us.skill.category if us.skill else "Frontend",
            claimed_level=us.claimed_level,
            verified_level=us.verified_level,
            status=us.status,
            confidence=us.confidence,
            evidence_count=len(us.evidence_items) if us.evidence_items else 0,
            created_at=us.created_at.isoformat(),
            updated_at=us.updated_at.isoformat()
        ))
    return results

@router.post("", response_model=UserSkillResponse)
def add_user_skill(
    request: SkillCreateRequest,
    user: User = Depends(get_current_user_optional),
    db: Session = Depends(get_db)
):
    repo = SkillRepository(db)
    skill = repo.get_or_create_skill(request.name, request.category or "Frontend")
    user_skill = repo.create_or_update_user_skill(
        user_id=user.id,
        skill_id=skill.id,
        claimed_level=request.claimed_level or "Intermediate",
        status="CLAIMED",
        confidence=50
    )
    return UserSkillResponse(
        id=user_skill.id,
        user_id=user_skill.user_id,
        skill_id=user_skill.skill_id,
        name=skill.name,
        category=skill.category,
        claimed_level=user_skill.claimed_level,
        verified_level=user_skill.verified_level,
        status=user_skill.status,
        confidence=user_skill.confidence,
        evidence_count=len(user_skill.evidence_items) if user_skill.evidence_items else 0,
        created_at=user_skill.created_at.isoformat(),
        updated_at=user_skill.updated_at.isoformat()
    )

@router.get("/catalog")
def get_skill_catalog(db: Session = Depends(get_db)):
    repo = SkillRepository(db)
    skills = repo.list_all_skills()
    return [{"id": s.id, "name": s.name, "category": s.category} for s in skills]
