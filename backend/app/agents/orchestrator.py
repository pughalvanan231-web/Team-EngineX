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
            "feedback": eval_res.get("evidence", "Candidate answer recorded.")
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
        weak_quality = quality in ("PARTIAL", "WEAK", "INCORRECT")
        followup_depth = state.get("followup_depth", 0)
        should_followup = weak_quality and followup_depth < 2

        if should_followup:
            state["followup_depth"] = followup_depth + 1
            state["followup_depth_current"] = state["followup_depth"]
            state = self._generate_followup_turn(state, current_q, candidate_answer, quality, eval_res.get("missing_concepts", []))
        else:
            state["followup_depth"] = 0
            state["followup_depth_current"] = 0
            state = self._advance(state, welcome=False)

        state["updated_at"] = now
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

        p_queue = state.get("priority_queue", [])
        if p_queue:
            next_p = p_queue[0]
            day_num = next_p["day"]
            topic_title = next_p["topic"]
            p_category = next_p["category"]
            p_reason = next_p["reason"]
            p_attempts = next_p.get("attempts")
        else:
            day_num = 12
            topic_title = "Prompt Engineering Fundamentals"
            p_category = "HIGH_ATTEMPTS"
            p_reason = "Curriculum priority validation."
            p_attempts = 4

        topic_obj = self.get_day(day_num)
        topic_obj["title"] = topic_title

        state["stage"] = stage
        q_item, degraded = self._generate_question(
            profile=state["profile"],
            topic_obj=topic_obj,
            stage=stage,
            q_num=q_num,
            difficulty_index=state.get("difficulty_index", 2),
            is_followup=False,
            followup_label="CORE QUESTION",
            priority_category=p_category,
            priority_reason=p_reason,
            attempts=p_attempts
        )

        state["degraded"] = state.get("degraded", False) or degraded
        self._record_question(state, q_item)

        state["question_number"] = q_item["question_number"]
        state["current_question"] = q_item
        return state

    def _generate_followup_turn(self, state: Dict[str, Any], current_q: Dict[str, Any], answer: str, quality: str, missing: List[str]) -> Dict[str, Any]:
        answered = len(state["answers"])
        if self._should_finish(state, answered):
            return self.finish_interview(state["interview_id"])

        q_num = current_q["question_number"] + 1
        q_item, degraded = self._generate_followup(state, current_q, answer, quality, missing)
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

    def _generate_followup(self, state: Dict[str, Any], current_q: Dict[str, Any], answer: str, quality: str, missing: List[str]) -> Tuple[Dict[str, Any], bool]:
        q_num = current_q["question_number"] + 1
        template = get_prompt_template("followup_generator")
        prompt = template.format(
            topic=current_q.get("topic", "AI Engineering"),
            curriculum_day=current_q.get("day", 8),
            day_title=current_q.get("topic", "AI Engineering"),
            previous_question=current_q.get("question", ""),
            previous_answer=answer,
            quality_classification=quality,
            missing_concepts=", ".join(missing) if missing else "None",
            difficulty=current_q.get("difficulty", "application")
        )
        res, degraded = ai_service.call_ai(prompt, schema_type="followup")

        q_text = res.get("question") if isinstance(res, dict) and res.get("question") else f"Following up on your response regarding {current_q['topic']}, what specific production failure modes or trade-offs would you expect, and how would you mitigate them?"
        label = res.get("followup_label") if isinstance(res, dict) and res.get("followup_label") else "Let's go one level deeper."

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
            "priority_category": current_q.get("priority_category", "FOLLOW_UP"),
            "priority_reason": f"Clarifying conceptual depth following {quality.lower()} response.",
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
