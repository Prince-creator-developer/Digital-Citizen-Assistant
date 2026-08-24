from fastapi import APIRouter, File, UploadFile, Form, HTTPException
from pydantic import BaseModel
from app.services.sarvam_service import sarvam_service

router = APIRouter(prefix="/voice", tags=["Voice Engine"])

class TTSRequest(BaseModel):
    text: str
    language_code: str = "hi-IN"

@router.post("/stt")
async def speech_to_text(
    file: UploadFile = File(...),
    language_code: str = Form("hi-IN")
):
    """
    Receives voice audio blob from frontend, routes to Sarvam AI STT API,
    and returns recognized text in target regional language.
    """
    try:
        audio_bytes = await file.read()
        recognized_text = await sarvam_service.speech_to_text(audio_bytes, language_code)
        return {
            "status": "success",
            "language_code": language_code,
            "transcript": recognized_text
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"STT processing failed: {str(e)}")

@router.post("/tts")
async def text_to_speech(payload: TTSRequest):
    """
    Accepts text response, calls Sarvam AI TTS API, and returns streaming audio base64/URL
    for regional citizen voice response playback.
    """
    try:
        result = await sarvam_service.text_to_speech(payload.text, payload.language_code)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"TTS synthesis failed: {str(e)}")
