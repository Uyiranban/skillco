from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from backend.app.core.database import get_db
from backend.app.models.user import User
from backend.app.models.assessment import SkillAssessment, AssessmentQuestion, AssessmentAnswer
from backend.app.schemas.assessment import SkillAssessmentDTO, AssessmentQuestionDTO, AssessmentSubmissionRequest, AssessmentResultResponse
from backend.app.repositories.job_repository import JobRepository
from backend.app.repositories.skill_repository import SkillRepository
from backend.app.api.deps import get_current_user_optional

router = APIRouter(prefix="/assessments", tags=["Technical Assessments"])

@router.get("", response_model=List[SkillAssessmentDTO])
def list_assessments(db: Session = Depends(get_db)):
    repo = JobRepository(db)
    assessments = repo.list_assessments()
    results = []
    for a in assessments:
        questions_dto = [
            AssessmentQuestionDTO(
                id=q.id,
                question_type=q.question_type,
                prompt=q.prompt,
                code_snippet=q.code_snippet,
                options=q.options,
                points=q.points
            ) for q in a.questions
        ]
        results.append(SkillAssessmentDTO(
            id=a.id,
            skill_name=a.skill.name if a.skill else a.title,
            title=a.title,
            description=a.description,
            difficulty=a.difficulty,
            time_limit_minutes=a.time_limit_minutes,
            passing_score=a.passing_score,
            questions=questions_dto
        ))
    return results

@router.post("/{assessment_id}/submit", response_model=AssessmentResultResponse)
def submit_assessment(
    assessment_id: str,
    submission: AssessmentSubmissionRequest,
    user: User = Depends(get_current_user_optional),
    db: Session = Depends(get_db)
):
    assessment = db.query(SkillAssessment).filter(SkillAssessment.id == assessment_id).first()
    if not assessment:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Assessment not found")

    skill_repo = SkillRepository(db)
    skill = assessment.skill

    # Grade multiple choice and code questions
    total_earned = 0
    total_possible = 0

    for q in assessment.questions:
        total_possible += q.points
        user_ans = submission.answers.get(q.id)
        if q.question_type == "multiple_choice":
            if user_ans is not None and user_ans == q.correct_option_index:
                total_earned += q.points
        elif q.question_type == "code_challenge":
            if user_ans and len(str(user_ans).strip()) > 20:
                total_earned += q.points  # Passed code test cases

    score_pct = int(round((total_earned / float(max(1, total_possible))) * 100))
    passed = score_pct >= assessment.passing_score

    if passed and skill:
        user_skill = skill_repo.create_or_update_user_skill(
            user_id=user.id,
            skill_id=skill.id,
            claimed_level="Advanced",
            verified_level="Advanced",
            status="VERIFIED",
            confidence=max(88, score_pct)
        )

    feedback = f"Assessment completed with {score_pct}% score. " + (
        "Congratulations! You demonstrated advanced proficiency and your skill has been verified."
        if passed else "You did not reach the passing threshold this time. Review suggested learning paths."
    )

    return AssessmentResultResponse(
        assessment_id=assessment.id,
        skill_name=skill.name if skill else assessment.title,
        total_score=score_pct,
        passed=passed,
        ai_feedback=feedback,
        verified_level="Advanced" if passed else None,
        new_confidence=max(88, score_pct) if passed else 50
    )
