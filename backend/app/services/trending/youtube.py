import logging
from typing import Any

import httpx

from app.api.schemas import TrendingLanguage, TrendingResponse, TrendingTrack
from app.settings import settings

logger = logging.getLogger(__name__)

# YouTube Data API v3 region codes per language tab
LANGUAGE_REGION: dict[str, dict[str, str]] = {
    "worldwide": {"regionCode": "US"},
    "english":   {"regionCode": "US"},
    "hindi":     {"regionCode": "IN"},
    "telugu":    {"regionCode": "IN"},
    "tamil":     {"regionCode": "IN"},
    "spanish":   {"regionCode": "ES"},
    "korean":    {"regionCode": "KR"},
    "japanese":  {"regionCode": "JP"},
}

MUSIC_CATEGORY_ID = "10"

CURATED_FALLBACK: dict[str, list[dict]] = {
    "worldwide": [
        {"title": "Blinding Lights", "artist": "The Weeknd", "trendLabel": "steady"},
        {"title": "Shape of You", "artist": "Ed Sheeran", "trendLabel": "steady"},
        {"title": "Levitating", "artist": "Dua Lipa", "trendLabel": "steady"},
        {"title": "Stay", "artist": "The Kid LAROI & Justin Bieber", "trendLabel": "steady"},
        {"title": "Peaches", "artist": "Justin Bieber", "trendLabel": "steady"},
        {"title": "Good 4 U", "artist": "Olivia Rodrigo", "trendLabel": "steady"},
        {"title": "Montero", "artist": "Lil Nas X", "trendLabel": "steady"},
        {"title": "Leave The Door Open", "artist": "Bruno Mars & Anderson .Paak", "trendLabel": "steady"},
        {"title": "Save Your Tears", "artist": "The Weeknd", "trendLabel": "steady"},
        {"title": "Butter", "artist": "BTS", "trendLabel": "steady"},
    ],
    "hindi": [
        {"title": "Kesariya", "artist": "Arijit Singh", "trendLabel": "steady"},
        {"title": "Raataan Lambiyan", "artist": "Jubin Nautiyal", "trendLabel": "steady"},
        {"title": "Tum Se Hi", "artist": "Mohit Chauhan", "trendLabel": "steady"},
        {"title": "Tera Yaar Hoon Main", "artist": "Arijit Singh", "trendLabel": "steady"},
        {"title": "Dil Chahte Ho", "artist": "Jubin Nautiyal", "trendLabel": "steady"},
        {"title": "O Maahi", "artist": "Arijit Singh", "trendLabel": "steady"},
        {"title": "Chaleya", "artist": "Arijit Singh", "trendLabel": "rising"},
        {"title": "Jhoome Jo Pathaan", "artist": "Arijit Singh", "trendLabel": "steady"},
        {"title": "Besharam Rang", "artist": "Caralisa Monteiro", "trendLabel": "steady"},
        {"title": "Ik Vaari Aa", "artist": "Arijit Singh", "trendLabel": "steady"},
    ],
    "telugu": [
        {"title": "Naatu Naatu", "artist": "M. M. Keeravaani", "trendLabel": "rising"},
        {"title": "Saami Saami", "artist": "Mounika Yadav", "trendLabel": "steady"},
        {"title": "Srivalli", "artist": "Sid Sriram", "trendLabel": "steady"},
        {"title": "Oo Antava", "artist": "Indravathi Chauhan", "trendLabel": "steady"},
        {"title": "Buttabomma", "artist": "Armaan Malik", "trendLabel": "steady"},
        {"title": "Daari Chuse Manishi", "artist": "Sid Sriram", "trendLabel": "steady"},
        {"title": "Ninna Ninna", "artist": "Dhanunjay", "trendLabel": "steady"},
        {"title": "Kalaavathi", "artist": "Sid Sriram", "trendLabel": "rising"},
        {"title": "Butta Bomma", "artist": "Armaan Malik", "trendLabel": "steady"},
        {"title": "Ramuloo Ramulaa", "artist": "Anurag Kulkarni", "trendLabel": "steady"},
    ],
    "tamil": [
        {"title": "Kannaana Kanney", "artist": "D. Imman", "trendLabel": "steady"},
        {"title": "Rowdy Baby", "artist": "Dhanush", "trendLabel": "steady"},
        {"title": "Vaathi Coming", "artist": "Anirudh Ravichander", "trendLabel": "rising"},
        {"title": "Arabic Kuthu", "artist": "Anirudh Ravichander", "trendLabel": "steady"},
        {"title": "Enjoy Enjaami", "artist": "Dhee", "trendLabel": "steady"},
        {"title": "Kannazhaga", "artist": "Dhibu Ninan Thomas", "trendLabel": "steady"},
        {"title": "Vaan Varuvaan", "artist": "A.R. Rahman", "trendLabel": "steady"},
        {"title": "Naan Un", "artist": "Leon James", "trendLabel": "steady"},
        {"title": "Neethane", "artist": "Yuvan Shankar Raja", "trendLabel": "steady"},
        {"title": "Saranga Dariya", "artist": "Mangli", "trendLabel": "steady"},
    ],
    "spanish": [
        {"title": "Tití Me Preguntó", "artist": "Bad Bunny", "trendLabel": "steady"},
        {"title": "Ojitos Lindos", "artist": "Bad Bunny & Bomba Estéreo", "trendLabel": "steady"},
        {"title": "Me Porto Bonito", "artist": "Bad Bunny", "trendLabel": "steady"},
        {"title": "La Bachata", "artist": "Manuel Turizo", "trendLabel": "rising"},
        {"title": "Todo De Ti", "artist": "Rauw Alejandro", "trendLabel": "steady"},
        {"title": "Ella Baila Sola", "artist": "Eslabon Armado & Peso Pluma", "trendLabel": "rising"},
        {"title": "Quevedo: Bzrp Music Sessions", "artist": "Bizarrap", "trendLabel": "steady"},
        {"title": "MAMIII", "artist": "Becky G & Karol G", "trendLabel": "steady"},
        {"title": "Provenza", "artist": "Karol G", "trendLabel": "steady"},
        {"title": "Hawái", "artist": "Maluma", "trendLabel": "steady"},
    ],
    "korean": [
        {"title": "Dynamite", "artist": "BTS", "trendLabel": "steady"},
        {"title": "Pink Venom", "artist": "BLACKPINK", "trendLabel": "steady"},
        {"title": "Attention", "artist": "NewJeans", "trendLabel": "rising"},
        {"title": "INVU", "artist": "TAEYEON", "trendLabel": "steady"},
        {"title": "After Like", "artist": "IVE", "trendLabel": "steady"},
        {"title": "Hype Boy", "artist": "NewJeans", "trendLabel": "rising"},
        {"title": "LOVE DIVE", "artist": "IVE", "trendLabel": "steady"},
        {"title": "That That", "artist": "PSY feat. SUGA of BTS", "trendLabel": "steady"},
        {"title": "Antifragile", "artist": "LE SSERAFIM", "trendLabel": "rising"},
        {"title": "Nxde", "artist": "(G)I-DLE", "trendLabel": "steady"},
    ],
    "japanese": [
        {"title": "Pretender", "artist": "Official HIGE DANdism", "trendLabel": "steady"},
        {"title": "Dynamite", "artist": "BTS", "trendLabel": "steady"},
        {"title": "Subtitle", "artist": "Official HIGE DANdism", "trendLabel": "steady"},
        {"title": "Night Dancer", "artist": "imase", "trendLabel": "rising"},
        {"title": "Idol", "artist": "YOASOBI", "trendLabel": "rising"},
        {"title": "Racing Into The Night", "artist": "YOASOBI", "trendLabel": "steady"},
        {"title": "Koi", "artist": "Gen Hoshino", "trendLabel": "steady"},
        {"title": "Ue wo Muite Arukō", "artist": "Kyu Sakamoto", "trendLabel": "steady"},
        {"title": "Homura", "artist": "LiSA", "trendLabel": "steady"},
        {"title": "Gurenge", "artist": "LiSA", "trendLabel": "steady"},
    ],
    "english": [
        {"title": "As It Was", "artist": "Harry Styles", "trendLabel": "steady"},
        {"title": "Heat Waves", "artist": "Glass Animals", "trendLabel": "steady"},
        {"title": "Anti-Hero", "artist": "Taylor Swift", "trendLabel": "rising"},
        {"title": "Flowers", "artist": "Miley Cyrus", "trendLabel": "rising"},
        {"title": "Unholy", "artist": "Sam Smith & Kim Petras", "trendLabel": "steady"},
        {"title": "Calm Down", "artist": "Rema & Selena Gomez", "trendLabel": "steady"},
        {"title": "Rich Flex", "artist": "Drake & 21 Savage", "trendLabel": "steady"},
        {"title": "Harry's House", "artist": "Harry Styles", "trendLabel": "steady"},
        {"title": "Break My Soul", "artist": "Beyoncé", "trendLabel": "steady"},
        {"title": "About Damn Time", "artist": "Lizzo", "trendLabel": "steady"},
    ],
}


def _build_youtube_url(video_id: str) -> str:
    return f"https://www.youtube.com/watch?v={video_id}"


def _make_thumbnail(video_id: str) -> str:
    return f"https://i.ytimg.com/vi/{video_id}/hqdefault.jpg"


async def fetch_trending_tracks(language: str = "worldwide", limit: int = 10) -> TrendingResponse:
    """Fetch trending music tracks. Uses YouTube API if key available, falls back to curated list."""
    lang_key = language if language in LANGUAGE_REGION else "worldwide"
    region_params = LANGUAGE_REGION[lang_key]

    if settings.youtube_api_key:
        try:
            return await _fetch_from_youtube(lang_key, region_params, limit)
        except Exception as exc:
            logger.warning("YouTube trending fetch failed: %s — using curated fallback", exc)

    return _build_curated_response(lang_key, limit)


async def _fetch_from_youtube(
    language: str,
    region_params: dict,
    limit: int,
) -> TrendingResponse:
    url = "https://www.googleapis.com/youtube/v3/videos"
    params: dict[str, Any] = {
        "part": "snippet,statistics",
        "chart": "mostPopular",
        "videoCategoryId": MUSIC_CATEGORY_ID,
        "maxResults": min(limit, 20),
        "key": settings.youtube_api_key,
        **region_params,
    }

    async with httpx.AsyncClient(timeout=10.0) as client:
        resp = await client.get(url, params=params)
        resp.raise_for_status()
        data = resp.json()

    tracks = []
    for rank, item in enumerate(data.get("items", []), start=1):
        vid_id = item.get("id", "")
        snippet = item.get("snippet", {})
        title = snippet.get("title", "Unknown")
        channel = snippet.get("channelTitle", "Unknown Artist")
        thumb = (
            snippet.get("thumbnails", {}).get("high", {}).get("url")
            or snippet.get("thumbnails", {}).get("default", {}).get("url")
            or _make_thumbnail(vid_id)
        )

        tracks.append(TrendingTrack(
            id=vid_id,
            rank=rank,
            title=title,
            artist=channel,
            thumbnailUrl=thumb,
            language=language,
            region=region_params.get("regionCode", "US"),
            source="YouTube",
            sourceUrl=_build_youtube_url(vid_id),
            trendLabel="steady",
        ))

    logger.info("Fetched %d trending tracks from YouTube [language=%s]", len(tracks), language)
    return TrendingResponse(language=language, tracks=tracks, cached=False)


def _build_curated_response(language: str, limit: int) -> TrendingResponse:
    fallback_key = language if language in CURATED_FALLBACK else "worldwide"
    items = CURATED_FALLBACK[fallback_key][:limit]

    tracks = [
        TrendingTrack(
            id=f"curated-{language}-{i}",
            rank=i + 1,
            title=item["title"],
            artist=item["artist"],
            thumbnailUrl=None,
            language=language,
            region=LANGUAGE_REGION.get(language, {}).get("regionCode", "US"),
            source="curated",
            sourceUrl=f"https://www.youtube.com/results?search_query={item['title'].replace(' ', '+')}+{item['artist'].replace(' ', '+')}",
            trendLabel=item.get("trendLabel", "steady"),
        )
        for i, item in enumerate(items)
    ]

    logger.info("Returning %d curated trending tracks [language=%s]", len(tracks), language)
    return TrendingResponse(language=language, tracks=tracks, cached=True)
