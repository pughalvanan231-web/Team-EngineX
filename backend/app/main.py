import uuid
import logging
from fastapi import FastAPI, HTTPException, Request, Response
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.schemas.schemas import InterviewRequest
from app.agents.orchestrator import orchestrator, load_candidate_data, load_curriculum_data
from app.db.database import init_db

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger("InterviewAgent")

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Adaptive AI Technical Interview Agent",
    version=settings.VERSION,
    docs_url="/docs",
    redoc_url="/redoc",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

init_db()


@app.middleware("http")
async def correlation_id_middleware(request: Request, call_next):
    corr_id = request.headers.get("X-Request-Id", f"req_{uuid.uuid4().hex[:8]}")
    request.state.correlation_id = corr_id
    response: Response = await call_next(request)
    response.headers["X-Request-Id"] = corr_id
    return response


@app.get("/health")
@app.get("/api/v1/health")
def health_check():
    return {
        "status": "healthy",
        "version": settings.VERSION,
        "ai_provider": settings.AI_PROVIDER,
        "demo_mode": settings.DEMO_MODE,
    }


def _public_candidates() -> list:
    """Public-safe candidate cards (no internal scoring)."""
    out = []
    for c in load_candidate_data():
        m = c.get("member", {})
        missions = c.get("missions", [])
        completed = [x for x in missions if x.get("passed") and not x.get("skipped")]
        failed = [x for x in missions if not x.get("passed")]
        skipped = [x for x in missions if x.get("skipped")]
        out.append({
            "candidate_id": m.get("id"),
            "name": m.get("name"),
            "role": m.get("jobRole"),
            "experience": m.get("yearsExperience"),
            "education": m.get("education"),
            "status": m.get("status"),
            "completed_count": len(completed),
            "failed_count": len(failed),
            "skipped_count": len(skipped),
            "commit_days": c.get("signals", {}).get("commitDays", 0),
            "days": sorted({x.get("day") for x in missions}),
        })
    return out


@app.get("/api/v1/candidates")
def get_candidates():
    return {"candidates": _public_candidates()}


@app.get("/api/v1/curriculum")
def get_curriculum():
    return {"curriculum": load_curriculum_data()}


@app.post("/api/interview")
@app.post("/api/v1/interview")
def interview(payload: InterviewRequest):
    """Primary interview endpoint per technical-spec.md.

    Start:    { "sessionId": "...", "candidate": {...} }
    Continue: { "sessionId": "...", "message": "..." }
    """
    try:
        if not payload.message or not payload.message.strip():
            state = orchestrator.start_interview(payload.sessionId, payload.candidate)
            logger.info("Started interview session %s", payload.sessionId)
        else:
            state = orchestrator.process_message(payload.sessionId, payload.message.strip())
            logger.info("Processed answer for session %s", payload.sessionId)
        return orchestrator.public_response(state)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        logger.exception("Interview error for session %s", payload.sessionId)
        raise HTTPException(status_code=500, detail="Something went wrong while processing your response.")


@app.get("/api/interview/{session_id}")
@app.get("/api/v1/interview/{session_id}")
def get_interview(session_id: str):
    """Restore a session by sessionId (survives frontend refresh)."""
    state = orchestrator.get_session(session_id)
    if not state:
        raise HTTPException(status_code=404, detail=f"Interview session {session_id} not found")
    return orchestrator.public_response(state)
