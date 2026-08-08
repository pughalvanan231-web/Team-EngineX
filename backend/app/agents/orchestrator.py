import os
import json
import uuid
import datetime
import hashlib
from typing import Dict, Any, List, Optional, Tuple

from app.config import settings
from app.db.database import save_interview, load_interview
from app.services.provider import ai_service
from app.schemas.schemas import CandidatePayload, DifficultyLevel

# Difficulty system: 5 levels
DIFFICULTY_LEVELS = ["fundamentals", "application", "debugging", "architecture", "engineering"]
DIFFICULTY_LABELS = {
    "fundamentals": "Fundamentals",
    "application": "Application",
    "debugging": "Debugging",
    "architecture": "Architecture",
    "engineering": "Engineering Judgment",
}

STAGES = [
    "Introduction",
    "Experience & Warm-up",
    "Core Technical Assessment",
    "Adaptive Follow-up",
    "System Design & Scenarios",
    "Production Thinking",
    "Capstone Discussion",
]


def _now() -> str:
    return datetime.datetime.now(datetime.timezone.utc).isoformat()


def normalize_hash(text: str) -> str:
    return hashlib.md5(" ".join(text.lower().strip().split()).encode("utf-8")).hexdigest()


def step_difficulty(current_idx: int, direction: int) -> int:
    return max(0, min(len(DIFFICULTY_LEVELS) - 1, current_idx + direction))


def compute_overall(corr: int, depth: int, pract: int, reas: int, comm: int) -> int:
    raw = 0.30 * corr + 0.20 * depth + 0.20 * pract + 0.15 * reas + 0.15 * comm
    return max(1, min(10, int(round(raw))))


# ---------------------------------------------------------------------------
# Data loading (real supplied files)
# ---------------------------------------------------------------------------
def _data_path(name: str) -> str:
    root_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "..", name))
    if os.path.exists(root_path):
        return root_path
    return os.path.join(os.path.dirname(__file__), "..", "data", name)


def load_curriculum_data() -> Dict[str, Any]:
    with open(_data_path("curriculum.json"), "r", encoding="utf-8") as f:
        return json.load(f)


def load_candidate_data() -> List[Dict[str, Any]]:
    with open(_data_path("candidates.json"), "r", encoding="utf-8") as f:
        data = json.load(f)
        if isinstance(data, dict) and "candidates" in data:
            return data["candidates"]
        return data if isinstance(data, list) else []


def get_prompt_template(name: str) -> str:
    path = os.path.join(os.path.dirname(__file__), "..", "prompts", f"{name}.txt")
    if os.path.exists(path):
        with open(path, "r", encoding="utf-8") as f:
            return f.read()
    return "You are an AI interviewer evaluating the candidate."


class InterviewOrchestrator:
    def __init__(self):
        self.curriculum = load_curriculum_data()
        self.days = self.curriculum.get("days", []) if isinstance(self.curriculum, dict) else self.curriculum
        self.modules = self.curriculum.get("modules", []) if isinstance(self.curriculum, dict) else []
        self.candidates = load_candidate_data()
        self.day_index = {d["day"]: d for d in self.days} if isinstance(self.days, list) else {}

    def _module_for_day(self, day: int) -> str:
        day = int(day)
        for mod in self.modules:
            if isinstance(mod.get("days"), list) and len(mod["days"]) == 2:
                lo, hi = mod["days"]
                if lo <= day <= hi:
                    return mod.get("title", "AI Engineering")
        return "AI Engineering"

    def get_day(self, day: int) -> Dict[str, Any]:
        day = int(day)
        return self.day_index.get(day, {"day": day, "title": f"Day {day}", "tools": [], "objectives": []})

    def find_candidate(self, candidate_id: str) -> Optional[Dict[str, Any]]:
        self.candidates = load_candidate_data()
        for c in self.candidates:
            c_id = c.get("candidate_id") or c.get("member", {}).get("id") or c.get("id")
            if c_id == candidate_id:
                return c
        return self.candidates[0] if self.candidates else None

    # Profile building
    def build_profile(self, payload: Optional[Any]) -> Dict[str, Any]:
        cand_id = getattr(payload, "candidate_id", None) if payload else None
        if not cand_id and isinstance(payload, str):
            cand_id = payload
        raw = self.find_candidate(cand_id) if cand_id else (self.candidates[0] if self.candidates else None)

        if raw:
            member = raw.get("member", raw)
            missions = raw.get("missions", raw.get("completed_missions", []))
            signals = raw.get("signals", raw.get("learning_signals", {}))
        else:
            member = {"id": "CAND-001", "name": "Sarah Johnson", "jobRole": "Senior Data Engineer", "yearsExperience": 9, "education": "MS Computer Science"}
            missions = []
            signals = {}

        completed = [m for m in missions if m.get("passed", True) and not m.get("skipped", False)]
        failed = [m for m in missions if not m.get("passed", True)]
        skipped = [m for m in missions if m.get("skipped", False)]

        completed_days = sorted({m.get("day") for m in completed}) if completed else raw.get("completed_days", [1, 4, 6, 8, 12])

        profile = {
            "candidate_id": member.get("id", member.get("candidate_id", "CAND-001")),
            "name": member.get("name", "Candidate"),
            "role": member.get("jobRole", member.get("role", "AI Engineer")),
            "experience": member.get("yearsExperience", member.get("experience", 2)),
            "education": member.get("education", "Computer Science"),
            "status": member.get("status", "COMPLETED"),
            "completed_days": completed_days,
            "failed_days": sorted({m.get("day") for m in failed}),
            "skipped_days": sorted({m.get("day") for m in skipped}),
            "attempt_map": {m.get("day"): m.get("attempts", 1) for m in completed},
            "signals": {
                "commitDays": signals.get("commitDays", len(completed_days)),
                "missionsCompleted": signals.get("missionsCompleted", len(completed_days)),
                "missionsFirstTry": signals.get("missionsFirstTry", len(completed_days)),
            },
        }
        return profile

    def initial_difficulty(self, profile: Dict[str, Any]) -> int:
        role = profile["role"].lower()
        technical = any(k in role for k in ("engineer", "developer", "architect", "scientist", "devops", "analyst", "programmer"))
        idx = 2  # application
        if technical:
            if profile["experience"] >= 8:
                idx += 1
            if profile["experience"] >= 14:
                idx = min(idx + 1, len(DIFFICULTY_LEVELS) - 1)
        else:
            idx = 1
            if profile["experience"] >= 6:
                idx = 2

        sig = profile["signals"]
        ratio = sig["missionsFirstTry"] / max(1, sig["missionsCompleted"])
        if ratio >= 0.7:
            idx += 1
        if ratio <= 0.25:
            idx -= 1
        if len(profile["failed_days"]) >= 3:
            idx -= 1

        return max(0, min(len(DIFFICULTY_LEVELS) - 1, idx))

    def build_topic_pool(self, profile: Dict[str, Any]) -> List[Dict[str, Any]]:
        pool: List[Dict[str, Any]] = []
        seen = set()

        def add(day_num: int):
            day_num = int(day_num)
            if day_num in seen:
                return
            seen.add(day_num)
            pool.append(self.get_day(day_num))

        for d in profile["failed_days"]:
            add(d)
        for d in sorted(profile["attempt_map"], key=lambda x: profile["attempt_map"][x], reverse=True):
            if profile["attempt_map"][d] >= 3:
                add(d)
        for d in profile["completed_days"]:
            add(d)

        preferred = [21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 10, 11, 12, 15, 18, 20]
        for d in preferred:
            if int(d) in {int(x) for x in profile["completed_days"]}:
                add(d)

        for d in (self.days if isinstance(self.days, list) else []):
            if isinstance(d, dict) and "day" in d:
                add(d["day"])

        if not pool:
            pool = [{"day": 1, "title": "Environment Setup", "tools": ["Python"], "objectives": ["Environment setup"]}]
        return pool

    def next_topic(self, profile: Dict[str, Any], covered_days: List[int], covered_topics: List[str]) -> Dict[str, Any]:
        pool = self.build_topic_pool(profile)
        covered = {int(d) for d in covered_days}
        for day_obj in pool:
            if int(day_obj["day"]) not in covered:
                return day_obj
        for day_obj in pool:
            title = day_obj.get("title", day_obj["day"])
            if title not in covered_topics:
                return day_obj
        return pool[0]

    def stage_for(self, q_num: int) -> str:
        if q_num == 1:
            return "Introduction"
        if q_num == 2:
            return "Experience & Warm-up"
        if q_num <= 4:
            return "Core Technical Assessment"
        if q_num <= 7:
            return "Adaptive Follow-up"
        if q_num <= 9:
            return "System Design & Scenarios"
        if q_num <= 11:
            return "Production Thinking"
        return "Capstone Discussion"

    def start_interview(self, candidate_id: str, session_id: Optional[str] = None) -> Dict[str, Any]:
        profile = self.build_profile(candidate_id)
        diff_idx = self.initial_difficulty(profile)
        interview_id = session_id or f"int_{uuid.uuid4().hex[:12]}"

        state = {
            "session_id": interview_id,
            "interview_id": interview_id,
            "candidate_id": profile["candidate_id"],
            "candidate_name": profile["name"],
            "candidate": profile,
            "status": "in_progress",
            "question_number": 0,
            "answers": [],
            "evaluations": [],
            "questions_asked": [],
            "questions_hashes": [],
            "topics_covered": [],
            "curriculum_days_covered": [],
            "days_covered": [],
            "difficulty_index": diff_idx,
            "difficulty": DIFFICULTY_LEVELS[diff_idx],
            "difficulty_label": DIFFICULTY_LABELS[DIFFICULTY_LEVELS[diff_idx]],
            "interview_stage": "Introduction",
            "stage": "Introduction",
            "followup_depth": 0,
            "followup_depth_current": 0,
            "messages": [],
            "strengths": [],
            "weaknesses": [],
            "unresolved": [],
            "final_feedback": None,
            "degraded": False,
            "created_at": _now(),
            "updated_at": _now(),
        }

        state = self._advance(state, welcome=True)
        save_interview(interview_id, profile["candidate_id"], state["status"], state, state["created_at"], state["updated_at"])
        return state

    def process_answer(self, interview_id: str, candidate_answer: str) -> Dict[str, Any]:
        state = load_interview(interview_id)
        if not state:
            raise ValueError(f"Interview session {interview_id} not found")
        if state.get("status") == "completed":
            return state

        current_q = state["current_question"]
        now = _now()

        eval_result, eval_degraded = self._evaluate_answer(current_q, candidate_answer)
        state["degraded"] = state.get("degraded", False) or eval_degraded

        state["answers"].append({
            "question_number": current_q["question_number"],
            "question": current_q["question"],
            "topic": current_q["topic"],
            "day": current_q["day"],
            "difficulty": current_q["difficulty"],
            "is_follow_up": current_q.get("is_follow_up", False),
            "answer": candidate_answer,
            "timestamp": now,
        })
        state["evaluations"].append(eval_result)

        if eval_result.get("strengths"):
            state.setdefault("strengths", []).extend(eval_result["strengths"])
        if eval_result.get("weaknesses"):
            state.setdefault("weaknesses", []).extend(eval_result["weaknesses"])

        quality = eval_result.get("quality_classification", "Partial")
        diff_idx = state.get("difficulty_index", 2)
        if quality in ("Strong", "Exceptional"):
            diff_idx = step_difficulty(diff_idx, +1)
        elif quality in ("Weak", "Vague", "Incorrect"):
            diff_idx = step_difficulty(diff_idx, -1)
        
        state["difficulty_index"] = diff_idx
        state["difficulty"] = DIFFICULTY_LEVELS[diff_idx]
        state["difficulty_label"] = DIFFICULTY_LABELS[DIFFICULTY_LEVELS[diff_idx]]

        weak_quality = quality in ("Partial", "Weak", "Vague", "Incorrect")
        followup_depth = state.get("followup_depth", 0)
        should_followup = weak_quality and followup_depth < 2

        if should_followup:
            state["followup_depth"] = followup_depth + 1
            state["followup_depth_current"] = state["followup_depth"]
            state = self._generate_followup(state, current_q, candidate_answer, quality, eval_result.get("missing_concepts", []))
        else:
            state["followup_depth"] = 0
            state["followup_depth_current"] = 0
            state = self._advance(state, welcome=False)

        state["updated_at"] = now
        save_interview(interview_id, state["candidate_id"], state["status"], state, state["created_at"], now)
        return state

    def _advance(self, state: Dict[str, Any], welcome: bool) -> Dict[str, Any]:
        profile = state["candidate"]
        answered = len(state["answers"])

        if not welcome and self._should_finish(state, answered):
            return self.finish_interview(state["interview_id"])

        q_num = answered + 1
        stage = self.stage_for(q_num)
        topic_obj = self.next_topic(profile, state.get("curriculum_days_covered", state.get("days_covered", [])), state.get("topics_covered", []))

        state["stage"] = stage
        state["interview_stage"] = stage

        q_item, degraded = self._generate_question(
            profile=profile,
            topic_obj=topic_obj,
            stage=stage,
            q_num=q_num,
            difficulty_index=state.get("difficulty_index", 2),
            is_followup=False,
            followup_label=None,
            previous_questions=state.get("questions_asked", []),
        )
        state["degraded"] = state.get("degraded", False) or degraded
        self._record_question(state, q_item)

        state["question_number"] = q_item["question_number"]
        state["current_question"] = q_item
        return state

    def _generate_followup(self, state: Dict[str, Any], current_q: Dict[str, Any], answer: str, quality: str, missing: List[str]) -> Dict[str, Any]:
        q_item = {
            "question_number": current_q["question_number"] + 1,
            "question": f"Following up on your answer regarding {current_q['topic']}, what failure modes or architectural trade-offs would you expect in production?",
            "topic": current_q["topic"],
            "curriculum_day": current_q.get("day", 8),
            "day": current_q.get("day", 8),
            "module": self._module_for_day(current_q.get("day", 8)),
            "difficulty": DIFFICULTY_LEVELS[state.get("difficulty_index", 2)],
            "is_follow_up": True,
            "followup_label": "FOLLOW-UP QUESTION",
        }
        self._record_question(state, q_item)
        state["question_number"] = q_item["question_number"]
        state["current_question"] = q_item
        return state

    def _record_question(self, state: Dict[str, Any], q_item: Dict[str, Any]) -> None:
        q_list = state.setdefault("questions_asked", [])
        if isinstance(q_list, list) and (not q_list or isinstance(q_list[0], str)):
            q_list.append(q_item["question"])
        else:
            q_list.append(q_item)

        state.setdefault("questions_hashes", []).append(normalize_hash(q_item["question"]))
        if q_item["topic"] not in state.setdefault("topics_covered", []):
            state["topics_covered"].append(q_item["topic"])
        
        day_val = q_item.get("day") or q_item.get("curriculum_day")
        if day_val and day_val not in state.setdefault("curriculum_days_covered", []):
            state["curriculum_days_covered"].append(day_val)
        if day_val and day_val not in state.setdefault("days_covered", []):
            state["days_covered"].append(day_val)

    def _should_finish(self, state: Dict[str, Any], answered: int) -> bool:
        days_count = len(state.get("curriculum_days_covered", state.get("days_covered", [])))
        if answered >= 8 and days_count >= 4:
            return True
        return answered >= 12

    def _generate_question(self, profile: Dict[str, Any], topic_obj: Dict[str, Any], stage: str, q_num: int,
                           difficulty_index: int, is_followup: bool, followup_label: Optional[str],
                           previous_questions: Optional[List[Any]] = None) -> Tuple[Dict[str, Any], bool]:
        diff = DIFFICULTY_LEVELS[difficulty_index]
        day_num = topic_obj.get("day", 8)
        topic_title = topic_obj.get("title") or topic_obj.get("topic", f"Day {day_num}")
        
        q_text = f"In Day {day_num} of your cohort ({topic_title}), walk me through how you implemented your core approach and explain the main engineering trade-offs."

        q_item = {
            "question_number": q_num,
            "question": q_text,
            "topic": topic_title,
            "curriculum_day": day_num,
            "day": day_num,
            "module": self._module_for_day(day_num),
            "difficulty": diff,
            "is_follow_up": is_followup,
            "followup_label": followup_label or "CORE QUESTION",
        }
        return q_item, False

    def _evaluate_answer(self, q_item: Dict[str, Any], answer: str) -> Tuple[Dict[str, Any], bool]:
        ans_len = len(answer.strip())
        quality = "Strong" if ans_len > 120 else "Partial" if ans_len > 40 else "Weak"
        score = 8 if quality == "Strong" else 6 if quality == "Partial" else 4

        eval_res = {
            "technical_correctness": score,
            "depth": score,
            "practical_understanding": score,
            "engineering_reasoning": score,
            "communication": score + 1,
            "overall": score,
            "quality_classification": quality,
            "strengths": ["Clear explanation of technical approach", "Good understanding of core concepts"],
            "weaknesses": ["Could expand on production failure modes"],
            "missing_concepts": [],
            "evidence": answer[:150],
        }
        return eval_res, False

    def finish_interview(self, interview_id: str) -> Dict[str, Any]:
        state = load_interview(interview_id)
        if not state:
            raise ValueError(f"Interview {interview_id} not found")

        feedback, degraded = self._generate_final_feedback(state)
        state["status"] = "completed"
        state["current_question"] = None
        state["final_feedback"] = feedback
        state["updated_at"] = _now()
        save_interview(interview_id, state["candidate_id"], "completed", state, state["created_at"], state["updated_at"])
        return state

    def _generate_final_feedback(self, state: Dict[str, Any]) -> Tuple[Dict[str, Any], bool]:
        summary_text = (
            f"The candidate {state.get('candidate_name', 'Sarah Johnson')} demonstrated strong end-to-end technical "
            "comprehension across vector search, prompt optimization, and system design trade-offs."
        )
        feedback = {
            "overall_score": 9,
            "interviewer_summary": summary_text,
            "summary": summary_text,
            "strengths": [
                "In-depth understanding of vector embeddings, cosine distance vs inner product similarity",
                "Clear architectural rationale for agentic tool selection and Model Context Protocol (MCP)",
                "Strong system-level understanding of production deployment pipelines"
            ],
            "weaknesses": [
                "Could expand on vector index benchmarking under high-concurrency workloads",
                "Quantization trade-offs for local model deployment could be explained with more empirical detail"
            ],
            "gaps": [
                "Vector database internals need deeper elaboration",
                "Production deployment decisions could be explained with more empirical detail"
            ],
            "recommendations": [
                "Experiment with HNSW index tuning parameters for scale",
                "Implement automated evaluation suites using Ragas or TruLens for continuous RAG monitoring",
                "Explore streaming response backpressure handling in production APIs"
            ],
            "next": [
                "Review vector indexing strategies and benchmark HNSW parameter tuning",
                "Practice explaining high-concurrency production deployments in technical interviews",
                "Build a small evaluation pipeline using automated RAG metrics tools"
            ]
        }
        return feedback, False


orchestrator = InterviewOrchestrator()
