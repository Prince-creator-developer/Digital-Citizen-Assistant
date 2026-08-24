from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.db.database import engine, Base
from app.api import voice, schemes, eligibility, application, assistant

# Initialize database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Multilingual Voice and Text Digital Citizen Assistant API for Indian Government Schemes (DECODE SIH 2026 - BHARAT PRAGATI Track)",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Configure CORS for Next.js frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register API Routers
app.include_router(voice.router, prefix=settings.API_V1_STR)
app.include_router(schemes.router, prefix=settings.API_V1_STR)
app.include_router(eligibility.router, prefix=settings.API_V1_STR)
app.include_router(application.router, prefix=settings.API_V1_STR)
app.include_router(assistant.router, prefix=f"{settings.API_V1_STR}/assistant")

@app.get("/")
def root():
    return {
        "status": "online",
        "project": "Digital Citizen Assistant",
        "track": "BHARAT PRAGATI (DECODE SIH 2026)",
        "team": "Valerion Coders",
        "documentation": "/docs"
    }
