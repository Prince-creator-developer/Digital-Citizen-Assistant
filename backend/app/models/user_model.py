"""
User Authentication & Citizen Document Storage Models
Stores citizen user accounts with hashed passwords, profile information,
and all OCR extracted documents linked to each user.
"""
import datetime
from sqlalchemy import Column, Integer, String, Float, DateTime, Boolean, Text, JSON, ForeignKey
from sqlalchemy.orm import relationship
from app.db.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(150), unique=True, index=True, nullable=False)
    phone = Column(String(15), unique=True, index=True, nullable=False)
    hashed_password = Column(String(200), nullable=False)

    # Citizen profile fields
    age = Column(Integer, nullable=True)
    gender = Column(String(20), nullable=True, default="Other")
    state = Column(String(50), nullable=True)
    district = Column(String(50), nullable=True)
    annual_income = Column(Float, nullable=True)
    occupation = Column(String(100), nullable=True)
    category = Column(String(20), nullable=True, default="General")  # General, OBC, SC, ST, BPL, EWS
    language_preference = Column(String(10), nullable=True, default="hi")
    is_farmer = Column(Boolean, default=False)
    land_area_acres = Column(Float, nullable=True)
    has_ration_card = Column(Boolean, default=False)
    ration_card_type = Column(String(20), nullable=True)  # AAY, PHH, NPHH

    # Meta
    is_active = Column(Boolean, default=True)
    aadhaar_last4 = Column(String(4), nullable=True)
    profile_complete = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    # Relationships
    documents = relationship("UserDocument", back_populates="user", cascade="all, delete-orphan")


class UserDocument(Base):
    __tablename__ = "user_documents"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=True, index=True)
    tracking_code = Column(String(50), unique=True, index=True, nullable=False)
    document_type = Column(String(50), nullable=False)  # aadhaar, land_record, caste_certificate, income_certificate
    filename = Column(String(255), nullable=False)
    file_format = Column(String(20), nullable=True)  # PDF, Image
    extracted_fields = Column(JSON, nullable=False, default=dict)
    raw_text = Column(Text, nullable=True)
    confidence_score = Column(Float, default=95.0)
    status = Column(String(50), default="OCR_VERIFIED")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("User", back_populates="documents")
