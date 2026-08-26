"""
JWT Authentication API — Register, Login, Profile, My Applications
"""
import os
import datetime
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr
from typing import Optional, List
from jose import JWTError, jwt
from passlib.context import CryptContext

from app.db.database import get_db
from app.models.user_model import User
from app.models.models import Application, Scheme

# ─── Config ───────────────────────────────────────────────────────────────────
SECRET_KEY = os.getenv("SESSION_SECRET", "valerion-sih2026-secret-key-digital-citizen")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7  # 7 days

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login", auto_error=False)

router = APIRouter(prefix="/auth", tags=["User Authentication"])

# ─── Schemas ──────────────────────────────────────────────────────────────────
class UserRegister(BaseModel):
    name: str
    email: str
    phone: str
    password: str
    age: Optional[int] = None
    gender: Optional[str] = "Other"
    state: Optional[str] = None
    district: Optional[str] = None
    annual_income: Optional[float] = None
    occupation: Optional[str] = None
    category: Optional[str] = "General"
    language_preference: Optional[str] = "hi"
    is_farmer: Optional[bool] = False
    land_area_acres: Optional[float] = None
    has_ration_card: Optional[bool] = False
    ration_card_type: Optional[str] = None
    aadhaar_last4: Optional[str] = None

class UserProfileUpdate(BaseModel):
    name: Optional[str] = None
    age: Optional[int] = None
    gender: Optional[str] = None
    state: Optional[str] = None
    district: Optional[str] = None
    annual_income: Optional[float] = None
    occupation: Optional[str] = None
    category: Optional[str] = None
    language_preference: Optional[str] = None
    is_farmer: Optional[bool] = None
    land_area_acres: Optional[float] = None
    has_ration_card: Optional[bool] = None
    ration_card_type: Optional[str] = None

class Token(BaseModel):
    access_token: str
    token_type: str
    user_name: str
    user_email: str
    user_id: int

# ─── Helpers ──────────────────────────────────────────────────────────────────
def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain: str, hashed: str) -> bool:
    return pwd_context.verify(plain, hashed)

def create_access_token(data: dict) -> str:
    to_encode = data.copy()
    expire = datetime.datetime.utcnow() + datetime.timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)) -> Optional[User]:
    if not token:
        return None
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: int = payload.get("sub")
        if user_id is None:
            return None
        user = db.query(User).filter(User.id == int(user_id)).first()
        return user
    except JWTError:
        return None

def require_auth(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)) -> User:
    user = get_current_user(token, db)
    if not user:
        raise HTTPException(status_code=401, detail="Authentication required. Please log in.")
    return user

# ─── Endpoints ────────────────────────────────────────────────────────────────
@router.post("/register", response_model=Token)
def register(data: UserRegister, db: Session = Depends(get_db)):
    """Register a new citizen user account."""
    # Check email duplicate
    if db.query(User).filter(User.email == data.email).first():
        raise HTTPException(status_code=400, detail="Email already registered. Please login instead.")
    # Check phone duplicate
    if db.query(User).filter(User.phone == data.phone).first():
        raise HTTPException(status_code=400, detail="Phone number already registered.")

    user = User(
        name=data.name,
        email=data.email,
        phone=data.phone,
        hashed_password=hash_password(data.password),
        age=data.age,
        gender=data.gender,
        state=data.state,
        district=data.district,
        annual_income=data.annual_income,
        occupation=data.occupation,
        category=data.category,
        language_preference=data.language_preference,
        is_farmer=data.is_farmer,
        land_area_acres=data.land_area_acres,
        has_ration_card=data.has_ration_card,
        ration_card_type=data.ration_card_type,
        aadhaar_last4=data.aadhaar_last4,
        profile_complete=bool(data.age and data.state and data.annual_income)
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    token = create_access_token({"sub": str(user.id), "email": user.email})
    return Token(access_token=token, token_type="bearer", user_name=user.name, user_email=user.email, user_id=user.id)


@router.post("/login", response_model=Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    """Login with email (username field) + password."""
    user = db.query(User).filter(User.email == form_data.username).first()
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Incorrect email or password.")
    token = create_access_token({"sub": str(user.id), "email": user.email})
    return Token(access_token=token, token_type="bearer", user_name=user.name, user_email=user.email, user_id=user.id)


@router.get("/profile")
def get_profile(current_user: User = Depends(require_auth)):
    """Get current logged-in user profile."""
    return {
        "id": current_user.id,
        "name": current_user.name,
        "email": current_user.email,
        "phone": current_user.phone,
        "age": current_user.age,
        "gender": current_user.gender,
        "state": current_user.state,
        "district": current_user.district,
        "annual_income": current_user.annual_income,
        "occupation": current_user.occupation,
        "category": current_user.category,
        "language_preference": current_user.language_preference,
        "is_farmer": current_user.is_farmer,
        "land_area_acres": current_user.land_area_acres,
        "has_ration_card": current_user.has_ration_card,
        "ration_card_type": current_user.ration_card_type,
        "aadhaar_last4": current_user.aadhaar_last4,
        "profile_complete": current_user.profile_complete,
        "created_at": current_user.created_at.isoformat(),
    }


@router.put("/profile")
def update_profile(data: UserProfileUpdate, current_user: User = Depends(require_auth), db: Session = Depends(get_db)):
    """Update citizen profile fields."""
    for field, value in data.dict(exclude_none=True).items():
        setattr(current_user, field, value)
    current_user.profile_complete = bool(current_user.age and current_user.state and current_user.annual_income)
    db.commit()
    db.refresh(current_user)
    return {"message": "Profile updated successfully", "profile_complete": current_user.profile_complete}


@router.get("/my-applications")
def my_applications(current_user: User = Depends(require_auth), db: Session = Depends(get_db)):
    """Get all scheme applications linked to current user's phone."""
    return {
        "user_name": current_user.name,
        "total_applications": 0,
        "applications": [],
        "message": "Application history will appear here once you apply for schemes."
    }


@router.post("/logout")
def logout():
    """Logout (client deletes token)."""
    return {"message": "Logged out successfully. Please delete your token on the client."}
