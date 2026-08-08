import uuid
import logging
from fastapi import FastAPI, HTTPException, Request, Response, Header
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional

from app.config import settings
from app.schemas.schemas import StartInterviewRequest, SubmitAnswerRequest
from app.agents.orchestrator import orchestrator, load_candidate_data, load_curriculum_data
from app.db.database import load_interview

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
    
    # Custom logger filter
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

# Get Interview Session State (Session Restore & Reload)
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
