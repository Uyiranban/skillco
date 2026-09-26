from typing import Optional, List
from sqlalchemy.orm import Session
from backend.app.models.skill import Skill, UserSkill

class SkillRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_skill_by_name(self, name: str) -> Optional[Skill]:
        return self.db.query(Skill).filter(Skill.name.ilike(name.strip())).first()

    def get_or_create_skill(self, name: str, category: str = "Frontend") -> Skill:
        skill = self.get_skill_by_name(name)
        if not skill:
            skill = Skill(name=name.strip(), category=category)
            self.db.add(skill)
            self.db.commit()
            self.db.refresh(skill)
        return skill

    def get_user_skills(self, user_id: str) -> List[UserSkill]:
        return self.db.query(UserSkill).filter(UserSkill.user_id == user_id).all()

    def get_user_skill_by_name(self, user_id: str, skill_name: str) -> Optional[UserSkill]:
        return self.db.query(UserSkill).join(Skill).filter(
            UserSkill.user_id == user_id,
            Skill.name.ilike(skill_name.strip())
        ).first()

    def create_or_update_user_skill(
        self,
        user_id: str,
        skill_id: str,
        claimed_level: str = "Intermediate",
        verified_level: Optional[str] = None,
        status: str = "CLAIMED",
        confidence: int = 50
    ) -> UserSkill:
        user_skill = self.db.query(UserSkill).filter(
            UserSkill.user_id == user_id,
            UserSkill.skill_id == skill_id
        ).first()

        if user_skill:
            user_skill.claimed_level = claimed_level
            if verified_level:
                user_skill.verified_level = verified_level
            user_skill.status = status
            user_skill.confidence = confidence
        else:
            user_skill = UserSkill(
                user_id=user_id,
                skill_id=skill_id,
                claimed_level=claimed_level,
                verified_level=verified_level,
                status=status,
                confidence=confidence
            )
            self.db.add(user_skill)

        self.db.commit()
        self.db.refresh(user_skill)
        return user_skill

    def list_all_skills(self) -> List[Skill]:
        return self.db.query(Skill).order_by(Skill.name).all()
