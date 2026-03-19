from pydantic import BaseModel


class YouTubeVideoMetadata(BaseModel):
    video_id: str
    title: str
    channel_title: str
    thumbnail_url: str | None = None
