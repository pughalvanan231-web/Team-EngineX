import os
import json
import uuid
import datetime
import hashlib
from typing import Dict, Any, List, Optional, Tuple

from app.config import settings
from app.db.database import save_interview, load_interview
from app.services.provider import ai_service
from app.schemas.schemas import CandidatePayload

<<<<<<< HEAD
# Load Curriculum & Candidate Datasets
def load_curriculum_data() -> Dict[str, Any]:
    root_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "..", "curriculum.json"))
    if os.path.exists(root_path):
        with open(root_path, "r", encoding="utf-8") as f:
            return json.load(f)
    path = os.path.join(os.path.dirname(__file__), "..", "data", "curriculum.json")
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)

def load_candidate_data() -> List[Dict[str, Any]]:
    root_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "..", "candidates.json"))
    if os.path.exists(root_path):
        with open(root_path, "r", encoding="utf-8") as f:
            raw = json.load(f)
            if isinstance(raw, dict) and "candidates" in raw:
                return raw["candidates"]
            elif isinstance(raw, list):
                return raw
    path = os.path.join(os.path.dirname(__file__), "..", "data", "candidates.json")
    with open(path, "r", encoding="utf-8") as f:
        raw = json.load(f)
        if isinstance(raw, dict) and "candidates" in raw:
            return raw["candidates"]
        return raw if isinstance(raw, list) else []

def get_prompt_template(name: str) -> str:
    path = os.path.join(os.path.dirname(__file__), "..", "prompts", f"{name}.txt")
    with open(path, "r", encoding="utf-8") as f:
        return f.read()

DIFFICULTY_STEPS = [
    DifficultyLevel.BEGINNER,
    DifficultyLevel.INTERMEDIATE,
    DifficultyLevel.ADVANCED,
    DifficultyLevel.EXPERT
=======
# Difficulty system: 5 levels per spec section 9
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
>>>>>>> ef5acd71c8e8fed613b3c93946e4dab1962db1e8
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
    return os.path.join(os.path.dirname(__file__), "..", "data", name)


def load_curriculum_data() -> Dict[str, Any]:
    with open(_data_path("curriculum.json"), "r", encoding="utf-8") as f:
        return json.load(f)


def load_candidate_data() -> List[Dict[str, Any]]:
    with open(_data_path("candidates.json"), "r", encoding="utf-8") as f:
        return json.load(f).get("candidates", [])


def get_prompt_template(name: str) -> str:
    with open(os.path.join(os.path.dirname(__file__), "..", "prompts", f"{name}.txt"), "r", encoding="utf-8") as f:
        return f.read()


class InterviewOrchestrator:
    def __init__(self):
        self.curriculum = load_curriculum_data()
        self.days = self.curriculum.get("days", [])
        self.modules = self.curriculum.get("modules", [])
        self.candidates = load_candidate_data()
        self.day_index = {d["day"]: d for d in self.days}

<<<<<<< HEAD
    def get_candidate(self, candidate_id: str) -> Optional[Dict[str, Any]]:
        self.candidates = load_candidate_data()
        for cand in self.candidates:
            c_id = cand.get("candidate_id") or cand.get("member", {}).get("id") or cand.get("id")
            if c_id == candidate_id:
                return cand
        return self.candidates[0] if self.candidates else None
=======
    # ------------------------------------------------------------------ utils
    def _module_for_day(self, day: int) -> str:
        day = int(day)
        for mod in self.modules:
            lo, hi = mod["days"]
            if lo <= day <= hi:
                return mod["title"]
        return "AI Engineering"
>>>>>>> ef5acd71c8e8fed613b3c93946e4dab1962db1e8

    def get_day(self, day: int) -> Dict[str, Any]:
        day = int(day)
        return self.day_index.get(day, {"day": day, "title": f"Day {day}", "tools": [], "objectives": []})

<<<<<<< HEAD
        c_id = cand.get("candidate_id") or cand.get("member", {}).get("id") or candidate_id
        c_name = cand.get("name") or cand.get("member", {}).get("name", "Candidate")

        interview_id = f"int_{uuid.uuid4().hex[:12]}"
        now = datetime.datetime.utcnow().isoformat()
=======
    def find_candidate(self, candidate_id: str) -> Optional[Dict[str, Any]]:
        for c in self.candidates:
            if c.get("member", {}).get("id") == candidate_id:
                return c
        return None
>>>>>>> ef5acd71c8e8fed613b3c93946e4dab1962db1e8

    # ------------------------------------------------------- profile building
    def build_profile(self, payload: Optional[CandidatePayload]) -> Dict[str, Any]:
        cand_id = payload.candidate_id if payload else ""
        raw = self.find_candidate(cand_id) if cand_id else None
        override = None

<<<<<<< HEAD
        # Pick initial topic from completed days
        completed_days = cand.get("completed_days")
        if completed_days is None and "missions" in cand:
            completed_days = [m["day"] for m in cand["missions"] if m.get("passed")]
        if not completed_days:
            completed_days = [1, 4, 6, 8, 12]

        initial_topic_obj = self._select_next_topic(completed_days, [], [])

        # Generate Question 1
        q_item, degraded = self._generate_question(
            candidate_name=c_name,
            topic_obj=initial_topic_obj,
            difficulty=initial_difficulty,
            stage="Warm-up & Fundamentals",
            previous_questions=[],
            is_followup=False
        )

        state = {
            "candidate_id": c_id,
            "candidate_name": c_name,
            "interview_id": interview_id,
            "current_question": q_item,

            "question_number": 1,
            "questions_asked": [q_item],
            "questions_asked_hashes": [normalize_hash(q_item["question"])],
            "topics_covered": [q_item["topic"]],
            "curriculum_days_covered": [q_item["curriculum_day"]],
=======
        if raw:
            member = raw["member"]
            missions = raw.get("missions", [])
            signals = raw.get("signals", {})
            if payload and payload.name:
                override = payload
        elif payload and payload.name:
            member = payload
            missions = payload.missions
            signals = payload.signals
        else:
            raw = self.candidates[0]
            member = raw["member"]
            missions = raw.get("missions", [])
            signals = raw.get("signals", {})

        def field(payload_attr: str, data_key: str, fallback):
            if override is not None:
                val = getattr(override, payload_attr, None)
                if val:
                    return val
            return member.get(data_key, fallback)

        completed = [m for m in missions if m.get("passed", True) and not m.get("skipped", False)]
        failed = [m for m in missions if not m.get("passed", True)]
        skipped = [m for m in missions if m.get("skipped", False)]

        profile = {
            "candidate_id": field("candidate_id", "id", "CAND-UNKNOWN"),
            "name": field("name", "name", "Candidate"),
            "role": field("role", "jobRole", "Candidate"),
            "experience": field("experience", "yearsExperience", 0),
            "education": field("education", "education", ""),
            "status": field("status", "status", "COMPLETED"),
            "completed_days": sorted({m.get("day") for m in completed}),
            "failed_days": sorted({m.get("day") for m in failed}),
            "skipped_days": sorted({m.get("day") for m in skipped}),
            "attempt_map": {m.get("day"): m.get("attempts", 1) for m in completed},
            "signals": {
                "commitDays": signals.get("commitDays", 0),
                "missionsCompleted": signals.get("missionsCompleted", 0),
                "missionsFirstTry": signals.get("missionsFirstTry", 0),
            },
        }
        return profile

    # ------------------------------------------------------- initial difficulty
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
        if len(profile["failed_days"]) == 0 and ratio >= 0.9:
            idx += 1

        return max(0, min(len(DIFFICULTY_LEVELS) - 1, idx))

    # ------------------------------------------------------- topic planning
    def build_topic_pool(self, profile: Dict[str, Any]) -> List[Dict[str, Any]]:
        pool: List[Dict[str, Any]] = []
        seen = set()

        def add(day_num: int):
            day_num = int(day_num)
            if day_num in seen:
                return
            seen.add(day_num)
            pool.append(self.get_day(day_num))

        # 1. failed days first -> probe fundamentals
        for d in profile["failed_days"]:
            add(d)
        # 2. high-attempt passed days (struggled)
        for d in sorted(profile["attempt_map"], key=lambda x: profile["attempt_map"][x], reverse=True):
            if profile["attempt_map"][d] >= 3:
                add(d)
        # 3. remaining completed days
        for d in profile["completed_days"]:
            add(d)

        # 4. role-relevant modules (Agents/MCP, Production, RAG) for depth questions
        preferred = [21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 10, 11, 12, 15, 18, 20]
        for d in preferred:
            if int(d) in {int(x) for x in profile["completed_days"]} or int(d) in {int(x) for x in profile["failed_days"]}:
                add(d)

        # 5. fall back to any curriculum day to guarantee >= 4 distinct days
        for d in self.days:
            add(d["day"])

        return pool

    def next_topic(self, profile: Dict[str, Any], covered_days: List[int], covered_topics: List[str]) -> Dict[str, Any]:
        pool = self.build_topic_pool(profile)
        covered = {int(d) for d in covered_days}
        for day_obj in pool:
            if int(day_obj["day"]) not in covered:
                return day_obj
        # fully covered -> still cycle but avoid repeating exact topic
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

    # ------------------------------------------------------- session lifecycle
    def start_interview(self, session_id: str, candidate: Optional[CandidatePayload]) -> Dict[str, Any]:
        profile = self.build_profile(candidate)
        diff_idx = self.initial_difficulty(profile)

        state = {
            "session_id": session_id,
            "candidate": profile,
            "status": "in_progress",
            "question_number": 0,
>>>>>>> ef5acd71c8e8fed613b3c93946e4dab1962db1e8
            "answers": [],
            "evaluations": [],
            "questions_asked": [],
            "questions_hashes": [],
            "topics_covered": [],
            "days_covered": [],
            "difficulty_index": diff_idx,
            "difficulty_label": DIFFICULTY_LABELS[DIFFICULTY_LEVELS[diff_idx]],
            "stage": "Introduction",
            "followup_depth": 0,
            "messages": [],
            "strengths": [],
            "weaknesses": [],
            "unresolved": [],
            "feedback": None,
            "degraded": False,
            "created_at": _now(),
            "updated_at": _now(),
        }

        state = self._advance(state, welcome=True)
        save_interview(session_id, profile["candidate_id"], state["status"], state, state["created_at"], state["updated_at"])
        return state

    def process_message(self, session_id: str, message: str) -> Dict[str, Any]:
        state = load_interview(session_id)
        if not state:
            raise ValueError(f"Interview session {session_id} not found")
        if state["status"] == "completed":
            return state

        current_q = state["current_question"]
        now = _now()

        eval_result, eval_degraded = self._evaluate_answer(current_q, message)
        state["degraded"] = state["degraded"] or eval_degraded

        state["answers"].append({
            "question_number": current_q["question_number"],
            "question": current_q["question"],
            "topic": current_q["topic"],
            "day": current_q["day"],
            "difficulty": current_q["difficulty"],
            "is_follow_up": current_q["is_follow_up"],
            "answer": message,
            "timestamp": now,
        })
        state["evaluations"].append(eval_result)

        state["strengths"].extend(eval_result.get("strengths", []))
        state["weaknesses"].extend(eval_result.get("weaknesses", []))
        state["messages"].append({"role": "user", "text": message})

        # Adaptive difficulty
        quality = eval_result.get("quality_classification", "Partial")
        if quality in ("Strong", "Exceptional"):
            state["difficulty_index"] = step_difficulty(state["difficulty_index"], +1)
        elif quality in ("Weak", "Vague", "Incorrect"):
            state["difficulty_index"] = step_difficulty(state["difficulty_index"], -1)
        state["difficulty_label"] = DIFFICULTY_LABELS[DIFFICULTY_LEVELS[state["difficulty_index"]]]

        # Follow-up decision — bounded so the interview never starves topic diversity.
        # Within the first MIN_QUESTIONS answers, at most (MIN_QUESTIONS - MIN_CURRICULUM_DAYS)
        # may be follow-ups, which guarantees >= MIN_CURRICULUM_DAYS distinct curriculum days.
        weak_quality = quality in ("Partial", "Weak", "Vague", "Incorrect")
        followups_so_far = len(state["answers"]) - len(state["days_covered"])
        followup_budget = settings.MIN_QUESTIONS - settings.MIN_CURRICULUM_DAYS
        should_followup = (
            weak_quality
            and state["followup_depth"] < settings.MAX_FOLLOWUP_DEPTH
            and followups_so_far < followup_budget
        )

        if should_followup:
            state["followup_depth"] += 1
            state = self._generate_followup(state, current_q, message, quality, eval_result.get("missing_concepts", []))
        else:
            if weak_quality and state["followup_depth"] >= settings.MAX_FOLLOWUP_DEPTH:
                missing = ", ".join(eval_result.get("missing_concepts", ["unresolved"]))
                state["unresolved"].append(f"{current_q['topic']} ({missing})")
            state["followup_depth"] = 0
            state = self._advance(state, welcome=False)

        state["updated_at"] = now
        save_interview(session_id, state["candidate"]["candidate_id"], state["status"], state, state["created_at"], state["updated_at"])
        return state

    def get_session(self, session_id: str) -> Optional[Dict[str, Any]]:
        return load_interview(session_id)

    # ------------------------------------------------------- advancement
    def _advance(self, state: Dict[str, Any], welcome: bool) -> Dict[str, Any]:
        profile = state["candidate"]
        answered = len(state["answers"])

        if not welcome and self._should_finish(state, answered):
            return self.finish_interview(state)

<<<<<<< HEAD
        save_interview(interview_id, state["candidate_id"], "completed", state, state["created_at"], now)
        return state

    def _should_finish_interview(self, state: Dict[str, Any]) -> bool:
        q_count = len(state["answers"])
        days_count = len(state["curriculum_days_covered"])
        pending_followup = state["followup_depth_current"] > 0

        # Hard cap at 12 questions
        if q_count >= 12:
            return True

        # Minimum requirements check
        if q_count >= 8 and days_count >= 4 and not pending_followup:
            return True

        return False

    def _select_next_topic(self, completed_days: List[int], covered_days: List[int], covered_topics: List[str]) -> Dict[str, Any]:
        days_list = self.curriculum.get("days", []) if isinstance(self.curriculum, dict) else self.curriculum
        if not days_list:
            days_list = [{"day": 1, "title": "Environment & Setup", "tools": ["Python"], "objectives": ["Setup environment"]}]
        
        # Helper to normalize topic dict
        def format_topic_obj(item):
            topic_name = item.get("title") or item.get("topic", f"Day {item.get('day', 1)}")
            module_name = item.get("module") or item.get("type", "Core Module")
            learning_obj = item.get("learning_objective") or (item.get("objectives")[0] if item.get("objectives") else "Master topic")
            return {
                "day": item.get("day", 1),
                "module": module_name,
                "topic": topic_name,
                "learning_objective": learning_obj,
                "tools": item.get("tools", []),
                "related_concepts": item.get("related_concepts", [])
            }

        # Prioritize completed curriculum days not yet covered
        uncovered = [curr for curr in days_list if curr["day"] in completed_days and curr["day"] not in covered_days]
        if uncovered:
            return format_topic_obj(uncovered[0])
        
        # Fall back to any curriculum topic not yet covered
        uncovered_all = [curr for curr in days_list if (curr.get("title") or curr.get("topic")) not in covered_topics]
        if uncovered_all:
            return format_topic_obj(uncovered_all[0])

        # Default fallback
        return format_topic_obj(days_list[0])

    def _get_stage_for_question(self, q_num: int) -> str:
        if q_num <= 2:
            return "Warm-up & Fundamentals"
        elif q_num <= 4:
            return "Conceptual Understanding"
        elif q_num <= 6:
            return "Practical Implementation"
        elif q_num <= 8:
            return "System Design & Failure Debugging"
=======
        if welcome:
            q_num = 1
            stage = "Introduction"
            topic_obj = self.next_topic(profile, state["days_covered"], state["topics_covered"])
            is_followup = False
            label = None
>>>>>>> ef5acd71c8e8fed613b3c93946e4dab1962db1e8
        else:
            q_num = answered + 1
            stage = self.stage_for(q_num)
            topic_obj = self.next_topic(profile, state["days_covered"], state["topics_covered"])
            is_followup = False
            label = None

        state["stage"] = stage

        q_item, degraded = self._generate_question(
            profile=profile,
            topic_obj=topic_obj,
            stage=stage,
            q_num=q_num,
            difficulty_index=state["difficulty_index"],
            is_followup=is_followup,
            followup_label=label,
            previous_questions=state["questions_asked"],
        )
        state["degraded"] = state["degraded"] or degraded
        self._record_question(state, q_item)

        # Build reply
        if welcome:
            state["welcome_message"] = self._welcome_message(profile)
            state["reply"] = state["welcome_message"] + "\n\n" + self._format_question(q_item, first=True)
        else:
            prev_topic = state["answers"][-1]["topic"] if state["answers"] else None
            new_topic = q_item["topic"] != prev_topic
            state["reply"] = self._format_question(q_item, first=False, topic_shift=new_topic)

        state["question_number"] = q_item["question_number"]
        state["current_question"] = q_item
        state["messages"].append({"role": "ai", "text": state["reply"]})
        return state

    def _generate_followup(self, state: Dict[str, Any], current_q: Dict[str, Any], answer: str, quality: str, missing: List[str]) -> Dict[str, Any]:
        tmpl = get_prompt_template("followup_generator")
        prompt = tmpl.format(
            topic=current_q["topic"],
            curriculum_day=current_q["day"],
            day_title=self.get_day(current_q["day"]).get("title", ""),
            previous_question=current_q["question"],
            previous_answer=answer,
            quality_classification=quality,
            missing_concepts=", ".join(missing) if missing else "None",
            difficulty=DIFFICULTY_LEVELS[state["difficulty_index"]],
        )
        res, degraded = ai_service.call_ai(prompt, schema_type="followup")

        q_item = {
            "question_number": current_q["question_number"] + 1,
            "question": res.get("question", "What trade-offs does that approach introduce in production?"),
            "topic": current_q["topic"],
            "day": current_q["day"],
            "module": self._module_for_day(current_q["day"]),
            "difficulty": DIFFICULTY_LEVELS[state["difficulty_index"]],
            "is_follow_up": True,
            "followup_label": res.get("followup_label", "Let's go one level deeper."),
        }
        state["degraded"] = state["degraded"] or degraded
        self._record_question(state, q_item)
        state["question_number"] = q_item["question_number"]
        state["current_question"] = q_item
        state["reply"] = f"{q_item['followup_label']}\n\n{q_item['question']}"
        state["messages"].append({"role": "ai", "text": state["reply"]})
        return state

    def _record_question(self, state: Dict[str, Any], q_item: Dict[str, Any]) -> None:
        state["questions_asked"].append(q_item["question"])
        state["questions_hashes"].append(normalize_hash(q_item["question"]))
        if q_item["topic"] not in state["topics_covered"]:
            state["topics_covered"].append(q_item["topic"])
        if q_item["day"] not in state["days_covered"]:
            state["days_covered"].append(q_item["day"])

    def _should_finish(self, state: Dict[str, Any], answered: int) -> bool:
        # Hard rule: never finish before MIN_CURRICULUM_DAYS distinct days are covered.
        if len(state["days_covered"]) < settings.MIN_CURRICULUM_DAYS:
            return False
        if answered >= settings.MIN_QUESTIONS:
            return True
        return answered >= settings.MAX_QUESTIONS

    # ------------------------------------------------------- question generation
    def _generate_question(self, profile: Dict[str, Any], topic_obj: Dict[str, Any], stage: str, q_num: int,
                           difficulty_index: int, is_followup: bool, followup_label: Optional[str],
                           previous_questions: Optional[List[str]] = None) -> Tuple[Dict[str, Any], bool]:
        tmpl = get_prompt_template("question_generator")
        prev_summary = "\n".join(f"- {q}" for q in (previous_questions or [])) or "None"
        diff = DIFFICULTY_LEVELS[difficulty_index]
        prompt = tmpl.format(
            candidate_name=profile["name"],
            candidate_role=profile["role"],
            topic=topic_obj.get("topic") or topic_obj.get("title", f"Day {topic_obj['day']}"),
            curriculum_day=topic_obj["day"],
            day_title=topic_obj.get("title", ""),
            module=self._module_for_day(topic_obj["day"]),
            objectives="\n".join(f"- {o}" for o in topic_obj.get("objectives", [])) or "None",
            tools=", ".join(topic_obj.get("tools", [])) or "None",
            difficulty=diff,
            interview_stage=stage,
            previous_questions_summary=prev_summary,
        )

        res, degraded = ai_service.call_ai(prompt, schema_type="question")
        q_text = res.get("question") or self._default_question(topic_obj)

        q_item = {
            "question_number": q_num,
            "question": q_text,
            "topic": topic_obj.get("topic") or topic_obj.get("title", f"Day {topic_obj['day']}"),
            "day": topic_obj["day"],
            "module": self._module_for_day(topic_obj["day"]),
            "difficulty": diff,
            "is_follow_up": is_followup,
            "followup_label": followup_label,
        }
        return q_item, degraded

    def _default_question(self, topic_obj: Dict[str, Any]) -> str:
        return f"How would you apply the core ideas from Day {topic_obj['day']} ({topic_obj.get('title', '')}) to a production AI system, and what trade-offs matter most?"

    # ------------------------------------------------------- answer evaluation
    def _evaluate_answer(self, q_item: Dict[str, Any], answer: str) -> Tuple[Dict[str, Any], bool]:
        tmpl = get_prompt_template("answer_evaluator")
        prompt = tmpl.format(
            question=q_item["question"],
            topic=q_item["topic"],
            curriculum_day=q_item["day"],
            difficulty=q_item["difficulty"],
            candidate_answer=answer,
        )
        res, degraded = ai_service.call_ai(prompt, schema_type="evaluation")

        def num(key: str, default: int) -> int:
            try:
                return int(res.get(key, default))
            except (TypeError, ValueError):
                return default

        corr, depth = num("technical_correctness", 7), num("depth", 7)
        pract, reas = num("practical_understanding", 7), num("engineering_reasoning", 7)
        comm = num("communication", 8)
        res["overall"] = compute_overall(corr, depth, pract, reas, comm)
        res.setdefault("quality_classification", "Partial")
        res.setdefault("strengths", [])
        res.setdefault("weaknesses", [])
        res.setdefault("missing_concepts", [])
        res.setdefault("evidence", "")
        return res, degraded

    # ------------------------------------------------------- finish / feedback
    def finish_interview(self, state: Dict[str, Any]) -> Dict[str, Any]:
        feedback, degraded = self._generate_final_feedback(state)
        state["status"] = "completed"
        state["current_question"] = None
        state["feedback"] = feedback
        state["degraded"] = state["degraded"] or degraded
        state["reply"] = "Interview completed."
        state["updated_at"] = _now()
        save_interview(state["session_id"], state["candidate"]["candidate_id"], "completed", state, state["created_at"], state["updated_at"])
        return state

    def _generate_final_feedback(self, state: Dict[str, Any]) -> Tuple[Dict[str, Any], bool]:
        tmpl = get_prompt_template("final_feedback_generator")
        evidence_lines = []
        topic_scores_map: Dict[str, Dict[str, Any]] = {}

        for ans, ev in zip(state["answers"], state["evaluations"]):
            q_num, topic, day, overall = ans["question_number"], ans["topic"], ans["day"], ev.get("overall", 7)
            evidence_lines.append(
                f"Q{q_num} [{topic}]: Question: '{ans['question']}' | Answer: '{ans['answer']}' | Score: {overall}/10 | Evidence: {ev.get('evidence', '')}"
            )
            topic_scores_map.setdefault(topic, {"day": day, "scores": []})["scores"].append(overall)

        prompt = tmpl.format(
            candidate_name=state["candidate"]["name"],
            candidate_role=state["candidate"]["role"],
            interview_summary_evidence="\n".join(evidence_lines),
        )
        res, degraded = ai_service.call_ai(prompt, schema_type="feedback")

        computed_topic_scores = []
        all_averages = []
        for topic, data in topic_scores_map.items():
            avg_10 = sum(data["scores"]) / max(1, len(data["scores"]))
            pct = int(round(avg_10 * 10))
            status = "Mastered" if pct >= 85 else "Developing" if pct >= 70 else "Needs Practice"
            computed_topic_scores.append({"topic": topic, "day": data["day"], "score": pct, "status": status})
            all_averages.append(pct)

        overall_score = int(round(sum(all_averages) / len(all_averages))) if all_averages else 80

        feedback = {
            "summary": res.get("interviewer_summary") or res.get("summary", "The candidate demonstrated solid technical understanding across the interview."),
            "strengths": res.get("strengths", []) or [],
            "gaps": res.get("weaknesses", []) or res.get("gaps", []),
            "next": res.get("recommendations", []) or res.get("next", []),
            "overall_score": res.get("overall_score", overall_score),
            "category_scores": res.get("category_scores", []),
            "topic_scores": res.get("topic_scores") or computed_topic_scores,
            "traceable_evidence": [
                {"question_number": a["question_number"], "topic": a["topic"], "answer_snippet": a["answer"][:100]}
                for a in state["answers"]
            ],
        }
        return feedback, degraded

    # ------------------------------------------------------- message formatting
    def _welcome_message(self, profile: Dict[str, Any]) -> str:
        return (
            f"Welcome to your technical interview, {profile['name']}. "
            f"Given your background as a {profile['role'].lower() or 'candidate'} in this cohort, "
            "I'll be exploring how you understand and apply AI engineering concepts, "
            "adapting to your answers as we go. Let's begin."
        )

    def _format_question(self, q_item: Dict[str, Any], first: bool = False, topic_shift: bool = False) -> str:
        parts = []
        if topic_shift and not first:
            parts.append(f"Let's shift focus to {q_item['topic']}.")
        if first:
            parts.append(f"**Question {q_item['question_number']} · {q_item['topic']}**")
        parts.append(q_item["question"])
        return "\n\n".join(parts)

    # ------------------------------------------------------- public response
    def public_response(self, state: Dict[str, Any]) -> Dict[str, Any]:
        done = state["status"] == "completed"
        return {
            "reply": state.get("reply", ""),
            "done": done,
            "sessionId": state["session_id"],
            "feedback": state.get("feedback"),
            "question": state.get("current_question"),
            "transcript": state.get("messages", []),
            "progress": {
                "question_number": state["question_number"],
                "answers": len(state["answers"]),
                "min_questions": settings.MIN_QUESTIONS,
                "days_covered": state["days_covered"],
                "min_days": settings.MIN_CURRICULUM_DAYS,
                "topics_covered": state["topics_covered"],
                "difficulty": state["difficulty_label"],
                "stage": state["stage"],
                "followup_depth": state["followup_depth"],
            },
            "degraded_mode": state["degraded"],
        }


orchestrator = InterviewOrchestrator()
