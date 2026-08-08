import os

class Settings:
    PROJECT_NAME: str = "Interview Agent"
    VERSION: str = "1.0.0"
    API_PREFIX: str = "/api/v1"
    
    AI_PROVIDER: str = os.getenv("AI_PROVIDER", "demo")
    AI_API_KEY: str = os.getenv("AI_API_KEY", "")
    AI_MODEL: str = os.getenv("AI_MODEL", "gemini-1.5-flash")
    AI_TIMEOUT_SECONDS: float = float(os.getenv("AI_TIMEOUT_SECONDS", "15"))
    DEMO_MODE: bool = os.getenv("DEMO_MODE", "true").lower() in ("true", "1", "t")
    
    CORS_ALLOWED_ORIGINS: list = [
        origin.strip() for origin in os.getenv("CORS_ALLOWED_ORIGINS", "http://localhost:5173,http://127.0.0.1:5173,*").split(",")
    ]
    DATABASE_DIR: str = os.getenv("DATABASE_DIR", "backend/data/interviews")
    DATABASE_PATH: str = os.path.join(os.getenv("DATABASE_DIR", "backend/data/interviews"), "interviews.sqlite")

settings = Settings()
