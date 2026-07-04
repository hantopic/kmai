from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    PROJECT_NAME: str = "KMAI Platform"
    API_V1_PREFIX: str = "/api/v1"
    VERSION: str = "0.1.0"


settings = Settings()
