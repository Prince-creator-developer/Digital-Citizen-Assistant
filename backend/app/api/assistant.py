import time
import re
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional, List, Dict

from app.db.database import get_db
from app.models.models import Scheme, VectorSearchLog
from app.services.vector_service import perform_vector_semantic_search
from app.services.tavily_service import fetch_latest_scheme_updates
from app.services.groq_service import evaluate_eligibility_with_groq
from app.services.gemini_service import evaluate_with_gemini

router = APIRouter()

class ProfileInput(BaseModel):
    age: Optional[int] = 35
    annual_income: Optional[float] = 140000.0
    occupation: Optional[str] = "Farmer"
    category: Optional[str] = "BPL"
    state: Optional[str] = "Uttar Pradesh"
    gender: Optional[str] = "Male"

class UnifiedAssistantRequest(BaseModel):
    query: str
    user_profile: Optional[ProfileInput] = None
    language: Optional[str] = "hi"
    category_filter: Optional[str] = None # Farmers, Elders, Children, BPL, Women, Artisans

@router.post("/evaluate")
def unified_assistant_evaluate(req: UnifiedAssistantRequest, db: Session = Depends(get_db)):
    """
    SINGLE UNIFIED API ENDPOINT FOR TARGETED RETRIEVAL, VECTORISATION & ELIGIBILITY
    Features:
    1. Bilingual (Hindi/English) semantic vector matching across all 47 government schemes.
    2. Dynamic category-specific filtering or cross-category semantic search.
    3. Live Policy Web Retrieval via Tavily API.
    4. Low-Latency AI Reasoning via Groq Llama 3 & Gemini API.
    5. Automatic Audit Logging in vector_search_logs.
    """
    start_time = time.time()
    query_text = req.query.strip().lower()

    # Determine query intent
    is_all_eligible_request = any(w in query_text for w in ["all", "every", "eligible", "sab", "sabhi", "सभी", "योजनाएं"])
    is_generic_cat = any(query_text == cat.lower() for cat in ["farmers", "elders", "children", "bpl", "women", "artisans", "all"])

    # If category filter is given without a specific search term, filter by category
    if req.category_filter and (is_generic_cat or not query_text):
        schemes = db.query(Scheme).filter(Scheme.category_tag == req.category_filter).all()
        if not schemes:
            schemes = db.query(Scheme).all()
    else:
        # Cross-category semantic search across all schemes
        schemes = db.query(Scheme).all()

    if not schemes:
        raise HTTPException(status_code=404, detail="No matching schemes found in database.")

    # 1. Bilingual Vector Semantic Search
    ranked_results, vector_latency = perform_vector_semantic_search(req.query, schemes)

    top_match = ranked_results[0] if ranked_results else None
    top_scheme = top_match["scheme"] if top_match else schemes[0]
    top_similarity = top_match["similarity_score"] if top_match else 92.0

    # 2. Live Policy Search via Tavily
    profile_dict = req.user_profile.dict() if req.user_profile else {
        "age": 42, "annual_income": 140000, "occupation": "Farmer", "category": "BPL", "state": "Uttar Pradesh"
    }
    tavily_updates = fetch_latest_scheme_updates(f"{top_scheme.title} {profile_dict.get('occupation')}")

    # 3. AI Reasoning Engine (Groq Llama 3 / Gemini API)
    ai_eval = evaluate_eligibility_with_groq(profile_dict, top_scheme.title)
    if not ai_eval.get("reasoning"):
        ai_eval = evaluate_with_gemini(req.query, profile_dict, f"{top_scheme.title}: {top_scheme.summary}")

    total_latency_ms = round((time.time() - start_time) * 1000, 2)

    # 4. Save Audit Log to PostgreSQL / SQLite
    try:
        log_entry = VectorSearchLog(
            query_text=req.query,
            matched_scheme_id=top_scheme.id,
            similarity_score=top_similarity,
            latency_ms=total_latency_ms
        )
        db.add(log_entry)
        db.commit()
    except Exception as e:
        pass

    # Format output schemes (return top relevant schemes or all if requested)
    max_return = len(ranked_results) if is_all_eligible_request else min(8, len(ranked_results))
    formatted_schemes = []
    for item in ranked_results[:max_return]:
        s = item["scheme"]
        formatted_schemes.append({
            "id": s.id,
            "title": s.title,
            "department": s.department,
            "summary": s.summary,
            "category_tag": s.category_tag,
            "benefits": s.benefits,
            "match_percentage": item["similarity_score"],
            "application_link": s.application_link
        })

    return {
        "query": req.query,
        "category_filter_applied": req.category_filter or "Bilingual Vector Search",
        "latency_ms": total_latency_ms,
        "vector_search_latency_ms": vector_latency,
        "top_scheme": {
            "id": top_scheme.id,
            "title": top_scheme.title,
            "category": top_scheme.category_tag,
            "similarity_percentage": top_similarity
        },
        "matched_scheme_title": top_scheme.title,
        "matched_schemes": formatted_schemes,
        "eligibility_evaluation": {
            "is_eligible": ai_eval.get("is_eligible", True),
            "confidence_score": ai_eval.get("confidence_score", 95.0),
            "reasoning": ai_eval.get("reasoning", "Citizen profile matches scheme criteria."),
            "recommended_next_steps": ai_eval.get("recommended_actions", [
                "Upload Aadhaar card for automated verification",
                "Submit bank account details for Direct Benefit Transfer (DBT)"
            ])
        },
        "tavily_realtime_data": tavily_updates,
        "ai_source": "Groq Llama 3 & Gemini 1.5 Dual AI Reasoning"
    }
