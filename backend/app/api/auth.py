"""
JWT Authentication & Citizen User Portal API
Provides secure registration, login, profile management, and citizen document vault.
Uses direct bcrypt hashing for maximum compatibility and security.
"""
import os
import datetime
import bcrypt
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr
from typing import Optional, List, Dict, Any
from jose import JWTError, jwt

from app.db.database import get_db
from app.models.user_model import User, UserDocument
from app.models.models import Application, Scheme

# ─── Security Configuration ──────────────────────────────────────────────────
SECRET_KEY = os.getenv("SESSION_SECRET", "valerion-sih2026-secret-key-digital-citizen-bharat-pragati")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7  # 7 days

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login", auto_error=False)

router = APIRouter(prefix="/auth", tags=["User Authentication & Citizen Portal"])

# ─── Password Hashing Helpers ────────────────────────────────────────────────
def hash_password(password: str) -> str:
    """Hash password securely using direct bcrypt with 72-byte truncation."""
    pw_bytes = password.encode('utf-8')[:72]
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(pw_bytes, salt).decode('utf-8')

def verify_password(plain: str, hashed: str) -> bool:
    """Verify password against hashed value."""
    try:
        pw_bytes = plain.encode('utf-8')[:72]
        return bcrypt.checkpw(pw_bytes, hashed.encode('utf-8'))
    except Exception:
        return False

def create_access_token(data: dict) -> str:
    """Generate signed JWT token."""
    to_encode = data.copy()
    expire = datetime.datetime.utcnow() + datetime.timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

# ─── Dependency Helpers ───────────────────────────────────────────────────────
def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)) -> Optional[User]:
    """Retrieve logged in user or None if unauthenticated."""
    if not token:
        return None
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            return None
        user = db.query(User).filter(User.id == int(user_id)).first()
        return user
    except (JWTError, ValueError):
        return None

def require_auth(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)) -> User:
    """Require valid authenticated user."""
    user = get_current_user(token, db)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Session expired or invalid. Please login again.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return user

# ─── Pydantic Request/Response Schemas ─────────────────────────────────────────
class UserRegisterRequest(BaseModel):
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

class UserLoginRequest(BaseModel):
    email: str
    password: str

class UserProfileUpdateRequest(BaseModel):
    name: Optional[str] = None
    phone: Optional[str] = None
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
    aadhaar_last4: Optional[str] = None

class TokenResponse(BaseModel):
    access_token: str
    token_type: str
    user_id: int
    user_name: str
    user_email: str
    user_phone: str

# ─── Auth Endpoints ───────────────────────────────────────────────────────────
@router.post("/register", response_model=TokenResponse)
def register(data: UserRegisterRequest, db: Session = Depends(get_db)):
    """Register a new citizen user account."""
    clean_email = data.email.strip().lower()
    clean_phone = data.phone.strip()

    if not clean_email or "@" not in clean_email:
        raise HTTPException(status_code=400, detail="Please enter a valid email address.")
    if not clean_phone or len(clean_phone) < 10:
        raise HTTPException(status_code=400, detail="Please enter a valid 10-digit mobile number.")
    if not data.password or len(data.password) < 6:
        raise HTTPException(status_code=400, detail="Password must be at least 6 characters.")

    # Check for existing email
    existing_user_email = db.query(User).filter(User.email == clean_email).first()
    if existing_user_email:
        raise HTTPException(
            status_code=400,
            detail="An account with this email already exists. Please login instead."
        )

    # Check for existing phone
    existing_user_phone = db.query(User).filter(User.phone == clean_phone).first()
    if existing_user_phone:
        raise HTTPException(
            status_code=400,
            detail="An account with this phone number already exists. Please login instead."
        )

    hashed_pw = hash_password(data.password)

    user = User(
        name=data.name.strip(),
        email=clean_email,
        phone=clean_phone,
        hashed_password=hashed_pw,
        age=data.age,
        gender=data.gender or "Other",
        state=data.state,
        district=data.district,
        annual_income=data.annual_income,
        occupation=data.occupation,
        category=data.category or "General",
        language_preference=data.language_preference or "hi",
        is_farmer=bool(data.is_farmer),
        land_area_acres=data.land_area_acres,
        has_ration_card=bool(data.has_ration_card),
        ration_card_type=data.ration_card_type,
        aadhaar_last4=data.aadhaar_last4,
        profile_complete=bool(data.age and data.state and (data.annual_income is not None))
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    token = create_access_token({"sub": str(user.id), "email": user.email})
    return TokenResponse(
        access_token=token,
        token_type="bearer",
        user_id=user.id,
        user_name=user.name,
        user_email=user.email,
        user_phone=user.phone
    )


@router.post("/login", response_model=TokenResponse)
def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    """OAuth2 standard login endpoint (Form Data: username=email, password=password)."""
    clean_email = form_data.username.strip().lower()
    user = db.query(User).filter(User.email == clean_email).first()

    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password. Please check your credentials."
        )

    token = create_access_token({"sub": str(user.id), "email": user.email})
    return TokenResponse(
        access_token=token,
        token_type="bearer",
        user_id=user.id,
        user_name=user.name,
        user_email=user.email,
        user_phone=user.phone
    )


@router.post("/login-json", response_model=TokenResponse)
def login_json(data: UserLoginRequest, db: Session = Depends(get_db)):
    """JSON-based login endpoint for mobile / frontend convenience."""
    clean_email = data.email.strip().lower()
    user = db.query(User).filter(User.email == clean_email).first()

    if not user or not verify_password(data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password. Please check your credentials."
        )

    token = create_access_token({"sub": str(user.id), "email": user.email})
    return TokenResponse(
        access_token=token,
        token_type="bearer",
        user_id=user.id,
        user_name=user.name,
        user_email=user.email,
        user_phone=user.phone
    )


@router.get("/profile")
def get_profile(current_user: User = Depends(require_auth), db: Session = Depends(get_db)):
    """Get authenticated citizen profile + summary stats."""
    doc_count = db.query(UserDocument).filter(UserDocument.user_id == current_user.id).count()

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
        "documents_count": doc_count,
        "created_at": current_user.created_at.isoformat() if current_user.created_at else None,
    }


@router.put("/profile")
def update_profile(
    data: UserProfileUpdateRequest,
    current_user: User = Depends(require_auth),
    db: Session = Depends(get_db)
):
    """Update citizen profile information."""
    for field, value in data.dict(exclude_none=True).items():
        setattr(current_user, field, value)

    current_user.profile_complete = bool(
        current_user.age and current_user.state and (current_user.annual_income is not None)
    )
    current_user.updated_at = datetime.datetime.utcnow()

    db.commit()
    db.refresh(current_user)
    return {
        "message": "Profile updated successfully.",
        "profile_complete": current_user.profile_complete
    }


# ─── Citizen Documents Vault (Stored OCR Extracted Records) ──────────────────
@router.get("/documents")
def get_user_documents(current_user: User = Depends(require_auth), db: Session = Depends(get_db)):
    """Retrieve all OCR documents extracted and saved for the logged-in citizen."""
    docs = db.query(UserDocument).filter(
        UserDocument.user_id == current_user.id
    ).order_by(UserDocument.created_at.desc()).all()

    return {
        "user_id": current_user.id,
        "user_name": current_user.name,
        "total_documents": len(docs),
        "documents": [
            {
                "id": d.id,
                "tracking_code": d.tracking_code,
                "document_type": d.document_type,
                "filename": d.filename,
                "file_format": d.file_format,
                "extracted_fields": d.extracted_fields,
                "confidence_score": d.confidence_score,
                "status": d.status,
                "raw_text_preview": (d.raw_text[:200] + "...") if d.raw_text and len(d.raw_text) > 200 else d.raw_text,
                "created_at": d.created_at.isoformat() if d.created_at else None,
            }
            for d in docs
        ]
    }


@router.delete("/documents/{doc_id}")
def delete_user_document(
    doc_id: int,
    current_user: User = Depends(require_auth),
    db: Session = Depends(get_db)
):
    """Delete a stored document from the user's vault."""
    doc = db.query(UserDocument).filter(
        UserDocument.id == doc_id,
        UserDocument.user_id == current_user.id
    ).first()

    if not doc:
        raise HTTPException(status_code=404, detail="Document not found.")

    db.delete(doc)
    db.commit()
    return {"message": "Document deleted successfully."}
