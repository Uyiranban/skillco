from typing import List, Dict, Any
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from backend.app.core.database import get_db
from backend.app.models.user import User
from backend.app.schemas.career import CareerPathDTO, CareerPathStepDTO
from backend.app.repositories.job_repository import JobRepository
from backend.app.repositories.skill_repository import SkillRepository
from backend.app.repositories.profile_repository import ProfileRepository
from backend.app.services.matching_service import MatchingService
from backend.app.services.career_service import CareerService
from backend.app.api.deps import get_current_user_optional

router = APIRouter(prefix="/career", tags=["Career Twin & Paths"])

@router.get("/paths", response_model=List[CareerPathDTO])
def get_career_paths(
    user: User = Depends(get_current_user_optional),
    db: Session = Depends(get_db)
):
    job_repo = JobRepository(db)
    skill_repo = SkillRepository(db)
    user_skills = skill_repo.get_user_skills(user.id)
    user_skill_map = {us.skill.name.lower(): us for us in user_skills if us.skill}

    paths = job_repo.list_career_paths()
    results = []

    for p in paths:
        steps_dto = []
        completed_steps = 0
        for s in p.steps:
            s_name = s.skill.name if s.skill else "Skill"
            user_skill = user_skill_map.get(s_name.lower())
            status = user_skill.status if user_skill else "CLAIMED"
            confidence = user_skill.confidence if user_skill else 0
            if status == "VERIFIED":
                completed_steps += 1

            steps_dto.append(CareerPathStepDTO(
                id=s.id,
                skill_name=s_name,
                step_order=s.step_order,
                estimated_duration=s.estimated_duration,
                description=s.description,
                required_level=s.required_level,
                current_status=status,
                current_confidence=confidence
            ))

        prog = int(round((completed_steps / float(max(1, len(steps_dto)))) * 100)) if steps_dto else 0
        results.append(CareerPathDTO(
            id=p.id,
            name=p.name,
            target_role=p.target_role,
            description=p.description,
            steps=steps_dto,
            progress_percentage=prog
        ))
    return results

@router.get("/twin")
def get_career_twin(
    user: User = Depends(get_current_user_optional),
    db: Session = Depends(get_db)
):
    job_repo = JobRepository(db)
    skill_repo = SkillRepository(db)
    profile_repo = ProfileRepository(db)

    jobs = job_repo.list_jobs()
    user_skills = skill_repo.get_user_skills(user.id)
    profile = profile_repo.get_by_user_id(user.id)
    projects = profile_repo.get_projects(user.id)
    experiences = profile_repo.get_experiences(user.id)

    candidate_skills = []
    for us in user_skills:
        candidate_skills.append({
            "name": us.skill.name if us.skill else "Skill",
            "category": us.skill.category if us.skill else "Frontend",
            "level": us.claimed_level,
            "claimed_level": us.claimed_level,
            "verified_level": us.verified_level,
            "status": us.status,
            "verificationStatus": "verified" if us.status == "VERIFIED" else "claimed",
            "confidence": us.confidence
        })

    # Compute matches
    matches = []
    for j in jobs:
        reqs = [{
            "skill_name": js.skill.name if js.skill else "Skill",
            "importance": js.importance,
            "weight": js.weight,
            "minimum_level": js.minimum_level,
            "required": js.required
        } for js in j.required_skills]

        m = MatchingService.match_candidate_to_job(
            candidate_skills=candidate_skills,
            candidate_experience_years=3,
            candidate_education_degree=profile.education_summary if profile else "B.S. CS",
            candidate_preferences=profile.career_preferences if profile else {},
            job={"title": j.title, "experience_years_required": j.experience_years_required, "required_skills": reqs, "growth_index": j.growth_index, "work_mode": j.work_mode}
        )
        matches.append({"job": {"id": j.id, "title": j.title, "company": j.company}, **m})

    metrics = CareerService.calculate_career_twin_metrics(
        skills=candidate_skills,
        experiences=[{"id": e.id} for e in experiences],
        projects=[{"id": p.id} for p in projects],
        job_matches=matches
    )
    gaps = CareerService.calculate_skill_gaps(matches)

    return {
        "metrics": metrics,
        "gaps": gaps,
        "best_next_skill": gaps[0]["skill_name"] if gaps else "TypeScript",
        "top_matches": sorted(matches, key=lambda x: x["match_score"], reverse=True)[:3]
    }
