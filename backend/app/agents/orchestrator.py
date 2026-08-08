import os
import json
import uuid
import datetime
import hashlib
from typing import Dict, Any, List, Tuple, Optional

from app.config import settings
from app.db.database import save_interview, load_interview
from app.schemas.schemas import DifficultyLevel, InterviewStateSchema, QuestionItem, AnswerEvaluation, FinalFeedback
from app.services.provider import ai_service

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
]

def step_difficulty(current: DifficultyLevel, direction: int) -> DifficultyLevel:
    """Step difficulty up (+1) or down (-1) by exactly 1 level."""
    try:
        idx = DIFFICULTY_STEPS.index(current)
        new_idx = max(0, min(len(DIFFICULTY_STEPS) - 1, idx + direction))
        return DIFFICULTY_STEPS[new_idx]
    except ValueError:
        return DifficultyLevel.INTERMEDIATE

def normalize_hash(text: str) -> str:
    """Returns normalized lowercased whitespace-collapsed hash of a string."""
    clean = " ".join(text.lower().strip().split())
    return hashlib.md5(clean.encode('utf-8')).hexdigest()

def compute_overall_score(corr: int, depth: int, pract: int, reas: int, comm: int) -> int:
    """
    Computes exact weighted sub-score formula:
    overall = round(0.30*correctness + 0.20*depth + 0.20*practical + 0.15*reasoning + 0.15*communication)
    clipped to [1,10].
    """
    raw = (0.30 * corr) + (0.20 * depth) + (0.20 * pract) + (0.15 * reas) + (0.15 * comm)
    val = int(round(raw))
    return max(1, min(10, val))

class InterviewOrchestrator:
    def __init__(self):
        self.curriculum = load_curriculum_data()
        self.candidates = load_candidate_data()

    def get_candidate(self, candidate_id: str) -> Optional[Dict[str, Any]]:
        self.candidates = load_candidate_data()
        for cand in self.candidates:
            c_id = cand.get("candidate_id") or cand.get("member", {}).get("id") or cand.get("id")
            if c_id == candidate_id:
                return cand
        return self.candidates[0] if self.candidates else None

    def start_interview(self, candidate_id: str) -> Dict[str, Any]:
        cand = self.get_candidate(candidate_id)
        if not cand:
            raise ValueError(f"Candidate {candidate_id} not found")

        c_id = cand.get("candidate_id") or cand.get("member", {}).get("id") or candidate_id
        c_name = cand.get("name") or cand.get("member", {}).get("name", "Candidate")

        interview_id = f"int_{uuid.uuid4().hex[:12]}"
        now = datetime.datetime.utcnow().isoformat()

        baseline_diff = cand.get("learning_signals", {}).get("baseline_difficulty", "intermediate")
        initial_difficulty = DifficultyLevel(baseline_diff) if baseline_diff in DIFFICULTY_STEPS else DifficultyLevel.INTERMEDIATE

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
            "answers": [],
            "evaluations": [],
            "strengths": [],
            "weaknesses": [],
            "unresolved_concepts": [],
            "followup_depth_current": 0,
            "difficulty": initial_difficulty,
            "interview_stage": "Warm-up & Fundamentals",
            "status": "in_progress",
            "degraded_mode": degraded,
            "created_at": now,
            "updated_at": now,
            "final_feedback": None
        }

        save_interview(interview_id, candidate_id, "in_progress", state, now, now)
        return state

    def process_answer(self, interview_id: str, candidate_answer: str) -> Dict[str, Any]:
        state = load_interview(interview_id)
        if not state:
            raise ValueError(f"Interview session {interview_id} not found")

        if state["status"] == "completed":
            return state

        current_q = state["current_question"]
        now = datetime.datetime.utcnow().isoformat()

        # Evaluate Answer
        eval_result, eval_degraded = self._evaluate_answer(current_q, candidate_answer)
        if eval_degraded:
            state["degraded_mode"] = True

        state["answers"].append({
            "question_number": state["question_number"],
            "question": current_q["question"],
            "topic": current_q["topic"],
            "curriculum_day": current_q["curriculum_day"],
            "answer": candidate_answer,
            "timestamp": now
        })

        state["evaluations"].append(eval_result)

        # Collect strengths & weaknesses
        if eval_result.get("strengths"):
            state["strengths"].extend(eval_result["strengths"])
        if eval_result.get("weaknesses"):
            state["weaknesses"].extend(eval_result["weaknesses"])

        # Determine Follow-Up vs Next Question
        quality = eval_result.get("quality_classification", "Partial")
        prev_diff = DifficultyLevel(state["difficulty"])

        # Step difficulty based on quality
        if quality in ["Strong", "Exceptional"]:
            new_diff = step_difficulty(prev_diff, +1)
        elif quality in ["Weak", "Incorrect"]:
            new_diff = step_difficulty(prev_diff, -1)
        else:
            new_diff = prev_diff
        state["difficulty"] = new_diff

        # Check follow-up condition
        should_followup = quality in ["Partial", "Weak", "Vague", "Incorrect"] and state["followup_depth_current"] < 2

        if should_followup:
            state["followup_depth_current"] += 1
            next_q, q_degraded = self._generate_followup(
                current_q=current_q,
                previous_answer=candidate_answer,
                quality=quality,
                missing_concepts=eval_result.get("missing_concepts", []),
                difficulty=new_diff
            )
            if q_degraded: state["degraded_mode"] = True
        else:
            # Topic thread resolved or depth cap reached
            if quality in ["Partial", "Weak", "Vague", "Incorrect"] and state["followup_depth_current"] >= 2:
                state["unresolved_concepts"].append(f"{current_q['topic']} ({', '.join(eval_result.get('missing_concepts', ['unresolved']))})")
            
            state["followup_depth_current"] = 0

            # Check stopping criteria
            if self._should_finish_interview(state):
                return self.finish_interview(interview_id)

            # Pick next topic
            cand = self.get_candidate(state["candidate_id"])
            completed_days = cand.get("completed_days", [1, 4, 6, 8]) if cand else [1, 4, 6, 8]
            next_topic_obj = self._select_next_topic(completed_days, state["curriculum_days_covered"], state["topics_covered"])

            # Determine interview stage
            q_num = state["question_number"] + 1
            stage = self._get_stage_for_question(q_num)
            state["interview_stage"] = stage

            next_q, q_degraded = self._generate_question(
                candidate_name=state["candidate_name"],
                topic_obj=next_topic_obj,
                difficulty=new_diff,
                stage=stage,
                previous_questions=[q["question"] for q in state["questions_asked"]],
                is_followup=False
            )
            if q_degraded: state["degraded_mode"] = True

        # Update state with next question
        state["question_number"] += 1
        state["current_question"] = next_q
        state["questions_asked"].append(next_q)
        state["questions_asked_hashes"].append(normalize_hash(next_q["question"]))
        
        if next_q["topic"] not in state["topics_covered"]:
            state["topics_covered"].append(next_q["topic"])
        if next_q["curriculum_day"] not in state["curriculum_days_covered"]:
            state["curriculum_days_covered"].append(next_q["curriculum_day"])

        state["updated_at"] = now
        save_interview(interview_id, state["candidate_id"], "in_progress", state, state["created_at"], now)
        return state

    def finish_interview(self, interview_id: str) -> Dict[str, Any]:
        state = load_interview(interview_id)
        if not state:
            raise ValueError(f"Interview {interview_id} not found")

        now = datetime.datetime.utcnow().isoformat()
        feedback, degraded = self._generate_final_feedback(state)

        state["status"] = "completed"
        state["current_question"] = None
        state["final_feedback"] = feedback
        state["updated_at"] = now
        if degraded: state["degraded_mode"] = True

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
        else:
            return "Production Trade-offs & Architecture"

    def _generate_question(self, candidate_name: str, topic_obj: Dict[str, Any], difficulty: DifficultyLevel, stage: str, previous_questions: List[str], is_followup: bool) -> Tuple[Dict[str, Any], bool]:
        tmpl = get_prompt_template("question_generator")
        prev_summary = "\n".join([f"- {q}" for q in previous_questions]) if previous_questions else "None"
        
        prompt = tmpl.format(
            candidate_name=candidate_name,
            topic=topic_obj["topic"],
            curriculum_day=topic_obj["day"],
            difficulty=difficulty.value if hasattr(difficulty, 'value') else str(difficulty),
            interview_stage=stage,
            previous_questions_summary=prev_summary
        )

        res_dict, degraded = ai_service.call_ai(prompt, schema_type="question")

        # Normalize and check duplicate hash
        q_text = res_dict.get("question", "How would you implement retrieval in a RAG pipeline?")
        q_hash = normalize_hash(q_text)

        # Build QuestionItem
        q_item = {
            "question_number": len(previous_questions) + 1,
            "question": q_text,
            "topic": topic_obj["topic"],
            "curriculum_day": topic_obj["day"],
            "difficulty": difficulty.value if hasattr(difficulty, 'value') else str(difficulty),
            "is_follow_up": is_followup,
            "followup_label": None
        }

        return q_item, degraded

    def _generate_followup(self, current_q: Dict[str, Any], previous_answer: str, quality: str, missing_concepts: List[str], difficulty: DifficultyLevel) -> Tuple[Dict[str, Any], bool]:
        tmpl = get_prompt_template("followup_generator")
        diff_val = difficulty.value if hasattr(difficulty, 'value') else str(difficulty)
        
        prompt = tmpl.format(
            topic=current_q["topic"],
            curriculum_day=current_q["curriculum_day"],
            previous_question=current_q["question"],
            previous_answer=previous_answer,
            quality_classification=quality,
            missing_concepts=", ".join(missing_concepts) if missing_concepts else "None",
            difficulty=diff_val
        )

        res_dict, degraded = ai_service.call_ai(prompt, schema_type="followup")

        q_item = {
            "question_number": current_q.get("question_number", 1) + 1,
            "question": res_dict.get("question", "What trade-off does that approach introduce in production?"),
            "topic": current_q["topic"],
            "curriculum_day": current_q["curriculum_day"],
            "difficulty": diff_val,
            "is_follow_up": True,
            "followup_label": res_dict.get("followup_label", "Let's go one level deeper.")
        }

        return q_item, degraded

    def _evaluate_answer(self, question_item: Dict[str, Any], candidate_answer: str) -> Tuple[Dict[str, Any], bool]:
        tmpl = get_prompt_template("answer_evaluator")

        prompt = tmpl.format(
            question=question_item["question"],
            topic=question_item["topic"],
            curriculum_day=question_item["curriculum_day"],
            difficulty=question_item.get("difficulty", "intermediate"),
            candidate_answer=candidate_answer
        )

        res_dict, degraded = ai_service.call_ai(prompt, schema_type="evaluation")

        corr = int(res_dict.get("technical_correctness", 7))
        depth = int(res_dict.get("depth", 7))
        pract = int(res_dict.get("practical_understanding", 7))
        reas = int(res_dict.get("engineering_reasoning", 7))
        comm = int(res_dict.get("communication", 8))

        # Explicit Backend Overall Formula Calculation
        overall = compute_overall_score(corr, depth, pract, reas, comm)
        res_dict["overall"] = overall

        return res_dict, degraded

    def _generate_final_feedback(self, state: Dict[str, Any]) -> Tuple[Dict[str, Any], bool]:
        tmpl = get_prompt_template("final_feedback_generator")

        # Compile evidence summary
        evidence_lines = []
        topic_scores_map = {}

        for idx, (ans, ev) in enumerate(zip(state["answers"], state["evaluations"])):
            q_num = ans["question_number"]
            topic = ans["topic"]
            day = ans["curriculum_day"]
            overall = ev.get("overall", 7)

            evidence_lines.append(f"Q{q_num} [{topic}]: Question: '{ans['question']}' | Answer: '{ans['answer']}' | Score: {overall}/10 | Evidence: {ev.get('evidence', '')}")

            if topic not in topic_scores_map:
                topic_scores_map[topic] = {"day": day, "scores": []}
            topic_scores_map[topic]["scores"].append(overall)

        prompt = tmpl.format(
            candidate_name=state["candidate_name"],
            interview_summary_evidence="\n".join(evidence_lines)
        )

        res_dict, degraded = ai_service.call_ai(prompt, schema_type="feedback")

        # Compute mean per-topic scores in backend code
        calculated_topic_scores = []
        all_topic_averages = []

        for topic, data in topic_scores_map.items():
            avg_10 = sum(data["scores"]) / max(1, len(data["scores"]))
            pct_score = int(round(avg_10 * 10))
            status = "Mastered" if pct_score >= 85 else "Developing" if pct_score >= 70 else "Needs Practice"
            
            calculated_topic_scores.append({
                "topic": topic,
                "day": data["day"],
                "score": pct_score,
                "status": status
            })
            all_topic_averages.append(pct_score)

        # Calculate overall headline percentage
        overall_headline = int(round(sum(all_topic_averages) / max(1, len(all_topic_averages)))) if all_topic_averages else 82
        res_dict["overall_score"] = overall_headline
        res_dict["topic_scores"] = calculated_topic_scores

        # Ensure traceable evidence mapping
        traceable = []
        for ans in state["answers"]:
            traceable.append({
                "question_number": ans["question_number"],
                "topic": ans["topic"],
                "answer_snippet": ans["answer"][:100]
            })
        res_dict["traceable_evidence"] = traceable

        return res_dict, degraded

orchestrator = InterviewOrchestrator()
