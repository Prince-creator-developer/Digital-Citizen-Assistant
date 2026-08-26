import os
import random
import httpx
from typing import Optional

MSG91_AUTH_KEY   = os.getenv("MSG91_AUTH_KEY", "")
MSG91_TEMPLATE_ID = os.getenv("MSG91_TEMPLATE_ID", "")

# In-memory OTP store: { mobile_number: { otp, ref_id } }
# In production use Redis for this
_otp_store: dict = {}

def _generate_otp() -> str:
    return str(random.randint(100000, 999999))

async def send_otp_to_mobile(mobile: str, ref_id: str) -> dict:
    """Send a real 6-digit OTP to any Indian mobile number via MSG91."""
    otp = _generate_otp()
    _otp_store[mobile] = {"otp": otp, "ref_id": ref_id}

    if not MSG91_AUTH_KEY:
        return {"success": False, "reason": "MSG91_AUTH_KEY not configured"}

    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            # MSG91 OTP Send API
            response = await client.post(
                "https://control.msg91.com/api/v5/otp",
                params={
                    "template_id": MSG91_TEMPLATE_ID,
                    "mobile": f"91{mobile.lstrip('0').lstrip('+91')}",
                    "authkey": MSG91_AUTH_KEY,
                    "otp": otp,
                    "otp_length": 6,
                    "otp_expiry": 10
                },
                headers={"Content-Type": "application/json"}
            )
        data = response.json()
        if data.get("type") == "success":
            return {"success": True, "msg91_ref": data.get("request_id", ref_id)}
        else:
            return {"success": False, "reason": data.get("message", "MSG91 error")}
    except Exception as e:
        return {"success": False, "reason": str(e)}


def verify_otp_for_mobile(mobile: str, otp_entered: str) -> bool:
    """Verify the OTP entered by user against the stored OTP."""
    record = _otp_store.get(mobile)
    if not record:
        return False
    return record["otp"] == otp_entered.strip()


def clear_otp(mobile: str):
    """Remove OTP record after successful verification."""
    _otp_store.pop(mobile, None)
