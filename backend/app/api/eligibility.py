from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel

from app.db.database import get_db
from app.models.models import Scheme
from app.services.groq_service import groq_service

router = APIRouter(prefix="/eligibility", tags=["Eligibility Engine"])

class EligibilityCheckRequest(BaseModel):
    scheme_id: int
    age: int
    annual_income: float
    occupation: str
    category: str = "General"
    state: str = "All India"

@router.post("/check")
async def check_eligibility(
    payload: EligibilityCheckRequest,
    db: Session = Depends(get_db)
):
    """Conversational eligibility checker evaluating user profile against scheme rules with Llama 3 reasoning."""
    scheme = db.query(Scheme).filter(Scheme.id == payload.scheme_id).first()
    if not scheme:
        raise HTTPException(status_code=404, detail="Scheme not found")

    user_profile = {
        "age": payload.age,
        "annual_income": payload.annual_income,
        "occupation": payload.occupation,
        "category": payload.category,
        "state": payload.state
    }

    result = await groq_service.analyze_eligibility_and_reasoning(
        query=f"Eligibility check for {scheme.title}",
        user_profile=user_profile,
        scheme_details=f"Title: {scheme.title}. Rules: {scheme.eligibility_rules}. Benefits: {scheme.benefits}"
    )

    return {
        "scheme_id": scheme.id,
        "scheme_title": scheme.title,
        "is_eligible": result.get("is_eligible", True),
        "match_percentage": result.get("match_percentage", 90),
        "reasoning": result.get("reasoning", "पात्रता पूर्ण पाई गई।"),
        "recommended_actions": result.get("recommended_actions", ["दस्तावेज़ अपलोड करें"])
    }
