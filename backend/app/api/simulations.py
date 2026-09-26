from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from backend.app.core.database import get_db
from backend.app.models.user import User
from backend.app.models.simulation import WhatIfSimulation
from backend.app.schemas.simulation import WhatIfSimulationRequest, WhatIfSimulationResponse
from backend.app.repositories.job_repository import JobRepository
from backend.app.repositories.skill_repository import SkillRepository
from backend.app.repositories.profile_repository import ProfileRepository
from backend.app.services.simulation_service import SimulationService
from backend.app.api.deps import get_current_user_optional

router = APIRouter(prefix="/what-if", tags=["What-If Career Simulator"])

@router.post("", response_model=WhatIfSimulationResponse)
def run_what_if_simulation(
    request: WhatIfSimulationRequest,
    user: User = Depends(get_current_user_optional),
    db: Session = Depends(get_db)
):
    job_repo = JobRepository(db)
    skill_repo = SkillRepository(db)
    profile_repo = ProfileRepository(db)

    jobs = job_repo.list_jobs()
    user_skills = skill_repo.get_user_skills(user.id)
    profile = profile_repo.get_by_user_id(user.id)

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

    serialized_jobs = []
    for j in jobs:
        reqs = [{
            "skill_name": js.skill.name if js.skill else "Skill",
            "importance": js.importance,
            "weight": js.weight,
            "minimum_level": js.minimum_level,
            "required": js.required
        } for js in j.required_skills]
        serialized_jobs.append({
            "id": j.id,
            "title": j.title,
            "company": j.company,
            "experience_years_required": j.experience_years_required,
            "work_mode": j.work_mode,
            "required_skills": reqs,
            "growth_index": j.growth_index
        })

    hypothetical_list = [h.model_dump() for h in request.hypothetical_skills]

    result = SimulationService.run_simulation(
        candidate_skills=candidate_skills,
        candidate_exp_years=3,
        candidate_edu=profile.education_summary if profile else "B.S. CS",
        candidate_pref=profile.career_preferences if profile else {},
        jobs=serialized_jobs,
        hypothetical_skills=hypothetical_list
    )

    if request.save_simulation:
        sim_record = WhatIfSimulation(
            user_id=user.id,
            title=request.title or "What-If Simulation",
            base_state={"skills_count": len(candidate_skills)},
            hypothetical_skills=hypothetical_list,
            projected_results=result
        )
        db.add(sim_record)
        db.commit()

    return WhatIfSimulationResponse(**result)
