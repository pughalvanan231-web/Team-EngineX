import uuid
import logging
from fastapi import FastAPI, HTTPException, Request, Response, Header
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional, Dict, Any

from app.config import settings
from app.schemas.schemas import StartInterviewRequest, SubmitAnswerRequest
from app.agents.orchestrator import orchestrator, load_candidate_data, load_curriculum_data
from app.db.database import load_interview, save_interview

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] [ReqID: %(correlation_id)s] %(message)s"
)
logger = logging.getLogger("InterviewAgent")

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request Correlation ID Middleware
@app.middleware("http")
async def correlation_id_middleware(request: Request, call_next):
    corr_id = request.headers.get("X-Request-Id", f"req_{uuid.uuid4().hex[:8]}")
    request.state.correlation_id = corr_id
    
    class CorrelationFilter(logging.Filter):
        def filter(self, record):
            record.correlation_id = corr_id
            return True
            
    logger.addFilter(CorrelationFilter())
    logger.info(f"Incoming Request: {request.method} {request.url.path}")
    
    response: Response = await call_next(request)
    response.headers["X-Request-Id"] = corr_id
    logger.removeFilter(CorrelationFilter())
    return response

# System Health Check Endpoint
@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "version": settings.VERSION,
        "ai_provider": settings.AI_PROVIDER,
        "demo_mode": settings.DEMO_MODE,
        "database": settings.DATABASE_PATH
    }

# Candidate Profiles
@app.get(f"{settings.API_PREFIX}/candidates")
def get_candidates():
    return {"candidates": load_candidate_data()}

# Curriculum Knowledge Base
@app.get(f"{settings.API_PREFIX}/curriculum")
def get_curriculum():
    return {"curriculum": load_curriculum_data()}

# Start Interview Session
@app.post(f"{settings.API_PREFIX}/interview/start")
def start_interview(payload: StartInterviewRequest):
    try:
        logger.info(f"Starting interview for candidate: {payload.candidate_id}")
        state = orchestrator.start_interview(payload.candidate_id)
        return state
    except ValueError as e:
        logger.error(f"Failed to start interview: {str(e)}")
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        logger.error(f"Unexpected error starting interview: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to initialize interview engine")

# Submit Candidate Answer
@app.post(f"{settings.API_PREFIX}/interview/{{interview_id}}/answer")
def submit_answer(interview_id: str, payload: SubmitAnswerRequest):
    if not payload.answer or not payload.answer.strip():
        raise HTTPException(status_code=400, detail="Answer string cannot be empty")
        
    try:
        logger.info(f"Processing answer for interview {interview_id}")
        state = orchestrator.process_answer(interview_id, payload.answer.strip())
        return state
    except ValueError as e:
        logger.error(f"Interview error: {str(e)}")
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        logger.error(f"Error processing answer: {str(e)}")
        raise HTTPException(status_code=500, detail="Error evaluating candidate answer")

# Get Interview Session State
@app.get(f"{settings.API_PREFIX}/interview/{{interview_id}}")
def get_interview(interview_id: str):
    state = load_interview(interview_id)
    if not state:
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
@app.post("/api/interview")
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
            state = orchestrator.start_interview(cand_id, session_id=session_id)
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
            state = orchestrator.start_interview(cand_id, session_id=session_id)
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
