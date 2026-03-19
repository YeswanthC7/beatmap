import httpx

from app.api.youtube_schemas import YouTubeVideoMetadata
from app.settings import settings


async def fetch_youtube_video_metadata(
    video_id: str,
) -> YouTubeVideoMetadata | None:
    if not settings.youtube_api_key:
        print("YouTube metadata fetch skipped: missing YOUTUBE_API_KEY")
        return None

    url = "https://www.googleapis.com/youtube/v3/videos"
    params = {
        "part": "snippet",
        "id": video_id,
        "key": settings.youtube_api_key,
    }

    async with httpx.AsyncClient(timeout=10.0) as client:
        response = await client.get(url, params=params)

    print("YouTube API status:", response.status_code)
    print("YouTube API response:", response.text)

    if response.status_code != 200:
        return None

    data = response.json()
    items = data.get("items", [])

    if not items:
        print("YouTube metadata fetch returned no items for video_id:", video_id)
        return None

    snippet = items[0].get("snippet", {})
    thumbnails = snippet.get("thumbnails", {})
    high_thumbnail = thumbnails.get("high") or thumbnails.get("default") or {}

    return YouTubeVideoMetadata(
        video_id=video_id,
        title=snippet.get("title", "Unknown Title"),
        channel_title=snippet.get("channelTitle", "Unknown Channel"),
        thumbnail_url=high_thumbnail.get("url"),
    )
