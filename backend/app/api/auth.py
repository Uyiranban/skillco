from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from backend.app.core.database import get_db
from backend.app.core.security import verify_password, get_password_hash, create_access_token
from backend.app.models.user import User
from backend.app.models.profile import Profile
from backend.app.schemas.auth import UserRegisterRequest, UserLoginRequest, TokenResponse, UserResponse
from backend.app.api.deps import get_current_user_required

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/register", response_model=TokenResponse)
def register(request: UserRegisterRequest, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == request.email).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User with this email already exists"
        )
    
    hashed = get_password_hash(request.password)
    user = User(email=request.email, password_hash=hashed)
    db.add(user)
    db.commit()
    db.refresh(user)

    # Initialize associated Profile
    profile = Profile(
        user_id=user.id,
        full_name=request.full_name,
        headline=request.headline or "Software Engineer",
        location=request.location or "San Francisco, CA",
        target_roles=["Frontend Engineer", "Full Stack Developer"],
        career_preferences={
            "workMode": "Hybrid",
            "targetSalaryMin": 140000,
            "targetSalaryMax": 175000,
            "locations": ["San Francisco, CA", "Remote"]
        }
    )
    db.add(profile)
    db.commit()

    token = create_access_token(user.id)
    return TokenResponse(
        access_token=token,
        user_id=user.id,
        email=user.email
    )

@router.post("/login", response_model=TokenResponse)
def login(request: UserLoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == request.email).first()
    if not user or not verify_password(request.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )
    
    token = create_access_token(user.id)
    return TokenResponse(
        access_token=token,
        user_id=user.id,
        email=user.email
    )

@router.get("/me", response_model=UserResponse)
def get_me(user: User = Depends(get_current_user_required)):
    full_name = user.profile.full_name if user.profile else user.email.split("@")[0]
    avatar_url = user.profile.avatar_url if user.profile else None
    return UserResponse(
        id=user.id,
        email=user.email,
        full_name=full_name,
        avatar_url=avatar_url,
        created_at=user.created_at.isoformat()
    )
