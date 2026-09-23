import os
from pathlib import Path

from pydantic_settings import BaseSettings

BASE_DIR = Path(__file__).resolve().parents[3]
if not (BASE_DIR / ".env").exists():
    BASE_DIR = Path(__file__).resolve().parents[2]

DATABASE_DIR = BASE_DIR / "database"
DATABASE_DIR.mkdir(parents=True, exist_ok=True)


class Settings(BaseSettings):
    app_name: str = "ProductPersona AI"
    app_env: str = "development"
    database_url: str = f"sqlite:///{DATABASE_DIR / 'gamepersona.db'}"
    groq_api_key: str | None = None
    groq_model: str = "openai/gpt-oss-20b"
    gemini_api_key: str | None = None
    gemini_model: str = "gemini-3.5-flash"
    openrouter_api_key: str | None = None
    openrouter_model: str = "openai/gpt-4o-mini"
    frontend_url: str = "http://localhost:5173"

    class Config:
        env_file = BASE_DIR / ".env"
        extra = "ignore"


settings = Settings()
