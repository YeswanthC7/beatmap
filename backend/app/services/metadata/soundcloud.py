import logging

import httpx
from pydantic import BaseModel

logger = logging.getLogger(__name__)

OEMBED_URL = "https://soundcloud.com/oembed"


class SoundCloudMetadata(BaseModel):
    title: str
    artist: str
    thumbnail_url: str | None = None
    track_url: str


def _parse_artist_title(raw_title: str, author_name: str) -> tuple[str, str]:
    """SoundCloud oEmbed title is often 'Artist - Track Title'. Try to split it."""
    if " - " in raw_title:
        parts = raw_title.split(" - ", 1)
        return parts[0].strip(), parts[1].strip()
    return author_name, raw_title


async def fetch_soundcloud_metadata(url: str) -> SoundCloudMetadata | None:
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get(
                OEMBED_URL,
                params={"url": url, "format": "json"},
            )
    except httpx.RequestError as exc:
        logger.error("SoundCloud oEmbed request failed: %s", exc)
        return None

    if response.status_code != 200:
        logger.warning(
            "SoundCloud oEmbed returned %s for url=%s", response.status_code, url
        )
        return None

    try:
        data = response.json()
    except Exception:
        logger.error("Failed to parse SoundCloud oEmbed response")
        return None

    raw_title = data.get("title", "Unknown Track")
    author_name = data.get("author_name", "Unknown Artist")
    thumbnail_url = data.get("thumbnail_url") or None

    artist, title = _parse_artist_title(raw_title, author_name)

    return SoundCloudMetadata(
        title=title,
        artist=artist,
        thumbnail_url=thumbnail_url,
        track_url=url,
    )
