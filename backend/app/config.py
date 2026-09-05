import os

try:
    from pydantic_settings import BaseSettings
except ImportError:
    try:
        from pydantic import BaseSettings
    except ImportError:
        class BaseSettings:
            pass

class Settings(BaseSettings):
    PROJECT_NAME: str = os.getenv("PROJECT_NAME", "Digital Citizen Assistant API")
    VERSION: str = os.getenv("VERSION", "1.0.0")
    API_V1_STR: str = os.getenv("API_V1_STR", "/api/v1")
    
    # Database (Defaults to PostgreSQL, falls back gracefully)
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL", 
        "postgresql://postgres:prince@localhost:5432/digital_citizen_db"
    )
    
    # External API Keys & Webhooks
    SARVAM_API_KEY: str = os.getenv("SARVAM_API_KEY", "mock_sarvam_key")
    GROQ_API_KEY: str = os.getenv("GROQ_API_KEY", "mock_groq_key")
    TAVILY_API_KEY: str = os.getenv("TAVILY_API_KEY", "mock_tavily_key")
    N8N_WEBHOOK_URL: str = os.getenv("N8N_WEBHOOK_URL", "https://n8n.example.com/webhook/document-verify")
    SESSION_SECRET: str = os.getenv("SESSION_SECRET", "valerion-sih2026-secret-key-digital-citizen-bharat-pragati")

    class Config:
        case_sensitive = True
        extra = "allow"

settings = Settings()
