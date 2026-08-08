from enum import Enum
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

class DifficultyLevel(str, Enum):
    BEGINNER = "beginner"
    INTERMEDIATE = "intermediate"
    ADVANCED = "advanced"
    EXPERT = "expert"

class PriorityCategory(str, Enum):
    SKIPPED = "SKIPPED"
    HIGH_ATTEMPTS = "HIGH_ATTEMPTS"
    MEDIUM_ATTEMPTS = "MEDIUM_ATTEMPTS"
    LOW_ATTEMPTS = "LOW_ATTEMPTS"
    MISSING = "MISSING"

class AnswerQuality(str, Enum):
    EXCEPTIONAL = "EXCEPTIONAL"
    STRONG = "STRONG"
    PARTIAL = "PARTIAL"
    WEAK = "WEAK"
    INCORRECT = "INCORRECT"

class DayStatus(str, Enum):
    PASSED = "PASSED"
    FAILED = "FAILED"
    SKIPPED = "SKIPPED"
    MISSING = "MISSING"

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
    candidate_id: str = Field(..., alias="candidateId")
    candidateId: Optional[str] = None

class SubmitAnswerRequest(BaseModel):
    answer: str = ""
    message: Optional[str] = None

class PriorityAnalysisItem(BaseModel):
    topic: str
    day: int
    category: PriorityCategory
    priority: int
    attempts: Optional[int] = None
    reason: str
    recommendedDifficulty: str = "intermediate"

class NormalizedDayItem(BaseModel):
    day: int
    title: str
    status: DayStatus
    attempts: Optional[int] = None
    module: str = ""

class QuestionMeta(BaseModel):
    question_number: int
    question: str
    topic: str
    day: int
    module: str
    difficulty: str
    is_follow_up: bool = False
    followup_label: Optional[str] = None
    priority_category: Optional[str] = None
    priority_reason: Optional[str] = None
    attempts: Optional[int] = None

class FeedbackPublic(BaseModel):
    summary: str
    strengths: List[str]
    gaps: List[str]
    next: List[str]

class QuestionReviewItem(BaseModel):
    question_number: int
    topic: str
    day: int
    priorityCategory: str
    reason: str
    question: str
    answer: str
    evaluation_score: int
    classification: str
    feedback: str

class FinalResultOutput(BaseModel):
    sessionId: str
    candidateId: str
    candidateName: str
    jobRole: str
    overallScore: int
    performanceLabel: str
    categoryScores: Dict[str, int]
    strengths: List[str]
    weaknesses: List[str]
    knowledgeGaps: List[str]
    skippedTopicsAnalysis: List[Dict[str, Any]]
    missingSignalsAnalysis: List[Dict[str, Any]]
    questionReviews: List[Dict[str, Any]]
    hiringRecommendation: Dict[str, str]

class InterviewResponse(BaseModel):
    reply: str
    done: bool = False
    sessionId: str = ""
    feedback: Optional[Dict[str, Any]] = None
    question: Optional[QuestionMeta] = None
    progress: Optional[Dict[str, Any]] = None
    degraded_mode: bool = False
