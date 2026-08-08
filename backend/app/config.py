import os
from dotenv import load_dotenv

BACKEND_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
load_dotenv(os.path.join(BACKEND_DIR, ".env"))


class Settings:
    PROJECT_NAME: str = "Interview Agent"
    VERSION: str = "1.0.0"
    API_PREFIX: str = "/api/v1"

    # LLM Provider: "groq" | "gemini" | "openai" | "demo"
    AI_PROVIDER: str = os.getenv("AI_PROVIDER", "groq")
    # Groq API key (set in .env) — never ship real keys
    GROQ_API_KEY: str = os.getenv("GROQ_API_KEY", "")
    # Generic fallback used by openai/gemini providers
    AI_API_KEY: str = os.getenv("AI_API_KEY", "")
    AI_MODEL: str = os.getenv("AI_MODEL", "llama-3.3-70b-versatile")
    AI_TIMEOUT_SECONDS: float = float(os.getenv("AI_TIMEOUT_SECONDS", "20"))

    # When true (or no API key present) the agent runs in demo mode
    DEMO_MODE: bool = os.getenv("DEMO_MODE", "false").lower() in ("true", "1", "t")

    CORS_ALLOWED_ORIGINS: list = [
        origin.strip()
        for origin in os.getenv("CORS_ALLOWED_ORIGINS", "http://localhost:5173,http://127.0.0.1:5173,http://localhost:5174,http://127.0.0.1:5174,http://localhost:5175,http://127.0.0.1:5175,http://localhost:5176,http://127.0.0.1:5176").split(",")
    ]
    _db_dir = os.getenv("DATABASE_DIR", os.path.join(BACKEND_DIR, "data", "interviews"))
    DATABASE_DIR: str = _db_dir
    DATABASE_PATH: str = os.path.join(_db_dir, "interviews.sqlite")

    # Interview engine rules
    MIN_QUESTIONS: int = int(os.getenv("MIN_QUESTIONS", "8"))
    MIN_CURRICULUM_DAYS: int = int(os.getenv("MIN_CURRICULUM_DAYS", "4"))
    MAX_QUESTIONS: int = int(os.getenv("MAX_QUESTIONS", "12"))
    MAX_FOLLOWUP_DEPTH: int = int(os.getenv("MAX_FOLLOWUP_DEPTH", "2"))


settings = Settings()
