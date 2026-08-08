from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from enum import Enum

class DifficultyLevel(str, Enum):
    BEGINNER = "beginner"
    INTERMEDIATE = "intermediate"
    ADVANCED = "advanced"
    EXPERT = "expert"

class CandidateMission(BaseModel):
    mission_id: str
    title: str
    day: int
    score: int

class LearningSignals(BaseModel):
    confidence: str
    failed_attempts: int
    strong_areas: List[str] = []
    weak_areas: List[str] = []
    baseline_difficulty: DifficultyLevel = DifficultyLevel.INTERMEDIATE

class CandidateProfile(BaseModel):
    candidate_id: str
    name: str
    role: str
    avatar: Optional[str] = None
    completed_days: List[int] = []
    skipped_days: List[int] = []
    completed_missions: List[CandidateMission] = []
    learning_signals: LearningSignals

class CurriculumTopic(BaseModel):
    day: int
    module: str
    topic: str
    learning_objective: str
    tools: List[str] = []
    related_concepts: List[str] = []

class StartInterviewRequest(BaseModel):
    candidate_id: str

class SubmitAnswerRequest(BaseModel):
    answer: str

class QuestionItem(BaseModel):
    question_number: int
    question: str
    topic: str
    curriculum_day: int
    difficulty: DifficultyLevel
    is_follow_up: bool = False
    followup_label: Optional[str] = None

class AnswerEvaluation(BaseModel):
    technical_correctness: int = Field(ge=1, le=10)
    depth: int = Field(ge=1, le=10)
    practical_understanding: int = Field(ge=1, le=10)
    engineering_reasoning: int = Field(ge=1, le=10)
    communication: int = Field(ge=1, le=10)
    overall: int = Field(ge=1, le=10)
    quality_classification: str = "Partial" # Strong, Partial, Weak, Vague, Incorrect, Exceptional
    strengths: List[str] = []
    weaknesses: List[str] = []
    missing_concepts: List[str] = []
    evidence: str = ""
    suggested_action: str = ""

class TopicScore(BaseModel):
    topic: str
    day: int
    score: int # 0 - 100 percentage
    status: str # Mastered, Developing, Needs Practice

class CategoryScore(BaseModel):
    category: str
    score: int # 0 - 100 percentage

class FinalFeedback(BaseModel):
    overall_score: int
    category_scores: List[CategoryScore] = []
    topic_scores: List[TopicScore] = []
    strengths: List[str] = []
    weaknesses: List[str] = []
    recommendations: List[str] = []
    interviewer_summary: str = ""
    traceable_evidence: List[Dict[str, Any]] = []

class InterviewStateSchema(BaseModel):
    candidate_id: str
    interview_id: str
    candidate_name: str
    current_question: Optional[QuestionItem] = None
    question_number: int = 1
    questions_asked: List[Dict[str, Any]] = []
    questions_asked_hashes: List[str] = []
    topics_covered: List[str] = []
    curriculum_days_covered: List[int] = []
    answers: List[Dict[str, Any]] = []
    evaluations: List[Dict[str, Any]] = []
    strengths: List[str] = []
    weaknesses: List[str] = []
    unresolved_concepts: List[str] = []
    followup_depth_current: int = 0
    difficulty: DifficultyLevel = DifficultyLevel.INTERMEDIATE
    interview_stage: str = "Warm-up & Fundamentals"
    status: str = "in_progress" # in_progress | completed | abandoned
    degraded_mode: bool = False
    created_at: str
    updated_at: str
    final_feedback: Optional[FinalFeedback] = None
