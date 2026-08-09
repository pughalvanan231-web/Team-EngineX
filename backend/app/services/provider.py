import os
import json
import re
import time
import requests
from typing import Dict, Any, Optional, Tuple

from app.config import settings


class CircuitBreaker:
    def __init__(self, failure_threshold: int = 3):
        self.failure_threshold = failure_threshold
        self.failure_count = 0
        self.is_open = False

    def record_failure(self):
        self.failure_count += 1
        if self.failure_count >= self.failure_threshold:
            self.is_open = True

    def record_success(self):
        self.failure_count = 0
        self.is_open = False


global_circuit_breaker = CircuitBreaker(failure_threshold=3)


def clean_json_response(text: str) -> str:
    """Extract valid JSON substring from markdown backticks or extra text."""
    text = text.strip()
    match = re.search(r'```(?:json)?\s*({[\s\S]*?}|\[[\s\S]*?\])\s*```', text, re.IGNORECASE)
    if match:
        return match.group(1).strip()

    start_brace = text.find('{')
    end_brace = text.rfind('}')
    if start_brace != -1 and end_brace != -1 and end_brace > start_brace:
        return text[start_brace:end_brace + 1]

    return text


class AIProviderService:
    def __init__(self):
        self.provider = settings.AI_PROVIDER.lower()
        self.api_key = settings.GROQ_API_KEY or settings.AI_API_KEY
        self.model = settings.AI_MODEL
        self.timeout = settings.AI_TIMEOUT_SECONDS

    @property
    def is_demo(self) -> bool:
        return settings.DEMO_MODE or global_circuit_breaker.is_open or not self.api_key

    def call_ai(self, prompt: str, schema_type: str = "general") -> Tuple[Dict[str, Any], bool]:
        """
        Executes AI call with retry, timeout, structured parsing, and circuit-breaker fallback.
        Returns tuple: (parsed_json_dict, is_degraded)
        """
        if self.is_demo:
            return self._demo_fallback(prompt, schema_type), True

        for attempt in range(2):
            try:
                raw_text = self._execute_provider_call(prompt)
                cleaned = clean_json_response(raw_text)
                parsed = json.loads(cleaned)
                global_circuit_breaker.record_success()
                return parsed, False
            except Exception as e:
                print(f"[AI Provider Attempt {attempt + 1} Error]: {str(e)}")
                if attempt == 0:
                    time.sleep(0.5)

        global_circuit_breaker.record_failure()
        return self._demo_fallback(prompt, schema_type), True

    def _execute_provider_call(self, prompt: str) -> str:
        if self.provider in ("groq", "openai") or "openai" in self.provider:
            base = "https://api.groq.com/openai/v1" if self.provider == "groq" else "https://api.openai.com/v1"
            url = f"{base}/chat/completions"
            headers = {"Authorization": f"Bearer {self.api_key}", "Content-Type": "application/json"}
            payload = {
                "model": self.model or "llama-3.3-70b-versatile",
                "messages": [{"role": "user", "content": prompt}],
                "temperature": 0.3,
            }
            res = requests.post(url, headers=headers, json=payload, timeout=self.timeout)
            res.raise_for_status()
            data = res.json()
            return data["choices"][0]["message"]["content"]

        if "gemini" in self.provider or "google" in self.provider:
            url = f"https://generativelanguage.googleapis.com/v1beta/models/{self.model}:generateContent?key={self.api_key}"
            payload = {
                "contents": [{"parts": [{"text": prompt}]}],
                "generationConfig": {"temperature": 0.3},
            }
            res = requests.post(url, json=payload, timeout=self.timeout)
            res.raise_for_status()
            data = res.json()
            return data["candidates"][0]["content"]["parts"][0]["text"]

        raise ValueError(f"Unsupported AI provider: {self.provider}")

    def _demo_fallback(self, prompt: str, schema_type: str) -> Dict[str, Any]:
        """Deterministic fallback responses tailored to prompt type."""
        prompt_lower = prompt.lower()

        if schema_type == "opening":
            role_match = re.search(r'- Role: (.*)', prompt, re.IGNORECASE)
            role = role_match.group(1).strip() if role_match else "AI Engineer"
            exp_match = re.search(r'- Experience: (\d+)', prompt, re.IGNORECASE)
            experience = int(exp_match.group(1).strip()) if exp_match else 4
            
            if experience >= 8:
                q = f"Given your {experience} years of experience as a {role}, walk me through the architecture of a production AI application you designed recently, focusing on how you handled scalability and cost constraints."
                diff = "architecture"
            elif experience >= 4:
                q = f"As a {role} with {experience} years of experience, pick one key technical design decision you made in a recent project and explain what trade-offs you balanced."
                diff = "application"
            else:
                q = f"Welcome! Let's start by walking through a recent technical project you worked on as an engineer. What were the core tools you used and how did you verify the system worked correctly?"
                diff = "fundamentals"
                
            return {
                "question": q,
                "topic": "Introduction & Technical Overview",
                "curriculum_day": 1,
                "difficulty": diff
            }

        if schema_type == "question":
            topic = "AI Engineering"
            day = 8
            day_match = re.search(r'- Day (\d+): (.*?)(?:\r?\n|$)', prompt, re.IGNORECASE)
            if day_match:
                day = int(day_match.group(1))
                topic = day_match.group(2).strip()
            return {
                "question": self._demo_question(topic, day),
                "topic": topic,
                "curriculum_day": day,
                "difficulty": self._demo_difficulty(prompt),
            }

        if schema_type == "followup":
            topic = "RAG"
            day = 8
            topic_match = re.search(r'CURRENT TOPIC: (.*?) \(Day (\d+)', prompt, re.IGNORECASE)
            if topic_match:
                topic = topic_match.group(1).strip()
                day = int(topic_match.group(2))
            # Extract recommended_followup_type from prompt for demo specificity
            type_match = re.search(r'Recommended follow-up type: (\w+)', prompt, re.IGNORECASE)
            followup_type = type_match.group(1).strip() if type_match else "MISSING_CONCEPT"
            return {
                "question": f"Regarding your point on {topic}, what specific failure modes or trade-offs does that approach introduce in a production system, and how would you measure them?",
                "topic": topic,
                "curriculum_day": day,
                "difficulty": "advanced",
                "followup_type": followup_type,
                "followup_label": "Let's go one level deeper.",
            }

        if schema_type == "evaluation":
            answer_match = re.search(r'<candidate_answer>([\s\S]*?)</candidate_answer>', prompt, re.IGNORECASE)
            ans_text = answer_match.group(1).strip() if answer_match else ""
            length = len(ans_text)
            has_depth = any(k in ans_text.lower() for k in
                            ("trade-off", "trade off", "latency", "throughput", "guardrail", "observability",
                             "evaluation", "scale", "architecture", "monitor", "reliability", "benchmark",
                             "index", "hybrid", "rerank", "re-rank", "chunk", "pipeline", "failure"))
            if length > 220 or (length > 120 and has_depth):
                return {
                    "technical_correctness": 9, "depth": 9, "practical_understanding": 9,
                    "engineering_reasoning": 9, "communication": 9,
                    "quality_classification": "Strong",
                    "strengths": ["Demonstrates thorough understanding of production trade-offs",
                                  "Clear reasoning across architecture and failure modes"],
                    "weaknesses": ["Could elaborate on retrieval evaluation metrics"],
                    "missing_concepts": [],
                    "evidence": "Candidate provided a detailed, well-reasoned answer covering mechanisms and constraints.",
                    "suggested_action": "Increase difficulty",
                    "correct_concepts": ["core mechanism", "production trade-offs"],
                    "incorrect_concepts": [],
                    "mentioned_tradeoffs": ["latency vs. throughput", "cost vs. accuracy"],
                    "missing_tradeoffs": ["index rebuild cost"],
                    "implementation_evidence": ["mentioned specific tooling", "referenced configuration"],
                    "recommended_followup_type": "FAILURE_SCENARIO",
                    "recommended_focus": "failure modes and degradation under production load",
                    "interesting_threads": [
                        {
                            "hook": "latency vs. throughput",
                            "direction": "trade_off",
                            "question_seed": "How did you measure and balance latency vs throughput in your production configuration?",
                            "curriculum_area": "evaluation"
                        },
                        {
                            "hook": "mentioned specific tooling",
                            "direction": "failure",
                            "question_seed": "What specific production failure modes does this tooling introduce, and how did you mitigate them?",
                            "curriculum_area": "deployment"
                        }
                    ]
                }
            if length > 70:
                return {
                    "technical_correctness": 7, "depth": 6, "practical_understanding": 7,
                    "engineering_reasoning": 6, "communication": 8,
                    "quality_classification": "Partial",
                    "strengths": ["Good high-level conceptual clarity"],
                    "weaknesses": ["Lacks concrete implementation detail for edge cases"],
                    "missing_concepts": ["Failure mode handling", "Trade-off analysis"],
                    "evidence": "Candidate explained the main concept but omitted production edge cases.",
                    "suggested_action": "Probe deeper into missing concept",
                    "correct_concepts": ["high-level mechanism"],
                    "incorrect_concepts": [],
                    "mentioned_tradeoffs": [],
                    "missing_tradeoffs": ["Failure mode handling", "Trade-off analysis"],
                    "implementation_evidence": [],
                    "recommended_followup_type": "IMPLEMENTATION",
                    "recommended_focus": "concrete implementation and failure mode handling",
                    "interesting_threads": [
                        {
                            "hook": "high-level mechanism",
                            "direction": "implement",
                            "question_seed": "Could you walk me through the code or config details of how that high-level mechanism was implemented?",
                            "curriculum_area": "vector databases"
                        }
                    ]
                }
            return {
                "technical_correctness": 4, "depth": 3, "practical_understanding": 4,
                "engineering_reasoning": 3, "communication": 5,
                "quality_classification": "Weak",
                "strengths": ["Recognizes basic terminology"],
                "weaknesses": ["Superficial explanation without technical mechanisms"],
                "missing_concepts": ["Implementation details", "System design"],
                "evidence": "Candidate gave a brief high-level answer without concrete execution steps.",
                "suggested_action": "Return to fundamentals",
                "correct_concepts": [],
                "incorrect_concepts": [],
                "mentioned_tradeoffs": [],
                "missing_tradeoffs": ["Implementation details", "System design"],
                "implementation_evidence": [],
                "recommended_followup_type": "CLARIFICATION",
                "recommended_focus": "the underlying mechanism and how it actually works",
                "interesting_threads": [
                    {
                        "hook": "unclear concepts",
                        "direction": "clarify",
                        "question_seed": "Could you clarify exactly what components were involved in that process and how they communicated?",
                        "curriculum_area": "fundamentals"
                    }
                ]
            }

        if schema_type == "feedback":
            return self._demo_feedback()

        return {"overall_score": 84, "summary": "The candidate demonstrated solid technical understanding.", "strengths": [], "gaps": [], "next": []}

    def _demo_difficulty(self, prompt: str) -> str:
        if "difficulty:" in prompt.lower():
            m = re.search(r'Target Difficulty: (\w+)', prompt, re.IGNORECASE)
            if m:
                return m.group(1).lower()
        return "intermediate"

    def _demo_question(self, topic: str, day: int) -> str:
        base = {
            1: "Describe how you would set up a reproducible Python development environment for an AI project and why each piece matters.",
            2: "When would you choose a local LLM over a hosted model for a coding workflow, and what trade-offs does that introduce?",
            3: "Walk me through how you would connect a React frontend to a FastAPI backend and what failures you would guard against.",
            4: "How would you process and store a mixture of structured and unstructured data into a knowledge base, and how do you keep it maintainable?",
            5: "How do you choose the right chunking strategy for a knowledge base, and what happens when chunks are too large or too small?",
            6: "Explain how text is converted into vector embeddings and how you would evaluate whether similar concepts cluster together.",
            7: "What is the role of a vector database in a RAG application, and how would you choose between a local and a managed solution?",
            8: "How would you evaluate retrieval quality and metadata filtering when populating a vector index?",
            9: "Design a query router that decides between SQL, vector search, and hybrid retrieval. What signals drive the routing decision?",
            10: "How do you decide whether a poor RAG response stems from retrieval failure or LLM generation failure?",
            11: "Compare zero-shot, few-shot, and chain-of-thought prompting. When is each the right tool?",
            12: "How would you enforce structured outputs using function calling, and what validation would you add?",
            13: "When is fine-tuning more appropriate than prompting or RAG, and how would you measure the improvement?",
            14: "What are the practical differences between LoRA and full fine-tuning, and how would you evaluate the fine-tuned model?",
            15: "Design a /chat API endpoint for an agentic chatbot. How would you manage sessions and conversation history?",
            16: "How would you implement streaming responses, and how do you handle interrupted streams gracefully?",
            17: "How would you make LLM outputs trustworthy with citations and structured response cards?",
            18: "How do you manage long conversation memory while respecting token limits?",
            19: "Convert a function-calling workflow into a reasoning agent. What makes it an agent rather than a script?",
            20: "How would you design a router agent that delegates requests to specialized sub-agents?",
            21: "What problem does the Model Context Protocol solve, and how would you expose tools through an MCP server?",
            22: "How would you make an agentic pipeline reliable with retries, timeouts, and graceful degradation?",
            23: "How would you build a benchmark to evaluate a chatbot for accuracy, grounding, and consistency?",
            24: "How would you optimize token usage and latency while keeping response quality?",
            25: "How would you defend an LLM pipeline against prompt injection and data exfiltration?",
            26: "How would you containerize and deploy the stack, and what health checks matter?",
            27: "What metrics would you monitor in production to detect retrieval degradation?",
            28: "How would you run end-to-end production testing before a release?",
            29: "Walk me through your capstone architecture and the key engineering trade-offs you made.",
            30: "If your vector search returns semantically similar but factually irrelevant documents, how would you diagnose whether the problem is chunking, embeddings, or retrieval configuration?",
        }
        if day in base:
            return base[day]
        return "How would you architect a production-grade AI system that integrates retrieval, agents, and evaluation, and what are the most important trade-offs?"

    def _demo_feedback(self) -> Dict[str, Any]:
        return {
            "overall_score": 84,
            "category_scores": [
                {"category": "Technical Understanding", "score": 86},
                {"category": "System Design", "score": 80},
                {"category": "Practical Knowledge", "score": 85},
                {"category": "Communication", "score": 85},
            ],
            "topic_scores": [
                {"topic": "RAG Systems", "day": 8, "score": 88, "status": "Mastered"},
                {"topic": "Vector Databases", "day": 9, "score": 82, "status": "Developing"},
                {"topic": "Agentic AI", "day": 22, "score": 85, "status": "Mastered"},
            ],
            "strengths": [
                "Strong grasp of RAG retrieval pipelines and embedding-based search.",
                "Clear reasoning when explaining agentic tool-execution loops.",
            ],
            "weaknesses": [
                "Limited depth on retrieval evaluation metrics.",
                "Needs further practice on production observability.",
            ],
            "recommendations": [
                "Practice hybrid retrieval (BM25 + vector) re-ranking implementations.",
                "Review context precision vs recall trade-offs in production RAG.",
            ],
            "interviewer_summary": "The candidate demonstrated solid technical competency in core AI engineering and RAG architecture. With further exposure to production monitoring and evaluation, they are well positioned for an AI engineering role.",
            "traceable_evidence": [],
        }


ai_service = AIProviderService()
