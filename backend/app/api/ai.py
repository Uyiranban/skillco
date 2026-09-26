from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from backend.app.core.database import get_db
from backend.app.models.user import User
from backend.app.models.conversation import AIConversation, AIMessage
from backend.app.schemas.chat import ChatMessageRequest, ChatMessageResponse, AIAnalysisRequest
from backend.app.repositories.skill_repository import SkillRepository
from backend.app.repositories.profile_repository import ProfileRepository
from backend.app.services.gemini_service import gemini_service
from backend.app.api.deps import get_current_user_optional

router = APIRouter(prefix="/ai", tags=["AI Career Strategist"])

@router.post("/chat", response_model=ChatMessageResponse)
def chat_with_strategist(
    request: ChatMessageRequest,
    user: User = Depends(get_current_user_optional),
    db: Session = Depends(get_db)
):
    profile_repo = ProfileRepository(db)
    skill_repo = SkillRepository(db)

    profile = profile_repo.get_by_user_id(user.id)
    user_skills = skill_repo.get_user_skills(user.id)

    # Prepare candidate summary context
    candidate_summary = {
        "name": profile.full_name if profile else "Alex Morgan",
        "headline": profile.headline if profile else "Frontend Engineer",
        "targetRole": request.target_role or "Frontend Engineer",
        "overallReadiness": 78,
        "skills": [
            {
                "name": us.skill.name if us.skill else "Skill",
                "status": us.status,
                "confidence": us.confidence,
                "level": us.claimed_level
            }
            for us in user_skills
        ]
    }

    # Retrieve or create AI Conversation
    conv = None
    if request.conversation_id:
        conv = db.query(AIConversation).filter(AIConversation.id == request.conversation_id).first()

    if not conv:
        conv = AIConversation(
            user_id=user.id,
            title=f"Strategy Session ({request.target_role})"
        )
        db.add(conv)
        db.commit()
        db.refresh(conv)

    # Save user message
    user_msg = AIMessage(
        conversation_id=conv.id,
        role="user",
        content=request.message
    )
    db.add(user_msg)

    # Generate Advice via Gemini Service
    ai_output = gemini_service.generate_career_advice(
        user_message=request.message,
        candidate_summary=candidate_summary,
        top_matches=[
            {"title": "Senior Frontend Engineer", "company": "Vercel", "match_score": 91},
            {"title": "Full Stack Developer", "company": "Stripe", "match_score": 84}
        ],
        skill_gaps=[
            {"skill_name": "TypeScript", "gap": "Need Advanced (Currently claimed)", "impact": "High"}
        ]
    )

    # Save assistant message
    assistant_msg = AIMessage(
        conversation_id=conv.id,
        role="assistant",
        content=ai_output.get("reply", "Here is your career strategy recommendation."),
        metadata_json={
            "suggested_actions": ai_output.get("suggested_actions", []),
            "action_badges": ai_output.get("action_badges", [])
        }
    )
    db.add(assistant_msg)
    db.commit()

    return ChatMessageResponse(
        conversation_id=conv.id,
        reply=ai_output.get("reply", "Here is your career strategy recommendation."),
        suggested_actions=ai_output.get("suggested_actions", []),
        action_badges=ai_output.get("action_badges", []),
        timestamp=datetime.now(timezone.utc).isoformat()
    )

@router.post("/analyze-evidence")
def analyze_evidence_preview(
    request: AIAnalysisRequest,
    user: User = Depends(get_current_user_optional)
):
    result = gemini_service.analyze_skill_evidence(
        skill_name=request.skill_name,
        claimed_level=request.claimed_level,
        target_role=request.target_role,
        evidence_type=request.evidence_type,
        title=request.title,
        description=request.description or "",
        url=request.url or "",
        personal_contribution=request.personal_contribution or "",
        code_snippet=request.code_snippet or ""
    )
    return result
