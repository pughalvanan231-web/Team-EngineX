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
    console.warn('Failed to fetch candidates from backend API, using local fallback:', err.message);
    return [
      {
        member: {
          id: "CAND-001",
          name: "Sarah Johnson",
          jobRole: "Senior Data Engineer",
          yearsExperience: 9,
          education: "MS Computer Science",
          status: "COMPLETED"
        },
        missions: [
          { day: 7, title: "Embeddings Explained", passed: true, attempts: 1 },
          { day: 8, title: "Vector Databases Overview", passed: true, attempts: 1 },
          { day: 10, title: "Retrieval & Matching Engine", passed: true, attempts: 2 },
          { day: 12, title: "Prompt Engineering Fundamentals", passed: true, attempts: 4 },
          { day: 16, title: "Chatbot Backend & API Integration", passed: true, attempts: 1 },
          { day: 22, title: "Multi-Agent Orchestration", passed: true, attempts: 2 },
          { day: 23, title: "Model Context Protocol (MCP)", passed: true, attempts: 2 },
          { day: 28, title: "Docker & Kubernetes Deployment", passed: true, attempts: 3 },
          { day: 29, title: "Monitoring, Logging & Observability", skipped: true },
          { day: 31, title: "Capstone Project & Final Demo", passed: true, attempts: 1 }
        ],
        signals: { commitDays: 28, missionsCompleted: 30, missionsFirstTry: 20 }
      },
      {
        member: {
          id: "CAND-002",
          name: "Alex Turner",
          jobRole: "Backend Software Engineer",
          yearsExperience: 5,
          education: "B.Tech Computer Science",
          status: "COMPLETED"
        },
        missions: [
          { day: 7, title: "Embeddings Explained", passed: true, attempts: 3 },
          { day: 8, title: "Vector Databases Overview", passed: true, attempts: 2 },
          { day: 10, title: "Retrieval & Matching Engine", passed: true, attempts: 4 },
          { day: 12, title: "Prompt Engineering Fundamentals", passed: true, attempts: 5 },
          { day: 13, title: "Function Calling & Structured Outputs", passed: true, attempts: 4 },
          { day: 16, title: "Chatbot Backend & API Integration", passed: true, attempts: 1 },
          { day: 18, title: "Streaming Responses", passed: true, attempts: 1 },
          { day: 22, title: "Multi-Agent Orchestration", passed: true, attempts: 3 },
          { day: 28, title: "Docker & Kubernetes Deployment", passed: true, attempts: 1 },
          { day: 31, title: "Capstone Project & Final Demo", passed: true, attempts: 2 }
        ],
        signals: { commitDays: 22, missionsCompleted: 29, missionsFirstTry: 10 }
      },
      {
        member: {
          id: "CAND-003",
          name: "Emily Chen",
          jobRole: "AI Engineer",
          yearsExperience: 6,
          education: "MS Artificial Intelligence",
          status: "COMPLETED"
        },
        missions: [
          { day: 7, title: "Embeddings Explained", passed: true, attempts: 1 },
          { day: 8, title: "Vector Databases Overview", passed: true, attempts: 1 },
          { day: 10, title: "Retrieval & Matching Engine", passed: true, attempts: 1 },
          { day: 11, title: "RAG End-to-End & LLM API Basics", passed: true, attempts: 1 },
          { day: 12, title: "Prompt Engineering Fundamentals", passed: true, attempts: 1 },
          { day: 13, title: "Function Calling & Structured Outputs", passed: true, attempts: 1 },
          { day: 21, title: "LangChain Agents", passed: true, attempts: 1 },
          { day: 22, title: "Multi-Agent Orchestration", passed: true, attempts: 1 },
          { day: 23, title: "Model Context Protocol (MCP)", passed: true, attempts: 1 },
          { day: 31, title: "Capstone Project & Final Demo", passed: true, attempts: 1 }
        ],
        signals: { commitDays: 31, missionsCompleted: 31, missionsFirstTry: 30 }
      }
    ];
  }
}

export async function fetchCurriculum() {
  try {
    const res = await client.get('/curriculum');
    return res.data.curriculum || [];
  } catch (err) {
    console.warn('Failed to fetch curriculum from backend API, using fallback:', err.message);
    return {
      cohort: "AI Cohort · 31 days · 8 modules",
      modules: [
        { n: 1, title: "Environment & Tooling", days: [1, 3] },
        { n: 2, title: "Data Foundations", days: [4, 6] },
        { n: 3, title: "Embeddings & Vector Search", days: [7, 10] },
        { n: 4, title: "LLM Core, Prompting & Fine-Tuning", days: [11, 15] },
        { n: 5, title: "Chatbot Application Build", days: [16, 20] },
        { n: 6, title: "Agentic AI & MCP", days: [21, 24] },
        { n: 7, title: "Evaluation, Security & Deployment", days: [25, 28] },
        { n: 8, title: "Production & Capstone", days: [29, 31] }
      ],
      days: [
        { day: 1, title: "VS Code & Python Environment Setup", type: "SETUP", tools: ["VS Code", "Python"], objectives: ["Setup environment"] },
        { day: 4, title: "Reading & Processing Structured Data", type: "BUILD", tools: ["Pandas", "SQLite"], objectives: ["Process tabular data"] },
        { day: 7, title: "Embeddings Explained", type: "AI_CORE", tools: ["Sentence Transformers", "OpenAI"], objectives: ["Generate vector embeddings"] },
        { day: 8, title: "Vector Databases Overview", type: "BUILD", tools: ["ChromaDB", "Pinecone"], objectives: ["Setup vector store"] },
        { day: 10, title: "The Retrieval & Matching Engine", type: "SHIP_IT", tools: ["ChromaDB", "Python"], objectives: ["Build hybrid retrieval router"] },
        { day: 12, title: "Prompt Engineering Fundamentals", type: "LEARN", tools: ["Prompt Templates"], objectives: ["Optimize system prompts"] },
        { day: 16, title: "Chatbot Application Build", type: "BUILD", tools: ["FastAPI", "React"], objectives: ["Integrate full stack bot"] },
        { day: 22, title: "Multi-Agent Orchestration", type: "SHIP_IT", tools: ["LangGraph", "Python"], objectives: ["Build multi-agent workflows"] },
        { day: 28, title: "Evaluation, Security & Deployment", type: "SHIP_IT", tools: ["Docker", "Kubernetes"], objectives: ["Deploy production service"] },
        { day: 31, title: "Production & Capstone", type: "SHIP_IT", tools: ["Python", "FastAPI"], objectives: ["Final capstone submission"] }
      ]
    };
  }
}

export async function startInterviewSession(candidateId, candidateObj) {
  try {
    // Attempt standard endpoint first
    const res = await client.post('/interview/start', { candidate_id: candidateId });
    return res.data;
  } catch (err) {
    // Fallback to unified POST /api/interview
    try {
      const res = await axios.post(`${BASE_URL}/api/interview`, {
        sessionId: `session_${Date.now()}`,
        candidate: candidateObj || { member: { id: candidateId } }
      });
      return res.data.state || res.data;
    } catch (fallbackErr) {
      console.warn('Both backend APIs unavailable, using client-side mock session');
      return createMockInitialState(candidateId, candidateObj);
    }
  }
}

export async function submitInterviewAnswer(sessionId, answerText) {
  try {
    const res = await client.post(`/interview/${sessionId}/answer`, { answer: answerText });
    return res.data;
  } catch (err) {
    try {
      const res = await axios.post(`${BASE_URL}/api/interview`, {
        sessionId: sessionId,
        message: answerText
      });
      if (res.data.done && res.data.feedback) {
        return {
          status: 'completed',
          final_feedback: {
            interviewer_summary: res.data.feedback.summary,
            strengths: res.data.feedback.strengths,
            weaknesses: res.data.feedback.gaps,
            recommendations: res.data.feedback.next
          }
        };
      }
      return res.data.state || res.data;
    } catch (fallbackErr) {
      console.warn('API submission failed, advancing mock session state');
      return createMockNextState(sessionId, answerText);
    }
  }
}

export async function fetchInterviewSession(sessionId) {
  try {
    const res = await client.get(`/interview/${sessionId}`);
    return res.data;
  } catch (err) {
    return null;
  }
}

export async function finishInterviewSession(sessionId) {
  try {
    const res = await client.post(`/interview/${sessionId}/finish`);
    return res.data;
  } catch (err) {
    return createMockFinalState(sessionId);
  }
}

// Client-side mock state generator for offline / fallback testing
function createMockInitialState(candidateId, candidateObj) {
  const name = candidateObj?.member?.name || "Alex Turner";
  return {
    candidate_id: candidateId,
    candidate_name: name,
    interview_id: `mock_${Date.now()}`,
    current_question: {
      question_number: 1,
      question: `Welcome ${name}. In Day 8 of your cohort, you worked on Vector Databases. Could you explain how you selected ChromaDB vs Pinecone and how you optimized retrieval latency?`,
      topic: "Vector Databases Overview",
      curriculum_day: 8,
      difficulty: "intermediate",
      is_follow_up: false,
      followup_label: "CORE QUESTION"
    },
    question_number: 1,
    questions_asked: [],
    topics_covered: ["Vector Databases Overview"],
    curriculum_days_covered: [8],
    answers: [],
    evaluations: [],
    strengths: [],
    weaknesses: [],
    unresolved_concepts: [],
    followup_depth_current: 0,
    difficulty: "intermediate",
    interview_stage: "Warm-up & Fundamentals",
    status: "in_progress",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
}

function createMockNextState(sessionId, answerText) {
  return {
    candidate_id: "CAND-001",
    candidate_name: "Sarah Johnson",
    interview_id: sessionId,
    current_question: {
      question_number: 2,
      question: `You mentioned cosine similarity indexing. What specific edge cases or failure modes would you expect when applying cosine distance to long-form healthcare context documents?`,
      topic: "Embeddings Explained",
      curriculum_day: 7,
      difficulty: "advanced",
      is_follow_up: true,
      followup_label: "FOLLOW-UP QUESTION"
    },
    question_number: 2,
    questions_asked: [
      { question: "Walk me through your vector retrieval pipeline." }
    ],
    topics_covered: ["Vector Databases Overview", "Embeddings Explained"],
    curriculum_days_covered: [8, 7],
    answers: [
      { question_number: 1, answer: answerText }
    ],
    evaluations: [
      {
        technical_correctness: 8,
        depth: 8,
        practical_understanding: 9,
        engineering_reasoning: 8,
        communication: 9,
        quality_classification: "Strong"
      }
    ],
    strengths: ["Clear explanation of vector indexing trade-offs", "Solid practical understanding of RAG retrieval"],
    weaknesses: ["Could elaborate more on chunk boundary overlap strategy"],
    unresolved_concepts: [],
    followup_depth_current: 1,
    difficulty: "advanced",
    interview_stage: "Conceptual Understanding",
    status: "in_progress",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
}

function createMockFinalState(sessionId) {
  return {
    candidate_id: "CAND-001",
    candidate_name: "Sarah Johnson",
    interview_id: sessionId,
    status: "completed",
    final_feedback: {
      overall_score: 9,
      interviewer_summary: "The candidate demonstrated strong end-to-end technical mastery across vector retrieval, prompt optimization, and agentic orchestration. Communication was structured and engineering trade-offs were clearly justified.",
      strengths: [
        "In-depth comprehension of vector embeddings, cosine distance vs inner product similarity",
        "Clear architectural rationale for agentic tool selection and Model Context Protocol (MCP)",
        "Strong system-level understanding of production deployment pipelines"
      ],
      weaknesses: [
        "Could expand on vector index benchmarking under high-concurrency workloads",
        "Quantization trade-offs for local model deployment could be explained with more empirical detail"
      ],
      recommendations: [
        "Experiment with HNSW index tuning parameters for scale",
        "Implement automated evaluation suites using Ragas or TruLens for continuous RAG monitoring",
        "Explore streaming response backpressure handling in production APIs"
      ]
    }
  };
}

