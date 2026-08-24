import uuid
import datetime
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel

from app.db.database import get_db
from app.models.models import Application, CitizenProfile, Scheme
from app.services.n8n_service import n8n_service

router = APIRouter(prefix="/application", tags=["Application & Document Automation"])

class ApplicationSubmitRequest(BaseModel):
    citizen_id: int
    scheme_id: int
    documents_url: str = "https://storage.gov.in/docs/aadhaar_ration_card.pdf"

@router.post("/apply")
async def submit_application(
    payload: ApplicationSubmitRequest,
    db: Session = Depends(get_db)
):
    """
    Submits scheme application and triggers n8n webhook workflow
    for automated document verification and form processing.
    """
    citizen = db.query(CitizenProfile).filter(CitizenProfile.id == payload.citizen_id).first()
    scheme = db.query(Scheme).filter(Scheme.id == payload.scheme_id).first()
    
    if not citizen or not scheme:
        raise HTTPException(status_code=404, detail="Citizen or Scheme record not found")

    tracking_code = f"GOV-SIH-{uuid.uuid4().hex[:8].upper()}"

    new_app = Application(
        tracking_code=tracking_code,
        citizen_id=citizen.id,
        scheme_id=scheme.id,
        status="Document Verification in Progress",
        documents_url=payload.documents_url,
        remarks="Submitted via Digital Citizen Voice Assistant"
    )

    db.add(new_app)
    db.commit()
    db.refresh(new_app)

    # Trigger n8n automated verification workflow
    n8n_result = await n8n_service.trigger_document_verification({
        "application_id": new_app.id,
        "tracking_code": tracking_code,
        "citizen_name": citizen.name,
        "phone_number": citizen.phone_number,
        "scheme_name": scheme.title,
        "documents_url": payload.documents_url,
        "timestamp": datetime.datetime.utcnow().isoformat()
    })

    return {
        "status": "success",
        "message": "आवेदन सफलतापूर्वक दर्ज कर लिया गया है।",
        "tracking_code": tracking_code,
        "application_id": new_app.id,
        "current_status": new_app.status,
        "n8n_automation": n8n_result
    }

@router.get("/status/{tracking_code_or_id}")
def check_application_status(
    tracking_code_or_id: str,
    db: Session = Depends(get_db)
):
    """Retrieves real-time status and timeline for a scheme application."""
    if tracking_code_or_id.isdigit():
        app_obj = db.query(Application).filter(Application.id == int(tracking_code_or_id)).first()
    else:
        app_obj = db.query(Application).filter(Application.tracking_code == tracking_code_or_id).first()

    if not app_obj:
        raise HTTPException(status_code=404, detail="Application tracking code not found")

    return {
        "tracking_code": app_obj.tracking_code,
        "citizen_name": app_obj.citizen.name,
        "scheme_title": app_obj.scheme.title,
        "status": app_obj.status,
        "submitted_at": app_obj.submitted_at.isoformat(),
        "remarks": app_obj.remarks,
        "timeline": [
            {"step": "Application Submitted", "date": app_obj.submitted_at.strftime("%Y-%m-%d"), "completed": True},
            {"step": "Aadhaar & Income Verification", "date": "Automated (n8n)", "completed": True},
            {"step": "Department Approval", "date": "In Progress", "completed": app_obj.status in ["Approved", "DBT Processed"]},
            {"step": "Direct Benefit Transfer (DBT)", "date": "Pending Bank Credit", "completed": app_obj.status == "DBT Processed"}
        ]
    }
