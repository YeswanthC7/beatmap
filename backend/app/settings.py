import os

from dotenv import load_dotenv

load_dotenv()


class Settings:
    youtube_api_key: str = os.getenv("YOUTUBE_API_KEY", "")


settings = Settings()
