# Interview Agent — Adaptive AI Technical Interviewer

> **Tagline:** *"Build the interviewer, not the interview."*

Interview Agent runs realistic, personalized, multi-turn technical interviews for the 31-day AI Cohort. Every interview is grounded in the candidate's real curriculum history — weak days are probed, strong days are challenged at higher difficulty — and ends with an evidence-based, structured report.

---

## Architecture & Flow

```text
┌──────────────────────────────┐
│     Frontend (React + Vite)  │
│  Landing · Candidates ·      │
│  Pre-interview · Chat ·      │
│  Report                      │
└──────────────┬───────────────┘
               │  POST /api/interview   { sessionId, candidate }
               │  POST /api/interview   { sessionId, message }
               │  GET  /api/interview/{sessionId}
               v
┌──────────────────────────────┐
│      FastAPI Backend         │
└──────────────┬───────────────┘
       ┌───────┴─────────────────────────────┐
       v                                     v
┌──────────────────────────────┐  ┌──────────────────────────────┐
│    Interview Orchestrator    │  │    SQLite Persistent Store   │
│  (Personalization, Rules,    │  │  (backend/app/data/interviews)│
│   Adaptive Difficulty)       │  └──────────────────────────────┘
└──────────────┬───────────────┘
       ┌───────┴─────────────────────────────┐
       │   AI Provider Abstraction Layer     │
       │   (Timeout, Retry, Circuit Breaker) │
       └───────┬─────────────────────────────┘
               │
       ┌───────┴─────────────────────────────┐
       v                                     v
┌──────────────────────────────┐  ┌──────────────────────────────┐
│   Groq / OpenAI (JSON mode)  │  │  Deterministic DEMO_MODE     │
│   Structured JSON Output     │  │  fallback (no API key)       │
└──────────────────────────────┘  └──────────────────────────────┘
```

---

## Key Features

1. **Personalized topic selection (no static question banks)**
   - Reads each candidate's missions, failed days, attempt counts, and completion signals.
   - Builds a topic pool: failed days → high-attempt days → completed days → role-relevant modules (Agents/MCP, Production, RAG) → curriculum fallback.
   - First question already targets the candidate's weakest area.

2. **Five-level adaptive difficulty**
   - `fundamentals → application → debugging → architecture → engineering judgment`.
   - Starts from role + experience + mission signals, then moves **±1 level per answer** based on the evaluated quality.

3. **Follow-up probing with guardrails**
   - Partial/vague answers trigger `"Let's go one level deeper."` follow-ups.
   - Follow-ups are capped (max depth 2) and budget-bounded so the interview always covers **≥ 4 distinct curriculum days** within the minimum 8 questions.

4. **Evidence-based evaluation**
   - Each answer scored across 5 dimensions: *Technical Correctness, Depth, Practical Understanding, Engineering Reasoning, Communication*.
   - Weighted overall: `overall = round(0.30·corr + 0.20·depth + 0.20·practical + 0.15·reasoning + 0.15·comm)`.
   - Final report includes overall/category/topic scores, strengths, gaps, next steps, and a full transcript.

5. **Concrete stopping criteria**
   - Completes when `answers >= 8` **and** `curriculum_days_covered >= 4`.
   - Hard cap at 12 questions; never finishes with fewer than 4 days.

6. **Durable sessions**
   - State persisted to SQLite before every response; the frontend restores the session on refresh via `GET /api/interview/{sessionId}` and rebuilds the full chat transcript.

7. **Reliability & security**
   - 15s timeout, 1 retry, 3-strike circuit breaker tripping to demo fallback (`degraded_mode: true`).
   - Candidate answers are wrapped in `<candidate_answer>…</candidate_answer>` and treated as untrusted input in prompts.

---

## API Endpoints

- `GET /health` — Status, provider, demo mode.
- `GET /api/v1/candidates` — Public-safe candidate cards (name, role, experience, mission counts).
- `GET /api/v1/curriculum` — Full 31-day curriculum (modules & days).
- `POST /api/interview` (also `/api/v1/interview`) — Start `{ "sessionId", "candidate" }` or continue `{ "sessionId", "message" }`.
- `GET /api/interview/{sessionId}` — Restore a session (refresh survival).

Response shape:

```json
{
  "reply": "…latest interviewer message…",
  "done": false,
  "sessionId": "sess_…",
  "feedback": null,
  "question": { "question_number": 2, "question": "…", "topic": "…", "day": 28, "difficulty": "architecture" },
  "transcript": [ { "role": "ai" | "user", "text": "…" } ],
  "progress": { "question_number": 2, "answers": 1, "days_covered": [12], "topics_covered": ["…"], "difficulty": "…", "stage": "…" },
  "degraded_mode": false
}
```

---

## Project Structure

```text
Team-EngineX-InterviewAgent/
├── backend/
│   ├── app/
│   │   ├── agents/orchestrator.py   # Personalization, difficulty, rules, stop logic
│   │   ├── data/candidates.json     # 20 real candidate profiles & signals
│   │   ├── data/curriculum.json     # 31-day AI Cohort curriculum
│   │   ├── db/database.py           # SQLite persistence
│   │   ├── prompts/*.txt            # question / followup / evaluator / feedback templates
│   │   ├── schemas/schemas.py       # Pydantic v2 schemas
│   │   ├── services/provider.py     # Groq/OpenAI + circuit breaker + demo fallback
│   │   ├── config.py                # Settings (AI_PROVIDER, GROQ_API_KEY, …)
│   │   └── main.py                  # FastAPI app
│   ├── .env.example
│   └── requirements.txt
├── frontend/
│   └── src/
│       ├── pages/                   # Landing, Candidates, PreInterview, Interview, Feedback
│       ├── components/              # Navbar, shared UI
│       └── services/                # api.js, session.js
├── README.md
├── PROMPTS.md
└── technical-spec.md
```

---

## Getting Started

### 1. Backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate            # Windows
pip install -r requirements.txt

copy .env.example .env           # then set GROQ_API_KEY for live LLM, or leave demo
uvicorn app.main:app --reload --port 8000
```

API docs: `http://localhost:8000/docs`

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

Visit `http://localhost:5173`. The Vite dev server proxies `/api` to the backend on port 8000.

> **Demo mode:** with no API key (`DEMO_MODE=true` or `AI_PROVIDER=demo`), the backend serves deterministic simulated questions/evaluations so the full flow works offline. The UI shows a *degraded mode* notice. Set `AI_PROVIDER=groq` and `GROQ_API_KEY=…` for live interviews.

### 3. Verification

```bash
# Backend
python -m compileall backend/app && python -m pytest backend/tests -q   # if tests present

# Frontend
cd frontend && npm run build && npx oxlint src
```

---

## Live Demo Flow

1. **Pick a candidate** — e.g. Sarah Johnson (Senior Data Engineer, weak on Prompt Engineering).
2. **Pre-interview preview** — see the focus areas derived from her curriculum history.
3. **First question** — already targets her weakest day at an appropriate difficulty.
4. **Strong answer** → difficulty steps up; **vague answer** → `"Let's go one level deeper."` probe.
5. **Refresh the browser mid-interview** — the chat restores from the backend session.
6. **Finish** — the report shows overall/category/topic scores, strengths, gaps, next steps, and the transcript.
