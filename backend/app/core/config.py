from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    APP_NAME: str = "PhantomGate"
    DEBUG: bool = False
    DATABASE_URL: str = "postgresql+asyncpg://phantomgate:phantomgate_secret@localhost:5432/phantomgate"
    REDIS_URL: str = "redis://localhost:6379/0"
    SECRET_KEY: str = "change-me-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60
    OPENAI_API_KEY: str = ""
    OPENAI_MODEL: str = "gpt-4o"

    class Config:
        env_file = ".env"


settings = Settings()
