import os
import json
import re
import time
import requests
from typing import Dict, Any, Optional
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
        return text[start_brace:end_brace+1]
    
    return text

class AIProviderService:
    def __init__(self):
        self.provider = settings.AI_PROVIDER.lower()
        self.api_key = settings.AI_API_KEY
        self.model = settings.AI_MODEL
        self.timeout = settings.AI_TIMEOUT_SECONDS

    def call_ai(self, prompt: str, schema_type: str = "general") -> (Dict[str, Any], bool):
        """
        Executes AI call with retry, timeout, structured parsing, and circuit-breaker fallback.
        Returns tuple: (parsed_json_dict, is_degraded)
        """
        if settings.DEMO_MODE or global_circuit_breaker.is_open or not self.api_key:
            return self._demo_fallback(prompt, schema_type), True

        # Attempt call with 1 retry
        for attempt in range(2):
            try:
                raw_text = self._execute_provider_call(prompt)
                cleaned = clean_json_response(raw_text)
                parsed = json.loads(cleaned)
                global_circuit_breaker.record_success()
                return parsed, False
            except Exception as e:
                print(f"[AI Provider Attempt {attempt+1} Error]: {str(e)}")
                if attempt == 0:
                    time.sleep(0.5)

        global_circuit_breaker.record_failure()
        return self._demo_fallback(prompt, schema_type), True

    def _execute_provider_call(self, prompt: str) -> str:
        if "gemini" in self.provider or "google" in self.provider:
            url = f"https://generativelanguage.googleapis.com/v1beta/models/{self.model}:generateContent?key={self.api_key}"
            payload = {
                "contents": [{"parts": [{"text": prompt}]}],
                "generationConfig": {"temperature": 0.3}
            }
            res = requests.post(url, json=payload, timeout=self.timeout)
            res.raise_for_status()
            data = res.json()
            return data["candidates"][0]["content"]["parts"][0]["text"]
        else:
            # OpenAI / OpenAI-compatible provider fallback
            url = "https://api.openai.com/v1/chat/completions"
            headers = {"Authorization": f"Bearer {self.api_key}", "Content-Type": "application/json"}
            payload = {
                "model": self.model or "gpt-4o",
                "messages": [{"role": "user", "content": prompt}],
                "temperature": 0.3
            }
            res = requests.post(url, headers=headers, json=payload, timeout=self.timeout)
            res.raise_for_status()
            data = res.json()
            return data["choices"][0]["message"]["content"]

    def _demo_fallback(self, prompt: str, schema_type: str) -> Dict[str, Any]:
        """Deterministic fallback responses tailored to prompt type."""
        prompt_lower = prompt.lower()
        
        if "question" in schema_type or "generate a clear" in prompt_lower:
            if "rag" in prompt_lower:
                return {
                    "question": "How would you decide whether a poor RAG response stems from document retrieval failure vs LLM generation failure?",
                    "topic": "Retrieval Augmented Generation",
                    "curriculum_day": 8,
                    "difficulty": "intermediate"
                }
            elif "vector" in prompt_lower or "index" in prompt_lower:
                return {
                    "question": "What specifically would you check if a target document exists in your vector store but fails HNSW nearest-neighbor retrieval?",
                    "topic": "Vector Databases & Indexing Strategies",
                    "curriculum_day": 12,
                    "difficulty": "advanced"
                }
            elif "agent" in prompt_lower or "react" in prompt_lower:
                return {
                    "question": "In a stateful agentic loop, how do you prevent infinite execution loops when an external API tool returns non-fatal error responses?",
                    "topic": "Agentic AI Loops & ReAct Framework",
                    "curriculum_day": 20,
                    "difficulty": "advanced"
                }
            else:
                return {
                    "question": "When designing high-throughput LLM serving infrastructure, what trade-offs govern KV-cache offloading vs tensor parallelism?",
                    "topic": "Production Inference & Serving Infrastructure",
                    "curriculum_day": 28,
                    "difficulty": "advanced"
                }

        if "evaluat" in schema_type or "quality_classification" in prompt_lower:
            # Inspect candidate answer length & content inside prompt
            answer_match = re.search(r'<candidate_answer>([\s\S]*?)</candidate_answer>', prompt, re.IGNORECASE)
            ans_text = answer_match.group(1).strip() if answer_match else ""
            
            length = len(ans_text)
            if length > 180:
                return {
                    "technical_correctness": 9,
                    "depth": 8,
                    "practical_understanding": 9,
                    "engineering_reasoning": 8,
                    "communication": 9,
                    "quality_classification": "Strong",
                    "strengths": ["Demonstrates thorough understanding of production trade-offs", "Clear explanation of architectural components"],
                    "weaknesses": ["Could elaborate slightly more on retrieval evaluation metrics"],
                    "missing_concepts": [],
                    "evidence": "Candidate provided detailed response covering core mechanisms and production constraints.",
                    "suggested_action": "Increase difficulty to advanced architecture"
                }
            elif length > 60:
                return {
                    "technical_correctness": 7,
                    "depth": 6,
                    "practical_understanding": 7,
                    "engineering_reasoning": 6,
                    "communication": 8,
                    "quality_classification": "Partial",
                    "strengths": ["Good high-level conceptual clarity"],
                    "weaknesses": ["Lacks concrete implementation detail for edge-cases"],
                    "missing_concepts": ["Failure mode handling", "Quantization trade-offs"],
                    "evidence": "Candidate explained main concept but omitted production edge-cases.",
                    "suggested_action": "Probe deeper into missing concept"
                }
            else:
                return {
                    "technical_correctness": 4,
                    "depth": 3,
                    "practical_understanding": 4,
                    "engineering_reasoning": 3,
                    "communication": 5,
                    "quality_classification": "Weak",
                    "strengths": ["Recognizes basic terminology"],
                    "weaknesses": ["Superficial explanation without technical mechanisms"],
                    "missing_concepts": ["Implementation details", "System metrics"],
                    "evidence": "Candidate gave a brief high-level answer without concrete execution steps.",
                    "suggested_action": "Ask simpler diagnostic question"
                }

        if "followup" in schema_type or "follow-up" in prompt_lower:
            return {
                "question": "What specific metrics or log signals would you check if that exact vector retrieval failure occurred under high concurrent load?",
                "topic": "Retrieval Augmented Generation",
                "curriculum_day": 8,
                "difficulty": "intermediate",
                "followup_label": "Let's go one level deeper."
            }

        # Default Final Feedback Schema Fallback
        return {
            "overall_score": 84,
            "category_scores": [
                { "category": "Technical Understanding", "score": 86 },
                { "category": "System Design", "score": 80 },
                { "category": "Practical Knowledge", "score": 85 },
                { "category": "Communication", "score": 85 }
            ],
            "topic_scores": [
                { "topic": "RAG Systems", "day": 8, "score": 88, "status": "Mastered" },
                { "topic": "Vector Databases", "day": 12, "score": 82, "status": "Developing" },
                { "topic": "Agentic AI", "day": 20, "score": 85, "status": "Mastered" }
            ],
            "strengths": [
                "Strong grasp of RAG vector retrieval pipelines and distance metrics.",
                "Clear communication when explaining agentic tool-execution loops."
            ],
            "weaknesses": [
                "Limited depth on retrieval evaluation metrics (Ragas / TruLens context precision).",
                "Needs further practice on production KV-cache offloading strategies."
            ],
            "recommendations": [
                "Practice BM25 + Vector hybrid search re-ranking implementations.",
                "Review context precision vs recall trade-offs in enterprise RAG pipelines."
            ],
            "interviewer_summary": "The candidate demonstrated solid technical competency in core LLM engineering and RAG architectures. With further exposure to production monitoring and evaluation frameworks, they will excel in senior AI engineering roles.",
            "traceable_evidence": []
        }

ai_service = AIProviderService()
