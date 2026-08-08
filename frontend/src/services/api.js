import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
const API_PREFIX = '/api/v1';

const client = axios.create({
  baseURL: `${BASE_URL}${API_PREFIX}`,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 20000,
});

export async function fetchHealth() {
  try {
    const res = await axios.get(`${BASE_URL}/health`);
    return res.data;
  } catch (err) {
    return { status: 'offline', demo_mode: true };
  }
}

export async function fetchCandidates() {
  try {
    const res = await client.get('/candidates');
    return res.data.candidates || [];
  } catch (err) {
    console.warn('Failed to fetch candidates from API, using fallback:', err.message);
    return [
      {
        candidate_id: "cand_alex_001",
        name: "Alex Rivera",
        role: "Senior Full-Stack / AI Engineer Candidate",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
        completed_days: [1, 4, 6, 8, 12, 15, 20, 24],
        skipped_days: [18, 31],
        completed_missions: [
          { mission_id: "m1", title: "Prompt Optimizer Engine", day: 4, score: 92 },
          { mission_id: "m2", title: "Vector RAG Search Service", day: 8, score: 88 },
          { mission_id: "m3", title: "Hybrid Re-ranking Pipeline", day: 15, score: 85 },
          { mission_id: "m4", title: "Autonomous ReAct Agent Loop", day: 20, score: 90 }
        ],
        learning_signals: {
          confidence: "high",
          failed_attempts: 1,
          strong_areas: ["RAG Architecture", "Agentic Loops", "Vector DBs"],
          weak_areas: ["RAG Evaluation Metrics", "AI Security Guardrails"],
          baseline_difficulty: "intermediate"
        }
      },
      {
        candidate_id: "cand_priya_002",
        name: "Priya Sharma",
        role: "Machine Learning Systems Engineer Candidate",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Priya",
        completed_days: [1, 4, 6, 8, 12, 15, 18, 24, 28],
        skipped_days: [20],
        completed_missions: [
          { mission_id: "m10", title: "High-Throughput vLLM Serving", day: 28, score: 96 },
          { mission_id: "m11", title: "GraphRAG Knowledge Retriever", day: 15, score: 91 }
        ],
        learning_signals: {
          confidence: "high",
          failed_attempts: 0,
          strong_areas: ["Inference Infrastructure", "Evaluation"],
          weak_areas: ["Agentic Frameworks"],
          baseline_difficulty: "advanced"
        }
      }
    ];
  }
}

export async function fetchCurriculum() {
  try {
    const res = await client.get('/curriculum');
    return res.data.curriculum || [];
  } catch (err) {
    return [];
  }
}

export async function startInterview(candidateId) {
  const res = await client.post('/interview/start', { candidate_id: candidateId });
  return res.data;
}

export async function submitAnswer(interviewId, answerText) {
  const res = await client.post(`/interview/${interviewId}/answer`, { answer: answerText });
  return res.data;
}

export async function fetchInterview(interviewId) {
  const res = await client.get(`/interview/${interviewId}`);
  return res.data;
}

export async function finishInterview(interviewId) {
  const res = await client.post(`/interview/${interviewId}/finish`);
  return res.data;
}
