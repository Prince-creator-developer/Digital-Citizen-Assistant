# Digital Citizen Assistant (डिजिटल नागरिक सहायक)
> Multilingual Voice & Text Platform for Rural & Semi-Urban Indian Citizens to Discover, Check Eligibility, and Apply for Government Welfare Schemes.
> **Track:** BHARAT PRAGATI (DECODE SIH 2026) | **Team:** Valerion Coders

---

## 📌 Architecture Highlights
- **Voice Engine**: Real-Time Speech-to-Text (STT) & Text-to-Speech (TTS) via **Sarvam AI APIs** (`saaras:v1` & `bulbul:v1`) supporting Indian regional languages (Hindi, Kannada, Tamil, Telugu, Marathi, Bengali).
- **Intelligent Reasoning**: Low-latency LLM eligibility reasoning powered by **Groq API (Llama 3)** via **LangChain**.
- **Real-Time Policy Retrieval**: Active policy web retrieval powered by **Tavily Search API**.
- **Automation Pipeline**: Document OCR & Aadhaar/DBT verification workflow using **n8n Automation**.
- **Backend Stack**: **FastAPI** (Python 3.11), **SQLAlchemy**, **PostgreSQL** / SQLite.
- **Frontend Stack**: **Next.js 14**, **React**, **Tailwind CSS**, **react-i18next** multilingual switcher, Web Audio API recorder.

---

## 📁 Repository Structure
```
digital-citizen-assistant/
├── frontend/                   # Next.js App Router (React, Tailwind CSS, react-i18next)
│   ├── src/
│   │   ├── app/                # Pages: Dashboard, Eligibility Checker, Status Tracking
│   │   ├── components/         # Navbar, LanguageSelector, VoiceAssistantModal, SchemeCard, EligibilityForm
│   │   ├── i18n/               # Regional Language Translations (hi, en, kn, ta, te, mr, bn)
│   │   └── services/           # Axios API client connecting to FastAPI
│   ├── package.json
│   ├── tailwind.config.js
│   └── vercel.json
├── backend/                    # FastAPI Server (Python)
│   ├── app/
│   │   ├── api/                # Endpoints: /voice, /schemes, /eligibility, /application
│   │   ├── services/           # Sarvam AI, Groq (Llama 3), Tavily, n8n integration modules
│   │   ├── models/             # SQLAlchemy DB Models (CitizenProfile, Scheme, Application)
│   │   ├── db/                 # Database engine & seed script (seed.py)
│   │   └── main.py             # FastAPI entrypoint with CORS
│   ├── requirements.txt
│   ├── Dockerfile
│   └── render.yaml
├── n8n/                        # Automation Workflows
│   └── document_automation.json# n8n document & Aadhaar verification workflow blueprint
├── .env.example                # Environment Variable Template
└── README.md
```

---

## ⚡ Quick Start Guide (Local Setup)

### 1. Backend Setup (FastAPI)
```bash
cd backend

# Create & activate virtual environment
python -m venv venv
# On Windows:
.\venv\Scripts\activate
# On Linux/macOS:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Seed Database with sample government welfare schemes & citizen profile
python app/db/seed.py

# Run FastAPI Server
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```
API Documentation will be available at: **`http://localhost:8000/docs`**

### 2. Frontend Setup (Next.js)
```bash
cd frontend

# Install Node modules
npm install

# Start Next.js Development Server
npm run dev
```
Open **`http://localhost:3000`** in your browser.

---

## 🔑 Environment Variables Setup
Copy `.env.example` to `.env` in the root and fill in your API credentials:
```env
SARVAM_API_KEY=your_sarvam_ai_speech_api_key
GROQ_API_KEY=gsk_your_groq_llama3_api_key
TAVILY_API_KEY=tvly-your_tavily_search_api_key
N8N_WEBHOOK_URL=https://n8n.your-domain.com/webhook/document-automation
DATABASE_URL=sqlite:///./digital_citizen.db
```

---

## 🚀 Deployment Guide

### Backend & PostgreSQL (Render Cloud Platform)
1. Push repo to GitHub.
2. Link repository on **Render**.
3. Select `render.yaml` blueprint or create a Web Service linking to `backend/Dockerfile`.
4. Add environment variables in Render Dashboard (`SARVAM_API_KEY`, `GROQ_API_KEY`, `TAVILY_API_KEY`).

### Frontend (Vercel)
1. Connect repository on **Vercel**.
2. Set Root Directory to `frontend`.
3. Add Environment Variable: `NEXT_PUBLIC_API_BASE_URL=https://your-render-backend-url.onrender.com/api/v1`.
4. Deploy!

---
*DECODE SIH 2026 - BHARAT PRAGATI | Presented by Team Valerion Coders*
