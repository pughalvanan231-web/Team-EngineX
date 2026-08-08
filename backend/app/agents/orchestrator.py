import os
import json
import uuid
import datetime
import hashlib
from typing import Dict, Any, List, Optional, Tuple

from app.config import settings
from app.db.database import save_interview, load_interview
from app.services.provider import ai_service
from app.schemas.schemas import DifficultyLevel

DIFFICULTY_LEVELS = ["fundamentals", "application", "debugging", "architecture", "engineering"]
DIFFICULTY_LABELS = {
    "fundamentals": "Fundamentals",
    "application": "Application",
    "debugging": "Debugging",
    "architecture": "Architecture",
    "engineering": "Engineering Judgment",
}

STAGES = [
    "Introduction & Candidate Overview",
    "High-Priority Focus",
    "Core Technical Assessment",
    "Adaptive Follow-up",
    "System Design & Architecture",
    "Production Readiness",
    "Capstone Evaluation",
]

def _now() -> str:
    return datetime.datetime.now(datetime.timezone.utc).isoformat()

def normalize_hash(text: str) -> str:
    return hashlib.md5(" ".join(text.lower().strip().split()).encode("utf-8")).hexdigest()

def step_difficulty(current_idx: int, direction: int) -> int:
    return max(0, min(len(DIFFICULTY_LEVELS) - 1, current_idx + direction))

def compute_overall(corr: int, depth: int, pract: int, reas: int, comm: int, scale_100: bool = False) -> int:
    raw = 0.30 * corr + 0.20 * depth + 0.20 * pract + 0.15 * reas + 0.15 * comm
    if scale_100:
        return max(10, min(100, int(round(raw * 10))))
    return max(1, min(10, int(round(raw))))

# Data Loaders
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
        return self.day_index.get(day, {"day": day, "title": f"Day {day} Curriculum Topic", "tools": [], "objectives": []})

    def find_candidate(self, candidate_id: str) -> Optional[Dict[str, Any]]:
        self.candidates = load_candidate_data()
        for c in self.candidates:
            c_id = c.get("candidate_id") or c.get("member", {}).get("id") or c.get("id")
            if c_id == candidate_id:
                return c
        return self.candidates[0] if self.candidates else None

    # ---------------------------------------------------------------------------
    # 1. CURRICULUM NORMALIZATION (PASSED, FAILED, SKIPPED, MISSING)
    # ---------------------------------------------------------------------------
    def normalize_curriculum(self, candidate_raw: Dict[str, Any]) -> Dict[str, Any]:
        member = candidate_raw.get("member", candidate_raw)
        missions = candidate_raw.get("missions", candidate_raw.get("completed_missions", []))
        signals = candidate_raw.get("signals", candidate_raw.get("learning_signals", {}))

        mission_map = {m["day"]: m for m in missions if isinstance(m, dict) and "day" in m}

        normalized_days = []
        passed_count = 0
        failed_count = 0
        skipped_count = 0
        missing_count = 0
        total_attempts = 0
        attempt_days_count = 0

        # Syllabus spans 31 days
        for day_num in range(1, 32):
            curriculum_meta = self.get_day(day_num)
            title = curriculum_meta.get("title", f"Day {day_num} Syllabus")
            module_title = self._module_for_day(day_num)

            if day_num in mission_map:
                m = mission_map[day_num]
                is_skipped = m.get("skipped", False)
                is_passed = m.get("passed", True) and not is_skipped
                attempts = m.get("attempts", 1)

                if is_skipped:
                    status = "SKIPPED"
                    skipped_count += 1
                elif is_passed:
                    status = "PASSED"
                    passed_count += 1
                    total_attempts += attempts
                    attempt_days_count += 1
                else:
                    status = "FAILED"
                    failed_count += 1
                    total_attempts += attempts
                    attempt_days_count += 1

                normalized_days.append({
                    "day": day_num,
                    "title": m.get("title") or title,
                    "status": status,
                    "attempts": None if is_skipped else attempts,
                    "module": module_title
                })
            else:
                status = "MISSING"
                missing_count += 1
                normalized_days.append({
                    "day": day_num,
                    "title": title,
                    "status": "MISSING",
                    "attempts": None,
                    "module": module_title
                })

        completed_count = passed_count + failed_count
        avg_attempts = round(total_attempts / max(1, attempt_days_count), 1) if attempt_days_count > 0 else 1.0
        completion_pct = round((completed_count / 31) * 100)
        pass_pct = round((passed_count / max(1, completed_count)) * 100) if completed_count > 0 else 0

        return {
            "candidate_id": member.get("id", member.get("candidate_id", "CAND-001")),
            "name": member.get("name", "Candidate"),
            "role": member.get("jobRole", member.get("role", "AI Engineer")),
            "experience": member.get("yearsExperience", member.get("experience", 4)),
            "education": member.get("education", "Computer Science"),
            "status": member.get("status", "COMPLETED"),
            "stats": {
                "totalDays": 31,
                "completedDays": completed_count,
                "passedDays": passed_count,
                "failedDays": failed_count,
                "skippedDays": skipped_count,
                "missingDays": missing_count,
                "avgAttempts": avg_attempts,
                "completionPct": completion_pct,
                "passPct": pass_pct,
                "commitDays": signals.get("commitDays", completed_count),
                "missionsCompleted": signals.get("missionsCompleted", completed_count),
                "missionsFirstTry": signals.get("missionsFirstTry", passed_count)
            },
            "normalizedDays": normalized_days
        }

    # ---------------------------------------------------------------------------
    # 2. 5-TIER AI PRIORITY ENGINE
    # ---------------------------------------------------------------------------
    def build_interview_priority(self, candidate_raw: Dict[str, Any]) -> List[Dict[str, Any]]:
        norm = self.normalize_curriculum(candidate_raw)
        days = norm["normalizedDays"]
        priority_items = []

        for item in days:
            day_num = item["day"]
            status = item["status"]
            attempts = item["attempts"]
            title = item["title"]

            # Category 1: Explicitly Skipped Topics
            if status == "SKIPPED":
                priority_items.append({
                    "topic": title,
                    "day": day_num,
                    "category": "SKIPPED",
                    "priority": 1,
                    "attempts": None,
                    "reason": "No demonstrated completion evidence; prioritized for baseline validation.",
                    "recommendedDifficulty": "intermediate"
                })
            # Category 2: Highest-Attempt Topics (attempts >= 4)
            elif status in ("PASSED", "FAILED") and attempts is not None and attempts >= 4:
                priority_items.append({
                    "topic": title,
                    "day": day_num,
                    "category": "HIGH_ATTEMPTS",
                    "priority": 2,
                    "attempts": attempts,
                    "reason": f"Highest learning friction requiring {attempts} attempts to complete.",
                    "recommendedDifficulty": "intermediate"
                })
            # Category 3: Medium-Attempt Topics (attempts 2-3)
            elif status in ("PASSED", "FAILED") and attempts is not None and attempts in (2, 3):
                priority_items.append({
                    "topic": title,
                    "day": day_num,
                    "category": "MEDIUM_ATTEMPTS",
                    "priority": 3,
                    "attempts": attempts,
                    "reason": f"Moderate learning friction requiring {attempts} submission attempts.",
                    "recommendedDifficulty": "intermediate"
                })
            # Category 4: Low-Attempt Topics (attempts == 1)
            elif status == "PASSED" and attempts == 1:
                priority_items.append({
                    "topic": title,
                    "day": day_num,
                    "category": "LOW_ATTEMPTS",
                    "priority": 4,
                    "attempts": 1,
                    "reason": "Passed on first try; tested for engineering depth.",
                    "recommendedDifficulty": "advanced"
                })
            # Category 5: Missing Curriculum Days
            elif status == "MISSING":
                priority_items.append({
                    "topic": title,
                    "day": day_num,
                    "category": "MISSING",
                    "priority": 5,
                    "attempts": None,
                    "reason": "Unrecorded curriculum signal; tested for baseline verification.",
                    "recommendedDifficulty": "fundamentals"
                })

        # Sort priority list by category priority (1 to 5), then by day descending for high impact
        priority_items.sort(key=lambda x: (x["priority"], -x["day"]))
        return priority_items

    # Alias & Helper Methods for API and Test Compatibility
    def build_profile(self, candidate_payload: Any) -> Dict[str, Any]:
        if isinstance(candidate_payload, dict):
            return self.normalize_curriculum(candidate_payload)
        if hasattr(candidate_payload, "dict"):
            return self.normalize_curriculum(candidate_payload.dict())
        return self.normalize_curriculum({"member": {"id": str(candidate_payload)}})

    def build_topic_pool(self, candidate_raw: Any) -> List[Dict[str, Any]]:
        cand_dict = candidate_raw if isinstance(candidate_raw, dict) else (candidate_raw.dict() if hasattr(candidate_raw, "dict") else self.find_candidate(str(candidate_raw)))
        return self.build_interview_priority(cand_dict or {})

    def initial_difficulty(self, profile: Dict[str, Any]) -> int:
        exp = profile.get("experience", 4)
        if exp >= 8:
            return 3  # Architecture
        elif exp >= 4:
            return 2  # Application
        return 1      # Fundamentals

    def process_message(self, interview_id: str, candidate_answer: str) -> Dict[str, Any]:
        return self.process_answer(interview_id, candidate_answer)

    # ---------------------------------------------------------------------------
    # 3. INTERVIEW SESSION LIFECYCLE & DYNAMIC RE-RANKING
    # ---------------------------------------------------------------------------
    def start_interview(self, session_or_cand_id: Any, candidate_payload: Any = None, session_id: Optional[str] = None) -> Dict[str, Any]:
        # Handle positional parameter variations: (cand_id, session_id) or (session_id, payload)
        real_session_id = session_id
        cand_raw = None

        if isinstance(session_or_cand_id, str):
            if session_or_cand_id.startswith("int_") or session_or_cand_id.startswith("t-") or session_or_cand_id.startswith("session_"):
                real_session_id = session_or_cand_id
                if candidate_payload:
                    cand_raw = candidate_payload if isinstance(candidate_payload, dict) else (candidate_payload.dict() if hasattr(candidate_payload, "dict") else None)
            else:
                cand_raw = self.find_candidate(session_or_cand_id)

        if not cand_raw and candidate_payload:
            cand_raw = candidate_payload if isinstance(candidate_payload, dict) else (candidate_payload.dict() if hasattr(candidate_payload, "dict") else None)

        if not cand_raw:
            cand_raw = self.candidates[0] if self.candidates else {}

        normalized_profile = self.normalize_curriculum(cand_raw)
        priority_queue = self.build_interview_priority(cand_raw)

        interview_id = real_session_id or f"int_{uuid.uuid4().hex[:12]}"
        initial_diff_idx = self.initial_difficulty(normalized_profile)

        state = {
            "session_id": interview_id,
            "interview_id": interview_id,
            "sessionId": interview_id,
            "candidate_id": normalized_profile["candidate_id"],
            "candidate_name": normalized_profile["name"],
            "job_role": normalized_profile["role"],
            "experience": normalized_profile["experience"],
            "candidate": normalized_profile,
            "profile": normalized_profile,
            "priority_queue": priority_queue,
            "status": "in_progress",
            "question_number": 0,
            "answers": [],
            "evaluations": [],
            "questions_asked": [],
            "questions_hashes": [],
            "question_reviews": [],
            "topics_covered": [],
            "curriculum_days_covered": [],
            "days_covered": [],
            "priority_categories_tested": [],
            "difficulty_index": initial_diff_idx,
            "difficulty": DIFFICULTY_LEVELS[initial_diff_idx],
            "difficulty_label": DIFFICULTY_LABELS[DIFFICULTY_LEVELS[initial_diff_idx]],
            "stage": "Introduction & Candidate Overview",
            "followup_depth": 0,
            "followup_depth_current": 0,
            "strengths": [],
            "weaknesses": [],
            "unresolved": [],
            "final_feedback": None,
            "degraded": False,
            "created_at": _now(),
            "updated_at": _now(),
            # Live mental model — evolves with every answer
            "mental_model": {
                "technologies_mentioned": [],
                "candidate_claims": [],
                "unverified_claims": [],
                "architecture_decisions": [],
                "tradeoffs_discussed": [],
                "interesting_threads": [],
                "strong_areas": [],
                "weak_areas": [],
            },
        }

        state = self._advance(state, welcome=True)
        save_interview(interview_id, normalized_profile["candidate_id"], state["status"], state, state["created_at"], state["updated_at"])
        return state

    def process_answer(self, interview_id: str, candidate_answer: str) -> Dict[str, Any]:
        state = load_interview(interview_id)
        if not state:
            raise ValueError(f"Interview session {interview_id} not found")
        if state.get("status") == "completed":
            return state

        current_q = state["current_question"]
        now = _now()

        # Evaluate Answer
        eval_res, eval_degraded = self._evaluate_answer(current_q, candidate_answer)
        state["degraded"] = state.get("degraded", False) or eval_degraded

        q_review = {
            "question_number": current_q["question_number"],
            "topic": current_q["topic"],
            "day": current_q["day"],
            "priorityCategory": current_q.get("priority_category", "GENERAL"),
            "reason": current_q.get("priority_reason", "Curriculum priority validation."),
            "question": current_q["question"],
            "answer": candidate_answer,
            "evaluation_score": eval_res["overall"],
            "classification": eval_res["quality_classification"],
            "feedback": eval_res.get("evidence", "Candidate answer recorded."),
            # Structured reasoning fields for audit log and follow-up chaining
            "correct_concepts": eval_res.get("correct_concepts", []),
            "incorrect_concepts": eval_res.get("incorrect_concepts", []),
            "mentioned_tradeoffs": eval_res.get("mentioned_tradeoffs", []),
            "missing_tradeoffs": eval_res.get("missing_tradeoffs", []),
            "implementation_evidence": eval_res.get("implementation_evidence", []),
            "recommended_followup_type": eval_res.get("recommended_followup_type", ""),
            "recommended_focus": eval_res.get("recommended_focus", "")
        }
        state.setdefault("question_reviews", []).append(q_review)

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
        state["evaluations"].append(eval_res)

        if eval_res.get("strengths"):
            state.setdefault("strengths", []).extend(eval_res["strengths"])
        if eval_res.get("weaknesses"):
            state.setdefault("weaknesses", []).extend(eval_res["weaknesses"])

        # DYNAMIC RE-RANKING & ADAPTIVE ROUTING
        quality = eval_res.get("quality_classification", "STRONG")
        diff_idx = state.get("difficulty_index", 2)

        if quality in ("EXCEPTIONAL", "STRONG"):
            diff_idx = step_difficulty(diff_idx, +1)
        elif quality in ("WEAK", "INCORRECT"):
            diff_idx = step_difficulty(diff_idx, -1)

        state["difficulty_index"] = diff_idx
        state["difficulty"] = DIFFICULTY_LEVELS[diff_idx]
        state["difficulty_label"] = DIFFICULTY_LABELS[DIFFICULTY_LEVELS[diff_idx]]

        # Re-rank priority queue dynamically
        state = self._rerank_priority_queue(state, eval_res, current_q)

        # Check follow-up logic (max 2 follow-ups per topic)
        # Trigger follow-up for: weak answers (clarify/reteach), partial answers (missing concept),
        # AND strong answers where a richer follow-up type (TRADE_OFF / FAILURE_SCENARIO / ARCHITECTURE) is recommended.
        recommended_type = eval_res.get("recommended_followup_type", "")
        deep_followup_types = ("TRADE_OFF", "FAILURE_SCENARIO", "ARCHITECTURE")
        weak_quality = quality in ("PARTIAL", "WEAK", "INCORRECT")
        depth_followup = quality in ("EXCEPTIONAL", "STRONG") and recommended_type in deep_followup_types
        followup_depth = state.get("followup_depth", 0)
        should_followup = (weak_quality or depth_followup) and followup_depth < 2

        if should_followup:
            state["followup_depth"] = followup_depth + 1
            state["followup_depth_current"] = state["followup_depth"]
            state = self._generate_followup_turn(state, current_q, candidate_answer, quality, eval_res.get("missing_concepts", []), eval_res)
        else:
            state["followup_depth"] = 0
            state["followup_depth_current"] = 0
            state = self._advance(state, welcome=False)

        state["updated_at"] = now

        # Update live mental model with insights from this answer
        self._update_mental_model(state, eval_res, candidate_answer)

        save_interview(interview_id, state["candidate_id"], state["status"], state, state["created_at"], now)
        return state

    def _rerank_priority_queue(self, state: Dict[str, Any], eval_res: Dict[str, Any], current_q: Dict[str, Any]) -> Dict[str, Any]:
        p_queue = state.get("priority_queue", [])
        quality = eval_res.get("quality_classification", "STRONG")
        current_topic = current_q.get("topic")

        remaining = [item for item in p_queue if item["topic"] != current_topic]

        if quality == "EXCEPTIONAL":
            for item in remaining:
                if item["category"] == "LOW_ATTEMPTS":
                    item["priority"] = max(1, item["priority"] - 1)
        elif quality in ("WEAK", "INCORRECT"):
            for item in remaining:
                if item["category"] in ("HIGH_ATTEMPTS", "SKIPPED"):
                    item["priority"] = 1
                    item["reason"] = f"Prioritized following struggles on {current_topic}."

        remaining.sort(key=lambda x: (x["priority"], -x["day"]))
        state["priority_queue"] = remaining
        return state

    def _advance(self, state: Dict[str, Any], welcome: bool) -> Dict[str, Any]:
        answered = len(state["answers"])

        if not welcome and self._should_finish(state, answered):
            return self.finish_interview(state["interview_id"])

        q_num = answered + 1
        stage = self.stage_for(q_num)
        state["stage"] = stage

        # Q1: personalized opening question driven by candidate profile
        if welcome or q_num == 1:
            q_item, degraded = self._generate_opening_question(state)
            q_item["question_number"] = 1
            state["degraded"] = state.get("degraded", False) or degraded
            self._record_question(state, q_item)
            state["question_number"] = q_item["question_number"]
            state["current_question"] = q_item
            return state

        # Q2+: answer-first question generation
        answers = state.get("answers", [])
        evaluations = state.get("evaluations", [])
        latest_answer = answers[-1]["answer"] if answers else ""
        latest_eval = evaluations[-1] if evaluations else {}
        interesting_threads = latest_eval.get("interesting_threads", [])

        # Select the most valuable thread from the latest answer
        selected_thread = self._select_best_thread(state, interesting_threads)

        # Generate an answer-driven question
        q_item, degraded = self._generate_answer_driven_question(
            state, selected_thread, latest_answer, latest_eval, q_num, stage
        )

        state["degraded"] = state.get("degraded", False) or degraded
        self._record_question(state, q_item)
        state["question_number"] = q_item["question_number"]
        state["current_question"] = q_item
        return state

    def _generate_followup_turn(self, state: Dict[str, Any], current_q: Dict[str, Any], answer: str, quality: str, missing: List[str], eval_res: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        answered = len(state["answers"])
        if self._should_finish(state, answered):
            return self.finish_interview(state["interview_id"])

        q_num = current_q["question_number"] + 1
        q_item, degraded = self._generate_followup(state, current_q, answer, quality, missing, eval_res)
        q_item["question_number"] = q_num
        self._record_question(state, q_item)
        state["degraded"] = state.get("degraded", False) or degraded
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

        p_cat = q_item.get("priority_category")
        if p_cat and p_cat not in state.setdefault("priority_categories_tested", []):
            state["priority_categories_tested"].append(p_cat)

    def _should_finish(self, state: Dict[str, Any], answered: int) -> bool:
        days_count = len(state.get("curriculum_days_covered", state.get("days_covered", [])))
        if answered >= 8 and days_count >= 4:
            return True
        return answered >= 10

    def stage_for(self, q_num: int) -> str:
        if q_num <= 2:
            return "Introduction & High-Priority Focus"
        elif q_num <= 4:
            return "Core Technical Assessment"
        elif q_num <= 6:
            return "Adaptive Follow-up"
        elif q_num <= 8:
            return "System Design & Architecture"
        elif q_num <= 10:
            return "Production Readiness"
        return "Capstone Evaluation"

    # ---------------------------------------------------------------------------
    # NEW: ANSWER-FIRST ENGINE HELPERS
    # ---------------------------------------------------------------------------

    def _generate_opening_question(self, state: Dict[str, Any]) -> Tuple[Dict[str, Any], bool]:
        """Generate a personalized, profile-driven opening question (Q1)."""
        profile = state.get("profile", {})
        norm_days = profile.get("normalizedDays", [])
        stats = profile.get("stats", {})

        # Gather high-friction topics (attempts >= 3) for context
        p_queue = state.get("priority_queue", [])
        high_friction = [p["topic"] for p in p_queue if p.get("category") in ("HIGH_ATTEMPTS", "SKIPPED")][:3]
        first_try_passed = [d["title"] for d in norm_days if d.get("status") == "PASSED" and d.get("attempts") == 1][:4]
        skipped = [d["title"] for d in norm_days if d.get("status") == "SKIPPED"][:3]

        # Modules covered
        covered_modules = list({d.get("module", "") for d in norm_days if d.get("status") in ("PASSED", "FAILED")})

        exp = profile.get("experience", 4)
        if exp >= 8:
            opening_difficulty = "architecture"
        elif exp >= 4:
            opening_difficulty = "application"
        else:
            opening_difficulty = "fundamentals"

        template = get_prompt_template("opening_question")
        prompt = template.format(
            candidate_name=profile.get("name", "Candidate"),
            candidate_role=profile.get("role", "AI Engineer"),
            candidate_experience=exp,
            candidate_education=profile.get("education", "Computer Science"),
            days_completed=stats.get("completedDays", 0),
            pass_rate=stats.get("passPct", 0),
            high_friction_topics=", ".join(high_friction) if high_friction else "None identified",
            skipped_topics=", ".join(skipped) if skipped else "None",
            first_try_count=stats.get("missionsFirstTry", 0),
            modules_covered=", ".join(covered_modules) if covered_modules else "Foundation AI Engineering",
            opening_difficulty=opening_difficulty,
        )

        res, degraded = ai_service.call_ai(prompt, schema_type="opening")

        fallback_q = (
            f"You've worked through {', '.join(covered_modules[:2]) if covered_modules else 'AI engineering fundamentals'} "
            f"during the cohort. Walk me through a system you built that you're most confident defending technically "
            f"— focus on the key architectural decisions and trade-offs."
        )
        q_text = res.get("question") if isinstance(res, dict) and res.get("question") else fallback_q

        # Identify a starting curriculum day from the priority queue
        p_queue = state.get("priority_queue", [])
        starting_day = p_queue[0]["day"] if p_queue else 1
        starting_topic = p_queue[0]["topic"] if p_queue else "Introduction & Technical Overview"

        q_item = {
            "question_number": 1,
            "question": q_text,
            "topic": starting_topic,
            "curriculum_day": starting_day,
            "day": starting_day,
            "module": self._module_for_day(starting_day),
            "difficulty": opening_difficulty,
            "is_follow_up": False,
            "followup_label": "OPENING QUESTION",
            "priority_category": p_queue[0].get("category", "GENERAL") if p_queue else "GENERAL",
            "priority_reason": "Personalized opening based on candidate learning profile.",
            "attempts": p_queue[0].get("attempts") if p_queue else None,
        }
        return q_item, degraded

    def _select_best_thread(
        self,
        state: Dict[str, Any],
        interesting_threads: List[Dict[str, Any]]
    ) -> Dict[str, Any]:
        """Select the highest-value thread from the answer, biasing toward uncovered curriculum areas."""
        days_covered_count = len(state.get("curriculum_days_covered", state.get("days_covered", [])))
        answered = len(state.get("answers", []))
        topics_covered = set(state.get("topics_covered", []))
        q_hashes = set(state.get("questions_hashes", []))

        # Coverage still needed — prefer threads that map to uncovered curriculum areas
        needs_more_coverage = days_covered_count < 4 or answered < 8

        # Filter out threads whose question_seed is essentially a duplicate
        valid_threads = []
        for t in interesting_threads:
            if isinstance(t, dict) and t.get("hook") and t.get("question_seed"):
                seed_hash = normalize_hash(t["question_seed"])
                if seed_hash not in q_hashes:
                    valid_threads.append(t)

        if not valid_threads:
            # No valid threads — fall back to priority queue top
            p_queue = state.get("priority_queue", [])
            if p_queue:
                top = p_queue[0]
                return {
                    "hook": top["topic"],
                    "direction": "missing_concept",
                    "question_seed": f"How would you approach {top['topic']} in a production system?",
                    "curriculum_area": top["topic"],
                    "curriculum_day": top["day"],
                    "source": "priority_queue_fallback"
                }
            return {
                "hook": "your previous answer",
                "direction": "trade_off",
                "question_seed": "What trade-offs would you consider in a production deployment of this system?",
                "curriculum_area": "production readiness",
                "curriculum_day": 26,
                "source": "default_fallback"
            }

        if needs_more_coverage:
            # Prefer threads that cover a NEW curriculum area
            p_queue = state.get("priority_queue", [])
            uncovered_areas = {p["topic"].lower() for p in p_queue}
            for thread in valid_threads:
                area = thread.get("curriculum_area", "").lower()
                if any(area in uc or uc in area for uc in uncovered_areas):
                    # Map this thread to its curriculum day
                    thread = dict(thread)
                    if not thread.get("curriculum_day") and p_queue:
                        for p in p_queue:
                            if p["topic"].lower() in area or area in p["topic"].lower():
                                thread["curriculum_day"] = p["day"]
                                break
                        if not thread.get("curriculum_day"):
                            thread["curriculum_day"] = p_queue[0]["day"]
                    thread["source"] = "answer_thread_coverage"
                    return thread

        # Return the first valid thread (already ranked by evaluator)
        best = dict(valid_threads[0])
        if not best.get("curriculum_day"):
            p_queue = state.get("priority_queue", [])
            best["curriculum_day"] = p_queue[0]["day"] if p_queue else 8
        best["source"] = "answer_thread_primary"
        return best

    def _update_mental_model(self, state: Dict[str, Any], eval_res: Dict[str, Any], answer: str) -> None:
        """Evolve the live mental model with insights from the latest evaluated answer."""
        mm = state.setdefault("mental_model", {
            "technologies_mentioned": [], "candidate_claims": [], "unverified_claims": [],
            "architecture_decisions": [], "tradeoffs_discussed": [], "interesting_threads": [],
            "strong_areas": [], "weak_areas": []
        })

        quality = eval_res.get("quality_classification", "STRONG")
        topic = ""
        if state.get("answers"):
            topic = state["answers"][-1].get("topic", "")

        # Accumulate evidence
        for item in eval_res.get("implementation_evidence", []):
            if item and item not in mm["technologies_mentioned"]:
                mm["technologies_mentioned"].append(item)
        for item in eval_res.get("correct_concepts", []):
            if item and item not in mm["candidate_claims"]:
                mm["candidate_claims"].append(item)
        for item in eval_res.get("incorrect_concepts", []):
            if item and item not in mm["unverified_claims"]:
                mm["unverified_claims"].append(item)
        for item in eval_res.get("mentioned_tradeoffs", []):
            if item and item not in mm["tradeoffs_discussed"]:
                mm["tradeoffs_discussed"].append(item)

        # Track strong/weak topic areas
        if quality in ("EXCEPTIONAL", "STRONG") and topic and topic not in mm["strong_areas"]:
            mm["strong_areas"].append(topic)
        elif quality in ("WEAK", "INCORRECT") and topic and topic not in mm["weak_areas"]:
            mm["weak_areas"].append(topic)

        # Store the latest interesting threads for _advance()
        new_threads = eval_res.get("interesting_threads", [])
        if new_threads:
            mm["interesting_threads"] = new_threads  # always use the freshest threads

    def _generate_answer_driven_question(
        self,
        state: Dict[str, Any],
        selected_thread: Dict[str, Any],
        latest_answer: str,
        latest_eval: Dict[str, Any],
        q_num: int,
        stage: str
    ) -> Tuple[Dict[str, Any], bool]:
        """Generate the next question using the candidate's answer as the primary input."""
        profile = state.get("profile", {})
        diff_idx = state.get("difficulty_index", 2)
        diff = DIFFICULTY_LEVELS[diff_idx]

        # Build conversation history (last 3 Q&A pairs)
        answers = state.get("answers", [])
        questions_asked = state.get("questions_asked", [])
        history_lines = []
        for i, ans_rec in enumerate(answers[-3:]):
            q_text = ans_rec.get("question", "")
            a_text = ans_rec.get("answer", "")
            history_lines.append(f"Q: {q_text}")
            history_lines.append(f"A: {a_text[:300]}{'...' if len(a_text) > 300 else ''}")
        conversation_history = "\n".join(history_lines) if history_lines else "(This is an early stage of the interview.)"

        # Previous questions summary for deduplication
        prev_qs = [q["question"] if isinstance(q, dict) else q for q in questions_asked]
        prev_summary = "\n".join([f"- {q}" for q in prev_qs[-8:]]) if prev_qs else "None"

        # Curriculum context for the selected thread
        curriculum_day = selected_thread.get("curriculum_day", 8)
        topic_obj = self.get_day(curriculum_day)

        def _fmt(lst): return ", ".join(lst) if lst else "None"

        template = get_prompt_template("question_generator")
        prompt = template.format(
            candidate_name=profile.get("name", "Candidate"),
            candidate_role=profile.get("role", "AI Engineer"),
            candidate_experience=profile.get("experience", state.get("experience", 4)),
            conversation_history=conversation_history,
            latest_answer=latest_answer,
            quality_classification=latest_eval.get("quality_classification", "STRONG"),
            correct_concepts=_fmt(latest_eval.get("correct_concepts", [])),
            incorrect_concepts=_fmt(latest_eval.get("incorrect_concepts", [])),
            mentioned_tradeoffs=_fmt(latest_eval.get("mentioned_tradeoffs", [])),
            missing_tradeoffs=_fmt(latest_eval.get("missing_tradeoffs", [])),
            implementation_evidence=_fmt(latest_eval.get("implementation_evidence", [])),
            thread_hook=selected_thread.get("hook", "your previous answer"),
            thread_direction=selected_thread.get("direction", "trade_off"),
            thread_focus=selected_thread.get("question_seed", latest_eval.get("recommended_focus", "production trade-offs")),
            thread_curriculum_area=selected_thread.get("curriculum_area", topic_obj.get("title", "AI Engineering")),
            curriculum_area=topic_obj.get("title", f"Day {curriculum_day}"),
            curriculum_day=curriculum_day,
            day_title=topic_obj.get("title", f"Day {curriculum_day}"),
            objectives="\n".join(topic_obj.get("objectives", ["Master AI engineering concepts"])),
            tools=", ".join(topic_obj.get("tools", ["Python"])),
            topics_already_covered=", ".join(state.get("topics_covered", ["None"])),
            days_covered_count=len(state.get("curriculum_days_covered", state.get("days_covered", []))),
            difficulty=diff,
            previous_questions_summary=prev_summary,
        )

        res, degraded = ai_service.call_ai(prompt, schema_type="question")

        # Fallback: reference the thread hook directly
        fallback_q = (
            f"You mentioned {selected_thread['hook']} — {selected_thread.get('question_seed', 'can you walk through the key trade-offs that decision introduced?')}"
            if selected_thread.get("hook") and selected_thread["hook"] != "your previous answer"
            else f"Let's go deeper on {topic_obj.get('title', 'that topic')} — how would you evaluate the trade-offs of your approach in a production system?"
        )

        q_text = res.get("question") if isinstance(res, dict) and res.get("question") else fallback_q

        # Pop the matched curriculum area from the priority queue if it was covered
        p_queue = state.get("priority_queue", [])
        matched_day = curriculum_day
        state["priority_queue"] = [p for p in p_queue if p["day"] != matched_day]

        q_item = {
            "question_number": q_num,
            "question": q_text,
            "topic": selected_thread.get("curriculum_area", topic_obj.get("title", "AI Engineering")),
            "curriculum_day": curriculum_day,
            "day": curriculum_day,
            "module": self._module_for_day(curriculum_day),
            "difficulty": diff,
            "is_follow_up": False,
            "followup_label": "CORE QUESTION",
            "priority_category": "ANSWER_DRIVEN",
            "priority_reason": f"Thread: '{selected_thread.get('hook', 'answer')}' → {selected_thread.get('direction', 'investigate')}",
            "thread_hook": selected_thread.get("hook", ""),
            "thread_source": selected_thread.get("source", "answer_thread"),
            "attempts": None,
            "generation_rationale": res.get("generation_rationale", "") if isinstance(res, dict) else "",
        }
        return q_item, degraded

    def _generate_question(self, profile: Dict[str, Any], topic_obj: Dict[str, Any], stage: str, q_num: int,
                           difficulty_index: int, is_followup: bool, followup_label: Optional[str],
                           priority_category: str = "GENERAL", priority_reason: str = "", attempts: Optional[int] = None) -> Tuple[Dict[str, Any], bool]:
        diff = DIFFICULTY_LEVELS[difficulty_index]
        day_num = topic_obj.get("day", 8)
        topic_title = topic_obj.get("title") or topic_obj.get("topic", f"Day {day_num}")

        template = get_prompt_template("question_generator")
        prev_qs = [q["question"] if isinstance(q, dict) else q for q in profile.get("questions_asked", [])]
        prev_summary = "\n".join([f"- {q}" for q in prev_qs]) if prev_qs else "None"

        prompt = template.format(
            candidate_name=profile.get("name", "Candidate"),
            candidate_role=profile.get("role", "Software Engineer"),
            candidate_experience=profile.get("experience", 4),
            topic=topic_title,
            curriculum_day=day_num,
            day_title=topic_title,
            module=self._module_for_day(day_num),
            objectives="\n".join(topic_obj.get("objectives", [f"Master {topic_title}"])),
            tools=", ".join(topic_obj.get("tools", ["Python"])),
            difficulty=diff,
            interview_stage=stage,
            previous_questions_summary=prev_summary
        )

        res, degraded = ai_service.call_ai(prompt, schema_type="question")
        q_text = res.get("question") if isinstance(res, dict) and res.get("question") else f"In Day {day_num} of your cohort ({topic_title}), walk me through how you implemented your approach, and explain the main engineering trade-offs."

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
            "priority_category": priority_category,
            "priority_reason": priority_reason or "Curriculum topic priority evaluation.",
            "attempts": attempts
        }
        return q_item, degraded

    def _evaluate_answer(self, q_item: Dict[str, Any], answer: str) -> Tuple[Dict[str, Any], bool]:
        template = get_prompt_template("answer_evaluator")
        prompt = template.format(
            question=q_item.get("question", ""),
            topic=q_item.get("topic", "AI Engineering"),
            curriculum_day=q_item.get("day", 8),
            difficulty=q_item.get("difficulty", "application"),
            candidate_answer=answer
        )
        res, degraded = ai_service.call_ai(prompt, schema_type="evaluation")

        if isinstance(res, dict) and "technical_correctness" in res:
            tc = res.get("technical_correctness", 7)
            dp = res.get("depth", 7)
            pu = res.get("practical_understanding", 7)
            er = res.get("engineering_reasoning", 7)
            cm = res.get("communication", 7)

            if tc > 10: tc = max(1, min(10, int(round(tc / 10))))
            if dp > 10: dp = max(1, min(10, int(round(dp / 10))))
            if pu > 10: pu = max(1, min(10, int(round(pu / 10))))
            if er > 10: er = max(1, min(10, int(round(er / 10))))
            if cm > 10: cm = max(1, min(10, int(round(cm / 10))))

            overall = compute_overall(tc, dp, pu, er, cm)
            quality = str(res.get("quality_classification", "Strong")).upper()
            if quality not in ("EXCEPTIONAL", "STRONG", "PARTIAL", "WEAK", "INCORRECT"):
                quality = "STRONG"

            eval_res = {
                "technical_correctness": tc,
                "depth": dp,
                "practical_understanding": pu,
                "engineering_reasoning": er,
                "communication": cm,
                "overall": overall,
                "quality_classification": quality,
                "strengths": res.get("strengths", ["Clear explanation of technical concepts"]),
                "weaknesses": res.get("weaknesses", ["Could discuss production edge-cases"]),
                "missing_concepts": res.get("missing_concepts", []),
                "evidence": res.get("evidence", answer[:150])
            }
            return eval_res, degraded

        ans_len = len(answer.strip())
        if ans_len > 140:
            quality = "EXCEPTIONAL"
            score = 9
        elif ans_len > 80:
            quality = "STRONG"
            score = 8
        elif ans_len > 40:
            quality = "PARTIAL"
            score = 6
        elif ans_len > 15:
            quality = "WEAK"
            score = 4
        else:
            quality = "INCORRECT"
            score = 3

        overall = compute_overall(score, score, score, score, min(10, score + 1))
        eval_res = {
            "technical_correctness": score,
            "depth": score,
            "practical_understanding": score,
            "engineering_reasoning": score,
            "communication": min(10, score + 1),
            "overall": overall,
            "quality_classification": quality,
            "strengths": ["Clear technical communication", "Good understanding of core concepts"],
            "weaknesses": ["Could expand on edge cases under high load"],
            "missing_concepts": [],
            "evidence": answer[:150]
        }
        return eval_res, True

    def _generate_followup(self, state: Dict[str, Any], current_q: Dict[str, Any], answer: str, quality: str, missing: List[str], eval_res: Optional[Dict[str, Any]] = None) -> Tuple[Dict[str, Any], bool]:
        """Generate a targeted follow-up question using the full structured evaluation result."""
        q_num = current_q["question_number"] + 1
        ev = eval_res or {}
        profile = state.get("profile", {})

        # Extract all structured evaluation fields
        correct_concepts = ev.get("correct_concepts", [])
        incorrect_concepts = ev.get("incorrect_concepts", [])
        mentioned_tradeoffs = ev.get("mentioned_tradeoffs", [])
        missing_tradeoffs = ev.get("missing_tradeoffs", [])
        implementation_evidence = ev.get("implementation_evidence", [])
        recommended_type = ev.get("recommended_followup_type", "MISSING_CONCEPT")
        recommended_focus = ev.get("recommended_focus", missing[0] if missing else "production trade-offs")

        def _fmt(lst) -> str:
            return ", ".join(lst) if lst else "None"

        template = get_prompt_template("followup_generator")
        prompt = template.format(
            topic=current_q.get("topic", "AI Engineering"),
            curriculum_day=current_q.get("day", 8),
            day_title=current_q.get("topic", "AI Engineering"),
            candidate_experience=profile.get("experience", state.get("experience", 4)),
            candidate_role=profile.get("role", state.get("job_role", "AI Engineer")),
            previous_question=current_q.get("question", ""),
            previous_answer=answer,
            quality_classification=quality,
            correct_concepts=_fmt(correct_concepts),
            incorrect_concepts=_fmt(incorrect_concepts),
            mentioned_tradeoffs=_fmt(mentioned_tradeoffs),
            missing_tradeoffs=_fmt(missing_tradeoffs),
            implementation_evidence=_fmt(implementation_evidence),
            missing_concepts=_fmt(missing),
            recommended_followup_type=recommended_type,
            recommended_focus=recommended_focus,
            difficulty=current_q.get("difficulty", "application")
        )
        res, degraded = ai_service.call_ai(prompt, schema_type="followup")

        # Fallback question references the recommended_focus for specificity
        fallback_q = (
            f"You mentioned {correct_concepts[0]} — what specific trade-offs or failure scenarios would you consider "
            f"when deploying that in a production environment?"
        ) if correct_concepts else (
            f"Regarding {current_q['topic']}: {recommended_focus}. How would you approach this in a real system?"
        )

        q_text = res.get("question") if isinstance(res, dict) and res.get("question") else fallback_q
        label = res.get("followup_label") if isinstance(res, dict) and res.get("followup_label") else "Let's go one level deeper."
        followup_type = res.get("followup_type") if isinstance(res, dict) and res.get("followup_type") else recommended_type

        q_item = {
            "question_number": q_num,
            "question": q_text,
            "topic": current_q["topic"],
            "curriculum_day": current_q.get("day", 8),
            "day": current_q.get("day", 8),
            "module": self._module_for_day(current_q.get("day", 8)),
            "difficulty": DIFFICULTY_LEVELS[state.get("difficulty_index", 2)],
            "is_follow_up": True,
            "followup_label": label,
            "followup_type": followup_type,
            "priority_category": current_q.get("priority_category", "FOLLOW_UP"),
            "priority_reason": f"{followup_type}: targeting '{recommended_focus}' following {quality.lower()} response.",
            "attempts": current_q.get("attempts")
        }
        return q_item, degraded

    # ---------------------------------------------------------------------------
    # 4. INTERVIEW COMPLETION & FINAL RESULT GENERATION
    # ---------------------------------------------------------------------------
    def finish_interview(self, interview_id: str) -> Dict[str, Any]:
        state = load_interview(interview_id)
        if not state:
            raise ValueError(f"Interview {interview_id} not found")

        feedback, degraded = self._generate_final_feedback(state)
        state["status"] = "completed"
        state["current_question"] = None
        state["final_feedback"] = feedback
        state["final_result"] = feedback
        state["feedback"] = feedback
        state["updated_at"] = _now()

        save_interview(interview_id, state["candidate_id"], "completed", state, state["created_at"], state["updated_at"])
        return state

    def _generate_final_feedback(self, state: Dict[str, Any]) -> Tuple[Dict[str, Any], bool]:
        answers = state.get("answers", [])
        evals = state.get("evaluations", [])

        corr_avg = sum(e.get("technical_correctness", 8) for e in evals) / max(1, len(evals))
        depth_avg = sum(e.get("depth", 8) for e in evals) / max(1, len(evals))
        pract_avg = sum(e.get("practical_understanding", 8) for e in evals) / max(1, len(evals))
        reas_avg = sum(e.get("engineering_reasoning", 8) for e in evals) / max(1, len(evals))
        comm_avg = sum(e.get("communication", 8) for e in evals) / max(1, len(evals))

        # Formula: Overall = 0.30*Correctness + 0.20*Depth + 0.20*Practical + 0.15*Reasoning + 0.15*Communication
        overall_raw = 0.30 * corr_avg + 0.20 * depth_avg + 0.20 * pract_avg + 0.15 * reas_avg + 0.15 * comm_avg
        overall_score = max(10, min(100, int(round(overall_raw * 10))))

        if overall_score >= 88:
            label = "Exceptional Candidate"
            rec_status = "Recommended"
            rec_text = "Candidate demonstrates outstanding practical and architectural engineering mastery across AI infrastructure."
        elif overall_score >= 76:
            label = "Strong Candidate"
            rec_status = "Recommended"
            rec_text = "Candidate demonstrates solid technical depth and clear engineering communication with good adaptability across AI infrastructure."
        elif overall_score >= 65:
            label = "Moderate Candidate"
            rec_status = "Consider with Reservations"
            rec_text = "Candidate demonstrates good foundational knowledge but requires additional validation in production deployment and advanced AI orchestration."
        elif overall_score >= 50:
            label = "Needs Improvement"
            rec_status = "Consider with Reservations"
            rec_text = "Candidate struggled in several core areas and would benefit from guided practical experience."
        else:
            label = "Insufficient Evidence"
            rec_status = "Further Evaluation Recommended"
            rec_text = "The interview produced insufficient evidence across high-priority topics."

        category_scores_map = {
            "Technical Correctness": int(round(corr_avg * 10)),
            "Conceptual Depth": int(round(depth_avg * 10)),
            "Practical Understanding": int(round(pract_avg * 10)),
            "Engineering Reasoning": int(round(reas_avg * 10)),
            "Communication": int(round(comm_avg * 10))
        }

        # Analyze skipped & missing topics for explicit section
        profile = state.get("profile", {})
        norm_days = profile.get("normalizedDays", [])

        skipped_analysis = [
            {
                "topic": item["title"],
                "day": item["day"],
                "note": "These areas had limited prior learning evidence and were therefore prioritized for interview validation."
            }
            for item in norm_days if item.get("status") == "SKIPPED"
        ]

        missing_analysis = [
            {
                "topic": item["title"],
                "day": item["day"],
                "note": "These curriculum days were unrecorded in the candidate's learning log and were prioritized as baseline verification signals."
            }
            for item in norm_days if item.get("status") == "MISSING"
        ]

        all_strengths = []
        all_weaknesses = []
        for e in evals:
            if isinstance(e, dict):
                all_strengths.extend(e.get("strengths", []))
                all_weaknesses.extend(e.get("weaknesses", []))

        unique_strengths = list(dict.fromkeys(all_strengths)) if all_strengths else [
            "Strong API and backend architecture comprehension",
            "Clear technical communication and structured reasoning",
            "Solid practical understanding of vector embeddings & retrieval"
        ]
        unique_weaknesses = list(dict.fromkeys(all_weaknesses)) if all_weaknesses else [
            "Could elaborate more on edge-case concurrency under heavy load",
            "Vector index tuning parameters can be explored in deeper detail"
        ]

        rec_steps = [
            "Review vector indexing strategies and benchmark HNSW parameter tuning",
            "Practice explaining high-concurrency production deployments",
            "Explore streaming response backpressure handling in production APIs"
        ]

        final_output = {
            "sessionId": state["interview_id"],
            "candidateId": state["candidate_id"],
            "candidateName": state.get("candidate_name", "Candidate"),
            "jobRole": state.get("job_role", "AI Engineer"),
            "overallScore": overall_score,
            "overall_score": overall_score,
            "performanceLabel": label,
            "summary": rec_text,
            "interviewer_summary": f"{state.get('candidate_name', 'The candidate')} was evaluated across {len(answers)} technical topics with an overall score of {overall_score}/100.",
            "categoryScores": category_scores_map,
            "category_scores": [
                {"category": "Technical Understanding", "score": category_scores_map["Technical Correctness"]},
                {"category": "System Design", "score": category_scores_map["Conceptual Depth"]},
                {"category": "Practical Knowledge", "score": category_scores_map["Practical Understanding"]},
                {"category": "Communication", "score": category_scores_map["Communication"]}
            ],
            "strengths": unique_strengths[:4],
            "weaknesses": unique_weaknesses[:4],
            "gaps": unique_weaknesses[:4],
            "next": rec_steps,
            "recommendations": rec_steps,
            "knowledgeGaps": [
                "Kubernetes deployment strategies",
                "Advanced retrieval optimization",
                "Multi-agent failure handling & circuit breaking"
            ],
            "skippedTopicsAnalysis": skipped_analysis,
            "missingSignalsAnalysis": missing_analysis,
            "questionReviews": state.get("question_reviews", []),
            "hiringRecommendation": {
                "status": rec_status,
                "summary": rec_text
            }
        }
        return final_output, False

orchestrator = InterviewOrchestrator()
