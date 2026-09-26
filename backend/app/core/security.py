import hashlib
import os
import hmac
from datetime import datetime, timedelta, timezone
from typing import Optional, Any
from jose import jwt, JWTError
from backend.app.core.config import settings

def get_password_hash(password: str) -> str:
    salt = os.urandom(16).hex()
    hash_obj = hashlib.pbkdf2_hmac(
        'sha256',
        password.encode('utf-8'),
        salt.encode('utf-8'),
        100000
    )
    return f"pbkdf2:sha256:100000${salt}${hash_obj.hex()}"

def verify_password(plain_password: str, hashed_password: str) -> bool:
    try:
        if hashed_password.startswith("pbkdf2:sha256:"):
            parts = hashed_password.split("$")
            if len(parts) == 3:
                salt = parts[1]
                expected_hash = parts[2]
                computed_hash = hashlib.pbkdf2_hmac(
                    'sha256',
                    plain_password.encode('utf-8'),
                    salt.encode('utf-8'),
                    100000
                ).hex()
                return hmac.compare_digest(expected_hash, computed_hash)
        # Fallback equality for dev testing
        return plain_password == hashed_password
    except Exception:
        return False

def create_access_token(subject: Any, expires_delta: Optional[timedelta] = None) -> str:
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    
    to_encode = {
        "exp": expire,
        "sub": str(subject),
        "iat": datetime.now(timezone.utc)
    }
    encoded_jwt = jwt.encode(to_encode, settings.JWT_SECRET_KEY, algorithm=settings.JWT_ALGORITHM)
    return encoded_jwt

def decode_access_token(token: str) -> Optional[dict]:
    try:
        payload = jwt.decode(token, settings.JWT_SECRET_KEY, algorithms=[settings.JWT_ALGORITHM])
        return payload
    except JWTError:
        return None
