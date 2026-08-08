import uuid
import logging
from fastapi import FastAPI, HTTPException, Request, Response
from fastapi.middleware.cors import CORSMiddleware
<<<<<<< HEAD
from typing import Optional, Dict, Any
=======
>>>>>>> ef5acd71c8e8fed613b3c93946e4dab1962db1e8

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
<<<<<<< HEAD
        raise HTTPException(status_code=404, detail=f"Interview session {interview_id} not found")
    return state

# Finish Interview & Generate Feedback
@app.post(f"{settings.API_PREFIX}/interview/{{interview_id}}/finish")
def finish_interview(interview_id: str):
    try:
        logger.info(f"Finishing interview {interview_id}")
        state = orchestrator.finish_interview(interview_id)
        return state
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        logger.error(f"Error finishing interview: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to generate final interview feedback")

# Technical-Spec Compliant Unified /api/interview Endpoint
@app.post(f"{settings.API_PREFIX}/interview")
def unified_interview_endpoint(payload: Dict[str, Any]):
    """
    Implements POST /api/interview as defined in technical-spec.md.
    Supports both initialization (sending candidate object / sessionId)
    and conversational turns (sending sessionId + message).
    """
    session_id = payload.get("sessionId") or payload.get("interview_id")
    message = payload.get("message") or payload.get("answer")
    candidate_data = payload.get("candidate")
    candidate_id = payload.get("candidate_id")

    # 1. Start Interview Session if message is not present or session_id does not exist in DB yet
    if not message and (candidate_data or candidate_id or not session_id):
        cand_id = candidate_id or (candidate_data.get("member", {}).get("id") if isinstance(candidate_data, dict) else "CAND-001")
        if not cand_id:
            cand_id = "CAND-001"
        
        try:
            state = orchestrator.start_interview(cand_id)
            if session_id:
                state["interview_id"] = session_id
                state["sessionId"] = session_id
            else:
                state["sessionId"] = state["interview_id"]
            
            q_text = state.get("current_question", {}).get("question", "Welcome. Let's begin your technical interview.")
            return {
                "sessionId": state["interview_id"],
                "reply": q_text,
                "done": False,
                "state": state
            }
        except Exception as e:
            logger.error(f"Error initializing interview in POST /api/interview: {str(e)}")
            raise HTTPException(status_code=500, detail=str(e))

    # 2. Conversation Turn
    if not session_id:
        raise HTTPException(status_code=400, detail="sessionId is required for conversation turn")

    # Try loading existing session
    existing = load_interview(session_id)
    if not existing:
        # If session_id not found in DB, auto-start session with CAND-001
        cand_id = candidate_id or "CAND-001"
        try:
            state = orchestrator.start_interview(cand_id)
            state["interview_id"] = session_id
            state["sessionId"] = session_id
        except Exception as e:
            raise HTTPException(status_code=404, detail=f"Session {session_id} not found")
    
    if message:
        try:
            state = orchestrator.process_answer(session_id, message.strip())
            is_done = state.get("status") == "completed"
            
            if is_done:
                final_fb = state.get("final_feedback") or {}
                fb_summary = final_fb.get("interviewer_summary", "Interview completed.")
                fb_strengths = final_fb.get("strengths", [])
                fb_gaps = final_fb.get("weaknesses", [])
                fb_next = final_fb.get("recommendations", [])
                
                return {
                    "sessionId": session_id,
                    "reply": "Interview completed.",
                    "done": True,
                    "feedback": {
                        "summary": fb_summary,
                        "strengths": fb_strengths,
                        "gaps": fb_gaps,
                        "next": fb_next
                    },
                    "state": state
                }
            else:
                q_text = state.get("current_question", {}).get("question", "")
                return {
                    "sessionId": session_id,
                    "reply": q_text,
                    "done": False,
                    "state": state
                }
        except Exception as e:
            logger.error(f"Error processing answer in POST /api/interview: {str(e)}")
            raise HTTPException(status_code=500, detail=str(e))

    # Fallback status query
    state = load_interview(session_id)
    if not state:
        raise HTTPException(status_code=404, detail="Session not found")
    
    is_done = state.get("status") == "completed"
    if is_done:
        final_fb = state.get("final_feedback") or {}
        return {
            "sessionId": session_id,
            "reply": "Interview completed.",
            "done": True,
            "feedback": {
                "summary": final_fb.get("interviewer_summary", "Interview completed."),
                "strengths": final_fb.get("strengths", []),
                "gaps": final_fb.get("weaknesses", []),
                "next": final_fb.get("recommendations", [])
            },
            "state": state
        }
    else:
        return {
            "sessionId": session_id,
            "reply": state.get("current_question", {}).get("question", ""),
            "done": False,
            "state": state
        }

=======
        raise HTTPException(status_code=404, detail=f"Interview session {session_id} not found")
    return orchestrator.public_response(state)
>>>>>>> ef5acd71c8e8fed613b3c93946e4dab1962db1e8
