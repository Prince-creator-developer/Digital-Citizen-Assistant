import httpx
from app.config import settings

class SarvamService:
    def __init__(self):
        self.api_key = settings.SARVAM_API_KEY
        self.stt_url = "https://api.sarvam.ai/speech-to-text"
        self.tts_url = "https://api.sarvam.ai/text-to-speech"

    async def speech_to_text(self, audio_bytes: bytes, language_code: str = "hi-IN") -> str:
        """Converts Indian regional speech audio bytes to text using Sarvam AI Speech API."""
        if self.api_key == "mock_sarvam_key" or not self.api_key:
            # Fallback simulated response for local testing
            return "नमस्ते, मैं किसान हूँ और मुझे फसल बीमा योजना के बारे में जानना है।"

        headers = {"api-subscription-key": self.api_key}
        files = {"file": ("audio.wav", audio_bytes, "audio/wav")}
        data = {"language_code": language_code, "model": "saaras:v1"}

        async with httpx.AsyncClient() as client:
            try:
                response = await client.post(self.stt_url, headers=headers, files=files, data=data, timeout=10.0)
                if response.status_code == 200:
                    res_json = response.json()
                    return res_json.get("transcript", "आवाज़ समझ नहीं आई, कृपया फिर से बोलें।")
            except Exception as e:
                print(f"Sarvam STT Error: {e}")
        return "नमस्ते! मुझे कृषि कल्याण योजनाओं की जानकारी चाहिए।"

    async def text_to_speech(self, text: str, language_code: str = "hi-IN") -> dict:
        """Converts assistant text response to streaming regional audio URL using Sarvam AI TTS API."""
        if self.api_key == "mock_sarvam_key" or not self.api_key:
            return {
                "status": "success",
                "audio_url": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
                "text": text
            }

        headers = {"api-subscription-key": self.api_key, "Content-Type": "application/json"}
        payload = {
            "inputs": [text],
            "target_language_code": language_code,
            "speaker": "meera",
            "pitch": 0,
            "pace": 1.05,
            "loudness": 1.5,
            "speech_sample_rate": 16000,
            "enable_preprocessing": True,
            "model": "bulbul:v1"
        }

        async with httpx.AsyncClient() as client:
            try:
                response = await client.post(self.tts_url, headers=headers, json=payload, timeout=10.0)
                if response.status_code == 200:
                    res_data = response.json()
                    return {
                        "status": "success",
                        "audio_base64": res_data.get("audios", [""])[0],
                        "text": text
                    }
            except Exception as e:
                print(f"Sarvam TTS Error: {e}")

        return {
            "status": "fallback",
            "audio_url": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
            "text": text
        }

sarvam_service = SarvamService()
