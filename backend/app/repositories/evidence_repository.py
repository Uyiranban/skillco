from typing import Optional, List
from sqlalchemy.orm import Session
from backend.app.models.evidence import SkillEvidence, EvidenceFile, VerificationReview

class EvidenceRepository:
    def __init__(self, db: Session):
        self.db = db

    def create_evidence(
        self,
        user_skill_id: str,
        evidence_type: str,
        title: str,
        description: Optional[str] = None,
        url: Optional[str] = None,
        status: str = "PENDING_REVIEW",
        relevance_score: str = "Medium",
        quality_score: str = "Moderate",
        ai_confidence: int = 50,
        metadata_json: Optional[dict] = None
    ) -> SkillEvidence:
        evidence = SkillEvidence(
            user_skill_id=user_skill_id,
            evidence_type=evidence_type,
            title=title,
            description=description,
            url=url,
            status=status,
            relevance_score=relevance_score,
            quality_score=quality_score,
            ai_confidence=ai_confidence,
            metadata_json=metadata_json or {}
        )
        self.db.add(evidence)
        self.db.commit()
        self.db.refresh(evidence)
        return evidence

    def create_review(
        self,
        evidence_id: str,
        status: str,
        ai_confidence: int,
        relevance_score: str,
        quality_score: str,
        detected_level: Optional[str],
        reasoning: str,
        strengths: list,
        gaps: list
    ) -> VerificationReview:
        review = VerificationReview(
            evidence_id=evidence_id,
            status=status,
            ai_confidence=ai_confidence,
            relevance_score=relevance_score,
            quality_score=quality_score,
            detected_level=detected_level,
            reasoning=reasoning,
            strengths=strengths,
            gaps=gaps
        )
        self.db.add(review)
        self.db.commit()
        self.db.refresh(review)
        return review

    def get_evidence_by_id(self, evidence_id: str) -> Optional[SkillEvidence]:
        return self.db.query(SkillEvidence).filter(SkillEvidence.id == evidence_id).first()

    def get_by_user_skill_id(self, user_skill_id: str) -> List[SkillEvidence]:
        return self.db.query(SkillEvidence).filter(SkillEvidence.user_skill_id == user_skill_id).all()
