import logging

import httpx
from pydantic import BaseModel

from app.settings import settings

logger = logging.getLogger(__name__)


class YouTubeMetadata(BaseModel):
    video_id: str
    title: str
    channel_title: str
    thumbnail_url: str | None = None
    duration_iso: str | None = None


async def fetch_youtube_metadata(video_id: str) -> YouTubeMetadata | None:
    if not settings.has_youtube:
        logger.warning("YouTube metadata fetch skipped: missing YOUTUBE_API_KEY")
        return None

    params = {
        "part": "snippet,contentDetails",
        "id": video_id,
        "key": settings.youtube_api_key,
    }

    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get(
                "https://www.googleapis.com/youtube/v3/videos",
                params=params,
            )
    except httpx.RequestError as exc:
        logger.error("YouTube API request failed: %s", exc)
        return None

    if response.status_code != 200:
        logger.error("YouTube API returned %s: %s", response.status_code, response.text)
        return None

    data = response.json()
    items = data.get("items", [])

    if not items:
        logger.warning("YouTube API returned no items for video_id=%s", video_id)
        return None

    item = items[0]
    snippet = item.get("snippet", {})
    content_details = item.get("contentDetails", {})
    thumbnails = snippet.get("thumbnails", {})
    thumbnail = (
        thumbnails.get("maxres")
        or thumbnails.get("high")
        or thumbnails.get("medium")
        or thumbnails.get("default")
        or {}
    )

    return YouTubeMetadata(
        video_id=video_id,
        title=snippet.get("title", "Unknown Title"),
        channel_title=snippet.get("channelTitle", "Unknown Channel"),
        thumbnail_url=thumbnail.get("url"),
        duration_iso=content_details.get("duration"),
    )
