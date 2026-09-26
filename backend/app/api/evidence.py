import os
import uuid
import shutil
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form
from sqlalchemy.orm import Session
from backend.app.core.database import get_db
from backend.app.core.config import settings
from backend.app.models.user import User
from backend.app.models.skill import Skill, UserSkill
from backend.app.models.evidence import SkillEvidence, EvidenceFile, VerificationReview
from backend.app.schemas.evidence import EvidenceSubmitRequest, EvidenceResponse, VerificationReviewResponse
from backend.app.repositories.skill_repository import SkillRepository
from backend.app.repositories.evidence_repository import EvidenceRepository
from backend.app.services.gemini_service import gemini_service
from backend.app.api.deps import get_current_user_optional

router = APIRouter(prefix="/evidence", tags=["Evidence & Verification"])

@router.post("/submit", response_model=EvidenceResponse)
def submit_evidence(
    request: EvidenceSubmitRequest,
    user: User = Depends(get_current_user_optional),
    db: Session = Depends(get_db)
):
    skill_repo = SkillRepository(db)
    evidence_repo = EvidenceRepository(db)

    # 1. Get or create skill & user_skill
    skill = skill_repo.get_or_create_skill(request.skill_name)
    user_skill = skill_repo.create_or_update_user_skill(
        user_id=user.id,
        skill_id=skill.id,
        claimed_level=request.claimed_level or "Intermediate"
    )

    # 2. Run Gemini Evidence Analysis
    ai_result = gemini_service.analyze_skill_evidence(
        skill_name=request.skill_name,
        claimed_level=request.claimed_level or "Intermediate",
        target_role=request.target_role or "Frontend Engineer",
        evidence_type=request.evidence_type,
        title=request.title,
        description=request.description or "",
        url=request.url or "",
        personal_contribution=request.personal_contribution or "",
        code_snippet=request.code_snippet or ""
    )

    # 3. Store SkillEvidence record
    evidence = evidence_repo.create_evidence(
        user_skill_id=user_skill.id,
        evidence_type=request.evidence_type,
        title=request.title,
        description=request.description,
        url=request.url,
        status=ai_result.get("status", "PENDING_REVIEW"),
        relevance_score=ai_result.get("relevance_score", "Medium"),
        quality_score=ai_result.get("quality_score", "Moderate"),
        ai_confidence=ai_result.get("ai_confidence", 60),
        metadata_json={
            "personal_contribution": request.personal_contribution,
            "relevant_paths": request.relevant_paths,
            "issuer": request.issuer,
            "certificate_id": request.certificate_id
        }
    )

    # 4. Store VerificationReview record
    review = evidence_repo.create_review(
        evidence_id=evidence.id,
        status=ai_result.get("status", "SUPPORTED"),
        ai_confidence=ai_result.get("ai_confidence", 60),
        relevance_score=ai_result.get("relevance_score", "Medium"),
        quality_score=ai_result.get("quality_score", "Moderate"),
        detected_level=ai_result.get("detected_level", request.claimed_level),
        reasoning=ai_result.get("reasoning", "Evidence successfully reviewed."),
        strengths=ai_result.get("strengths", []),
        gaps=ai_result.get("gaps", [])
    )

    # 5. If verified or supported, upgrade UserSkill
    final_status = ai_result.get("status", "SUPPORTED")
    if final_status in ["VERIFIED", "SUPPORTED"]:
        user_skill.status = final_status
        user_skill.confidence = max(user_skill.confidence, ai_result.get("ai_confidence", 80))
        user_skill.verified_level = ai_result.get("detected_level") or request.claimed_level
        db.commit()

    return EvidenceResponse(
        id=evidence.id,
        user_skill_id=user_skill.id,
        skill_name=skill.name,
        evidence_type=evidence.evidence_type,
        title=evidence.title,
        description=evidence.description,
        url=evidence.url,
        status=evidence.status,
        relevance_score=evidence.relevance_score,
        quality_score=evidence.quality_score,
        ai_confidence=evidence.ai_confidence,
        review=VerificationReviewResponse(
            id=review.id,
            evidence_id=review.evidence_id,
            status=review.status,
            ai_confidence=review.ai_confidence,
            relevance_score=review.relevance_score,
            quality_score=review.quality_score,
            detected_level=review.detected_level,
            reasoning=review.reasoning,
            strengths=review.strengths or [],
            gaps=review.gaps or [],
            reviewed_at=review.reviewed_at.isoformat()
        ),
        created_at=evidence.created_at.isoformat()
    )

@router.post("/upload")
async def upload_evidence_file(
    file: UploadFile = File(...),
    user: User = Depends(get_current_user_optional),
    db: Session = Depends(get_db)
):
    upload_dir = settings.STORAGE_DIR
    os.makedirs(upload_dir, exist_ok=True)

    file_ext = os.path.splitext(file.filename)[1] if file.filename else ""
    safe_filename = f"{uuid.uuid4().hex}{file_ext}"
    target_path = os.path.join(upload_dir, safe_filename)

    with open(target_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    return {
        "file_name": file.filename,
        "storage_path": target_path,
        "mime_type": file.content_type,
        "size": os.path.getsize(target_path),
        "url": f"/api/storage/{safe_filename}"
    }
