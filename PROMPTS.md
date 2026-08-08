# Prompt Templates

The agent is powered by four prompt templates in `backend/app/prompts/`. All prompts instruct the model to return **strict JSON** matching a fixed schema; the provider layer (`app/services/provider.py`) parses, validates, and falls back to deterministic demo responses when the API is unavailable.

| Template | Purpose | Returned JSON |
| --- | --- | --- |
| `question_generator.txt` | Generates the next interview question for a given curriculum day/topic at a target difficulty | `{ question, topic, curriculum_day, difficulty }` |
| `followup_generator.txt` | Drills one level deeper on the current topic after a partial/vague answer | `{ question, topic, curriculum_day, difficulty, followup_label }` |
| `answer_evaluator.txt` | Scores the candidate's answer across 5 dimensions and classifies quality | `{ technical_correctness, depth, practical_understanding, engineering_reasoning, communication, quality_classification, strengths, weaknesses, missing_concepts, evidence, suggested_action }` |
| `final_feedback_generator.txt` | Produces the end-of-interview report from all answers and evaluations | `{ overall_score, category_scores, topic_scores, summary, interviewer_summary, strengths, weaknesses, recommendations, traceable_evidence }` |

## Principles applied across all templates

- **Context injection** — real curriculum objectives, tools, and module names are passed in, so questions reference actual cohort content.
- **Answer isolation** — the candidate's reply is wrapped in `<candidate_answer>…</candidate_answer>` and explicitly treated as untrusted input to resist prompt injection.
- **No data leakage** — the interviewer never references a candidate's internal scores, failed missions, or analytics.
- **No repetition** — previous questions are summarized into the prompt and the question fingerprinting in the orchestrator dedupes them.
- **Difficulty-aware instruction** — each level (fundamentals / application / debugging / architecture / engineering) is described to the model so question style matches target difficulty.

## Example: `question_generator.txt` variables

| Placeholder | Source |
| --- | --- |
| `{candidate_name}`, `{candidate_role}` | Candidate payload |
| `{topic}`, `{curriculum_day}` | Selected curriculum day |
| `{day_title}`, `{module}`, `{objectives}`, `{tools}` | Real curriculum.json content |
| `{difficulty}` | Current difficulty level from the adaptive engine |
| `{interview_stage}` | Introduction → Experience → Core → Adaptive → System Design → Production → Capstone |
| `{previous_questions_summary}` | Already-asked questions (dedup) |

## Evaluation → difficulty mapping

The orchestrator maps the classifier's `quality_classification` back onto the difficulty ladder:

- `Strong` / `Exceptional` → difficulty +1
- `Partial` → keep, probe with a follow-up (budget-bounded)
- `Weak` / `Vague` / `Incorrect` → difficulty −1, probe once, then log as unresolved
