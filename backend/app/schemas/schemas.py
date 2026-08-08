from enum import Enum
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

class DifficultyLevel(str, Enum):
    BEGINNER = "beginner"
    INTERMEDIATE = "intermediate"
    ADVANCED = "advanced"
    EXPERT = "expert"


class CandidateMission(BaseModel):
    day: int
    title: str
    passed: bool = True
    skipped: bool = False
    attempts: int = 1


class CandidateSignals(BaseModel):
    commitDays: int = 0
    missionsCompleted: int = 0
    missionsFirstTry: int = 0


class CandidatePayload(BaseModel):
    candidate_id: str = ""
    name: str = ""
    role: str = ""
    experience: int = 0
    education: str = ""
    status: str = "COMPLETED"
    missions: List[CandidateMission] = []
    signals: CandidateSignals = CandidateSignals()


class StartInterviewRequest(BaseModel):
    candidate_id: str

class SubmitAnswerRequest(BaseModel):
    answer: str

# --- /api/interview protocol (per technical-spec.md) ---
class InterviewRequest(BaseModel):
    sessionId: str = Field(..., min_length=1, max_length=128)
    candidate: Optional[CandidatePayload] = None
    message: Optional[str] = Field(None, max_length=4000)


class QuestionMeta(BaseModel):
    question_number: int
    question: str
    topic: str
    day: int
    module: str
    difficulty: str
    is_follow_up: bool = False
    followup_label: Optional[str] = None


class FeedbackPublic(BaseModel):
    summary: str
    strengths: List[str]
    gaps: List[str]
    next: List[str]


class InterviewResponse(BaseModel):
    reply: str
    done: bool = False
    sessionId: str = ""
    feedback: Optional[Dict[str, Any]] = None
    question: Optional[QuestionMeta] = None
    progress: Optional[Dict[str, Any]] = None
    degraded_mode: bool = False
