# AI Interview Agent

A production-ready AI Interview Agent built with React (Vite + Tailwind CSS) and FastAPI.

## Structure
- `frontend/`: React + Vite + Tailwind CSS app
- `backend/`: FastAPI Python backend

## Getting Started

### Using Docker Compose
```bash
docker-compose up --build
```

### Local Development

**Backend:**
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Or venv\Scripts\activate on Windows
pip install -r requirements.txt
uvicorn app.main:app --reload
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```
