import os

from dotenv import load_dotenv

load_dotenv()


class Settings:
    youtube_api_key: str = os.getenv("YOUTUBE_API_KEY", "")
    gemini_api_key: str = os.getenv("GEMINI_API_KEY", "") or os.getenv("GOOGLE_API_KEY", "")
    db_path: str = os.getenv("DB_PATH", "beatmap.db")

    @property
    def has_gemini(self) -> bool:
        return bool(self.gemini_api_key)

    @property
    def has_youtube(self) -> bool:
        return bool(self.youtube_api_key)


settings = Settings()
