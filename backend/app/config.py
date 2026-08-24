import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "Digital Citizen Assistant API"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    
    # Database
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./digital_citizen.db")
    
    # External API Keys
    SARVAM_API_KEY: str = os.getenv("SARVAM_API_KEY", "mock_sarvam_key")
    GROQ_API_KEY: str = os.getenv("GROQ_API_KEY", "mock_groq_key")
    TAVILY_API_KEY: str = os.getenv("TAVILY_API_KEY", "mock_tavily_key")
    N8N_WEBHOOK_URL: str = os.getenv("N8N_WEBHOOK_URL", "https://n8n.example.com/webhook/document-verify")

    class Config:
        case_sensitive = True

settings = Settings()
