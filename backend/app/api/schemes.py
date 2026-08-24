from typing import Optional, List
from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel

from app.db.database import get_db
from app.models.models import Scheme, CitizenProfile
from app.services.tavily_service import tavily_service
from app.services.groq_service import groq_service

router = APIRouter(prefix="/schemes", tags=["Government Schemes"])

class SchemeSearchRequest(BaseModel):
    query: str
    category: Optional[str] = "ALL"
    state: Optional[str] = "All India"
    citizen_profile: Optional[dict] = None

@router.get("/")
def get_all_schemes(
    category: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    """Retrieves list of active government welfare schemes filtered by category."""
    query = db.query(Scheme)
    if category and category != "ALL":
        query = query.filter(Scheme.category_tag == category)
    return query.all()

@router.post("/search")
async def search_schemes_live(
    payload: SchemeSearchRequest,
    db: Session = Depends(get_db)
):
    """
    Accepts user demographic query, performs real-time Tavily API search,
    and runs Groq API (Llama 3) via LangChain for intelligent eligibility matching.
    """
    # 1. Query database schemes first
    db_schemes = db.query(Scheme).all()
    
    # 2. Fetch live policy updates via Tavily Search API
    live_results = await tavily_service.search_live_schemes(payload.query, payload.state or "India")

    # 3. Format structured list
    matched_schemes = []
    for s in db_schemes:
        if payload.category in ["ALL", None] or s.category_tag == payload.category:
            # Check eligibility reasoning if citizen profile is attached
            reasoning_res = {"is_eligible": True, "match_percentage": 88}
            if payload.citizen_profile:
                reasoning_res = await groq_service.analyze_eligibility_and_reasoning(
                    payload.query, payload.citizen_profile, f"{s.title}: {s.summary}"
                )

            matched_schemes.append({
                "id": s.id,
                "title": s.title,
                "department": s.department,
                "summary": s.summary,
                "category_tag": s.category_tag,
                "benefits": s.benefits,
                "application_link": s.application_link,
                "eligibility_rules": s.eligibility_rules,
                "is_eligible": reasoning_res.get("is_eligible", True),
                "match_percentage": reasoning_res.get("match_percentage", 85),
                "reasoning": reasoning_res.get("reasoning", "आप इस योजना की मुख्य पात्रता शर्तों को पूरा करते हैं।")
            })

    return {
        "status": "success",
        "total_results": len(matched_schemes),
        "schemes": matched_schemes,
        "live_web_retrievals": live_results
    }

@router.get("/recommendations/{citizen_id}")
async def get_proactive_recommendations(
    citizen_id: int,
    db: Session = Depends(get_db)
):
    """Proactively evaluates database profile against active schemes and returns personalized welfare recommendations."""
    citizen = db.query(CitizenProfile).filter(CitizenProfile.id == citizen_id).first()
    if not citizen:
        raise HTTPException(status_code=404, detail="Citizen profile not found")

    schemes = db.query(Scheme).all()
    profile_dict = {
        "age": citizen.age,
        "state": citizen.state,
        "annual_income": citizen.annual_income,
        "occupation": citizen.occupation,
        "category": citizen.category
    }

    recommendations = []
    for s in schemes:
        # Check rule match
        rules = s.eligibility_rules or {}
        max_inc = rules.get("max_income", 9999999)
        min_age = rules.get("min_age", 0)

        if citizen.annual_income <= max_inc and citizen.age >= min_age:
            recommendations.append({
                "scheme_id": s.id,
                "title": s.title,
                "department": s.department,
                "benefits": s.benefits,
                "urgency": "High Benefit",
                "recommended_for": citizen.name,
                "match_score": 95
            })

    return {
        "citizen_id": citizen.id,
        "citizen_name": citizen.name,
        "total_recommendations": len(recommendations),
        "recommendations": recommendations
    }
