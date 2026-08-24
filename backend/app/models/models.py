import datetime
from sqlalchemy import Column, Integer, String, Float, JSON, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from app.db.database import Base

class CitizenProfile(Base):
    __tablename__ = "citizen_profiles"

    id = Column(Integer, primary_key=True, index=True)
    phone_number = Column(String(15), unique=True, index=True, nullable=False)
    name = Column(String(100), nullable=False)
    age = Column(Integer, nullable=False)
    gender = Column(String(20), nullable=False, default="Other")
    state = Column(String(50), nullable=False)
    annual_income = Column(Float, nullable=False)
    occupation = Column(String(100), nullable=False)
    category = Column(String(20), nullable=False, default="General") # General, OBC, SC, ST
    language_preference = Column(String(10), nullable=False, default="hi")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    applications = relationship("Application", back_populates="citizen")

class Scheme(Base):
    __tablename__ = "schemes"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200), nullable=False)
    department = Column(String(150), nullable=False)
    summary = Column(Text, nullable=False)
    category_tag = Column(String(50), nullable=False) # Farmers, Women, Students, Senior Citizens, Artisans
    benefits = Column(Text, nullable=False)
    eligibility_rules = Column(JSON, nullable=False) # e.g. {"max_income": 300000, "min_age": 18, "occupation": "Farmer"}
    vector_embedding = Column(JSON, nullable=True) # 768-dim float vector for semantic search
    application_link = Column(String(500), nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    applications = relationship("Application", back_populates="scheme")

class Application(Base):
    __tablename__ = "applications"

    id = Column(Integer, primary_key=True, index=True)
    tracking_code = Column(String(30), unique=True, index=True, nullable=False)
    citizen_id = Column(Integer, ForeignKey("citizen_profiles.id"), nullable=False)
    scheme_id = Column(Integer, ForeignKey("schemes.id"), nullable=False)
    status = Column(String(50), nullable=False, default="Pending Verification") # Pending, Verified, Under Review, Approved, DBT Processed
    submitted_at = Column(DateTime, default=datetime.datetime.utcnow)
    documents_url = Column(String(500), nullable=True)
    ocr_extracted_data = Column(JSON, nullable=True)
    verification_score = Column(Float, nullable=True, default=0.0)
    remarks = Column(Text, nullable=True)

    citizen = relationship("CitizenProfile", back_populates="applications")
    scheme = relationship("Scheme", back_populates="applications")

class VectorSearchLog(Base):
    __tablename__ = "vector_search_logs"

    id = Column(Integer, primary_key=True, index=True)
    query_text = Column(Text, nullable=False)
    matched_scheme_id = Column(Integer, ForeignKey("schemes.id"), nullable=True)
    similarity_score = Column(Float, nullable=False)
    latency_ms = Column(Float, nullable=False)
    searched_at = Column(DateTime, default=datetime.datetime.utcnow)
