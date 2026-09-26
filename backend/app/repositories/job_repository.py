from typing import Optional, List
from sqlalchemy.orm import Session, joinedload
from backend.app.models.job import Job, JobSkill
from backend.app.models.career import CareerPath, CareerPathStep
from backend.app.models.assessment import SkillAssessment

class JobRepository:
    def __init__(self, db: Session):
        self.db = db

    def list_jobs(self) -> List[Job]:
        return self.db.query(Job).options(
            joinedload(Job.required_skills).joinedload(JobSkill.skill)
        ).all()

    def get_job_by_id(self, job_id: str) -> Optional[Job]:
        return self.db.query(Job).options(
            joinedload(Job.required_skills).joinedload(JobSkill.skill)
        ).filter(Job.id == job_id).first()

    def list_career_paths(self) -> List[CareerPath]:
        return self.db.query(CareerPath).options(
            joinedload(CareerPath.steps).joinedload(CareerPathStep.skill)
        ).all()

    def list_assessments(self) -> List[SkillAssessment]:
        return self.db.query(SkillAssessment).options(
            joinedload(SkillAssessment.questions),
            joinedload(SkillAssessment.skill)
        ).all()

    def get_assessment_by_skill_name(self, skill_name: str) -> Optional[SkillAssessment]:
        return self.db.query(SkillAssessment).options(
            joinedload(SkillAssessment.questions),
            joinedload(SkillAssessment.skill)
        ).filter(SkillAssessment.title.ilike(f"%{skill_name}%")).first()
