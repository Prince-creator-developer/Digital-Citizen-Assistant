from fastapi import FastAPI
from fastapi.responses import HTMLResponse
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.db.database import engine, Base
from app.api import voice, schemes, eligibility, application, assistant
from app.api import auth as auth_router
from app.models import user_model  # ensure User table is created

# Initialize database tables (creates users table too)
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
app.include_router(auth_router.router, prefix=settings.API_V1_STR)

@app.get("/", response_class=HTMLResponse)
def root():
    return """
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>Digital Citizen Assistant — Valerion Coders (SIH 2026)</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    </head>
    <body class="bg-slate-950 text-slate-100 font-sans min-h-screen flex items-center justify-center p-6 select-none">
        <div class="max-w-xl w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-6 text-center">
            <div class="w-16 h-16 bg-gradient-to-tr from-blue-600 to-indigo-500 text-white rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-blue-500/20 text-2xl font-bold">
                <i class="fa-solid fa-robot"></i>
            </div>
            <div>
                <span class="px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full text-xs font-semibold uppercase tracking-wider">Status: Online</span>
                <h1 class="text-2xl font-bold text-white mt-3">Digital Citizen Assistant API</h1>
                <p class="text-xs text-slate-400 mt-1">BHARAT PRAGATI Track · DECODE SIH 2026 · Team: <strong class="text-blue-400">Valerion Coders</strong></p>
            </div>
            
            <div class="grid grid-cols-2 gap-3 text-left">
                <a href="http://localhost:3000" target="_blank" class="p-4 bg-slate-800/80 hover:bg-slate-800 border border-slate-700 hover:border-blue-500/50 rounded-2xl transition group">
                    <div class="text-blue-400 text-lg mb-1"><i class="fa-solid fa-laptop-code"></i></div>
                    <div class="text-xs font-bold text-white group-hover:text-blue-400">Next.js Web UI</div>
                    <div class="text-[10px] text-slate-400">http://localhost:3000</div>
                </a>
                <a href="/docs" class="p-4 bg-slate-800/80 hover:bg-slate-800 border border-slate-700 hover:border-emerald-500/50 rounded-2xl transition group">
                    <div class="text-emerald-400 text-lg mb-1"><i class="fa-solid fa-book-open"></i></div>
                    <div class="text-xs font-bold text-white group-hover:text-emerald-400">API Documentation</div>
                    <div class="text-[10px] text-slate-400">http://localhost:8000/docs</div>
                </a>
            </div>

            <div class="p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl text-left text-xs text-slate-300 space-y-1">
                <div class="font-semibold text-blue-400"><i class="fa-solid fa-circle-info"></i> How to run the interactive Web App:</div>
                <div class="text-[11px] text-slate-400 font-mono">1. Backend API is running here on port 8000</div>
                <div class="text-[11px] text-slate-400 font-mono">2. Start frontend: <span class="text-amber-300">cd frontend &amp;&amp; npm run dev</span></div>
                <div class="text-[11px] text-slate-400 font-mono">3. Open <a href="http://localhost:3000" class="text-blue-400 underline">http://localhost:3000</a> in your browser</div>
            </div>
        </div>
    </body>
    </html>
    """
