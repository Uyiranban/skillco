from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from backend.app.core.database import get_db
from backend.app.models.user import User
from backend.app.models.job import Job, JobSkill
from backend.app.schemas.job import JobResponse, JobMatchResultDTO, JobSkillRequirementDTO
from backend.app.repositories.job_repository import JobRepository
from backend.app.repositories.skill_repository import SkillRepository
from backend.app.repositories.profile_repository import ProfileRepository
from backend.app.services.matching_service import MatchingService
from backend.app.api.deps import get_current_user_optional

router = APIRouter(prefix="/jobs", tags=["Jobs & Opportunities"])

def _serialize_job(job: Job) -> dict:
    reqs = []
    for js in job.required_skills:
        reqs.append({
            "skill_name": js.skill.name if js.skill else "Skill",
            "category": js.skill.category if js.skill else "Frontend",
            "importance": js.importance,
            "weight": js.weight,
            "minimum_level": js.minimum_level,
            "required": js.required
        })
    return {
        "id": job.id,
        "title": job.title,
        "company": job.company,
        "location": job.location,
        "employment_type": job.employment_type,
        "work_mode": job.work_mode,
        "department": job.department,
        "experience_level": job.experience_level,
        "experience_years_required": job.experience_years_required,
        "education_required": job.education_required,
        "salary_min": job.salary_min,
        "salary_max": job.salary_max,
        "description": job.description,
        "responsibilities": job.responsibilities or [],
        "benefits": job.benefits or [],
        "growth_index": job.growth_index,
        "posted_date": job.posted_date,
        "required_skills": reqs
    }

@router.get("", response_model=List[JobResponse])
def get_jobs(db: Session = Depends(get_db)):
    repo = JobRepository(db)
    jobs = repo.list_jobs()
    return [_serialize_job(j) for j in jobs]

@router.get("/matches", response_model=List[JobMatchResultDTO])
def get_job_matches(
    user: User = Depends(get_current_user_optional),
    db: Session = Depends(get_db)
):
    job_repo = JobRepository(db)
    skill_repo = SkillRepository(db)
    profile_repo = ProfileRepository(db)

    jobs = job_repo.list_jobs()
    user_skills = skill_repo.get_user_skills(user.id)
    profile = profile_repo.get_by_user_id(user.id)

    # Format skills for matching service
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

    exp_years = 3
    edu_str = profile.education_summary if profile and profile.education_summary else "B.S. Computer Science"
    pref = profile.career_preferences if profile and profile.career_preferences else {}

    results = []
    for j in jobs:
        serialized_j = _serialize_job(j)
        match_data = MatchingService.match_candidate_to_job(
            candidate_skills=candidate_skills,
            candidate_experience_years=exp_years,
            candidate_education_degree=edu_str,
            candidate_preferences=pref,
            job=serialized_j
        )
        results.append(JobMatchResultDTO(
            job=JobResponse(**serialized_j),
            match_score=match_data["match_score"],
            matched_skills=match_data["matched_skills"],
            partial_skills=match_data["partial_skills"],
            missing_skills=match_data["missing_skills"],
            score_breakdown=match_data["score_breakdown"],
            verified_boost=match_data["verified_boost"],
            readiness_level=match_data["readiness_level"],
            growth_index=match_data["growth_index"]
        ))

    # Sort descending by match score
    results.sort(key=lambda x: x.match_score, reverse=True)
    return results

@router.get("/{job_id}", response_model=JobResponse)
def get_job_by_id(job_id: str, db: Session = Depends(get_db)):
    repo = JobRepository(db)
    job = repo.get_job_by_id(job_id)
    if not job:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Job not found")
    return _serialize_job(job)
