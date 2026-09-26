from typing import Optional, List
from sqlalchemy.orm import Session
from backend.app.models.user import User
from backend.app.models.profile import Profile
from backend.app.models.project import Project
from backend.app.models.experience import Experience
from backend.app.models.education import Education, Certification

class ProfileRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_by_user_id(self, user_id: str) -> Optional[Profile]:
        return self.db.query(Profile).filter(Profile.user_id == user_id).first()

    def get_user_by_email(self, email: str) -> Optional[User]:
        return self.db.query(User).filter(User.email == email).first()

    def get_user_by_id(self, user_id: str) -> Optional[User]:
        return self.db.query(User).filter(User.id == user_id).first()

    def create_user(self, email: str, password_hash: str) -> User:
        user = User(email=email, password_hash=password_hash)
        self.db.add(user)
        self.db.commit()
        self.db.refresh(user)
        return user

    def create_profile(self, user_id: str, full_name: str, headline: str = "Software Engineer", location: str = "San Francisco, CA") -> Profile:
        profile = Profile(
            user_id=user_id,
            full_name=full_name,
            headline=headline,
            location=location,
            target_roles=["Frontend Engineer", "Full Stack Developer"],
            career_preferences={
                "workMode": "Hybrid",
                "targetSalaryMin": 140000,
                "targetSalaryMax": 175000,
                "locations": ["San Francisco, CA", "Remote"]
            }
        )
        self.db.add(profile)
        self.db.commit()
        self.db.refresh(profile)
        return profile

    def update_profile(self, profile: Profile, data: dict) -> Profile:
        for key, value in data.items():
            if value is not None and hasattr(profile, key):
                setattr(profile, key, value)
        self.db.commit()
        self.db.refresh(profile)
        return profile

    def get_projects(self, user_id: str) -> List[Project]:
        return self.db.query(Project).filter(Project.user_id == user_id).all()

    def get_experiences(self, user_id: str) -> List[Experience]:
        return self.db.query(Experience).filter(Experience.user_id == user_id).all()

    def get_educations(self, user_id: str) -> List[Education]:
        return self.db.query(Education).filter(Education.user_id == user_id).all()

    def get_certifications(self, user_id: str) -> List[Certification]:
        return self.db.query(Certification).filter(Certification.user_id == user_id).all()
