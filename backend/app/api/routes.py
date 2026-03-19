from urllib.parse import urlparse

from fastapi import APIRouter

from app.api.link_utils import detect_platform
from app.api.schemas import AnalyzeLinkRequest, SongAnalysisResult
from app.api.soundcloud_utils import extract_soundcloud_path
from app.api.youtube_client import fetch_youtube_video_metadata
from app.api.youtube_utils import extract_youtube_video_id

router = APIRouter(prefix="/api", tags=["analysis"])


def build_source_label(url: str) -> str:
    parsed_url = urlparse(url)
    domain = parsed_url.netloc.replace("www.", "")
    path = parsed_url.path or "/"
    query = f"?{parsed_url.query}" if parsed_url.query else ""
    return f"{domain}{path}{query}"


@router.post("/analyze/link", response_model=SongAnalysisResult)
async def analyze_song_link(payload: AnalyzeLinkRequest) -> SongAnalysisResult:
    url = str(payload.url)
    source_label = build_source_label(url)
    platform = detect_platform(url)
    youtube_video_id = (
        extract_youtube_video_id(url) if platform == "youtube" else None
    )
    soundcloud_path = (
        extract_soundcloud_path(url) if platform == "soundcloud" else None
    )

    song_title = "Unknown Song"
    artist_name = "Unknown Artist"
    thumbnail_url = None

    if youtube_video_id:
        metadata = await fetch_youtube_video_metadata(youtube_video_id)
        if metadata:
            song_title = metadata.title
            artist_name = metadata.channel_title
            thumbnail_url = metadata.thumbnail_url

    return SongAnalysisResult(
        songTitle=song_title,
        artistName=artist_name,
        source="link",
        sourceLabel=source_label,
        platform=platform,
        youtubeVideoId=youtube_video_id,
        soundcloudPath=soundcloud_path,
        thumbnailUrl=thumbnail_url,
        summary=(
            "Analysis is currently running in demo mode. BeatMap successfully "
            "accepted the link and generated a placeholder scene-fit dossier. "
            "Real song metadata extraction is now connected for YouTube links, "
            "and deeper AI analysis will be connected next."
        ),
        moodShifts=[
            {
                "time": "00:12",
                "label": "Atmospheric build",
                "intensity": "low",
                "description": (
                    "Soft textures and gradual tension make this section "
                    "suitable for intros and establishing shots."
                ),
            },
            {
                "time": "00:38",
                "label": "Momentum lift",
                "intensity": "medium",
                "description": (
                    "Percussion and synth energy increase, making it a good "
                    "fit for transition sequences and movement-heavy visuals."
                ),
            },
            {
                "time": "01:04",
                "label": "Main hook lands",
                "intensity": "high",
                "description": (
                    "The strongest musical payoff arrives here, creating a "
                    "compelling drop point for reveals or emotionally charged edits."
                ),
            },
        ],
        sceneFits=[
            {
                "category": "reveal",
                "confidence": 0.94,
                "reason": (
                    "The delayed build and strong payoff create an ideal setup "
                    "for a product reveal or dramatic visual turn."
                ),
                "bestRange": {
                    "start": "00:58",
                    "end": "01:15",
                },
            },
            {
                "category": "night_drive",
                "confidence": 0.91,
                "reason": (
                    "Steady pulse, wide atmosphere, and controlled energy make "
                    "it feel immersive for late-night motion visuals."
                ),
                "bestRange": {
                    "start": "00:34",
                    "end": "01:10",
                },
            },
            {
                "category": "montage",
                "confidence": 0.88,
                "reason": (
                    "The evolving energy profile supports edits with cuts, "
                    "progression, and visual pacing changes."
                ),
                "bestRange": {
                    "start": "00:24",
                    "end": "01:20",
                },
            },
        ],
        voiceoverSafeSections=[
            {
                "range": {
                    "start": "00:00",
                    "end": "00:18",
                },
                "reason": (
                    "Minimal melodic density leaves room for spoken narration "
                    "without major clashes."
                ),
            },
            {
                "range": {
                    "start": "00:42",
                    "end": "00:54",
                },
                "reason": (
                    "Consistent instrumental backing supports voiceovers "
                    "while maintaining momentum."
                ),
            },
        ],
        hookWindow={
            "range": {
                "start": "01:02",
                "end": "01:13",
            },
            "reason": (
                "This section contains the strongest emotional and rhythmic payoff, "
                "making it ideal for short-form hooks."
            ),
        },
        alternatives=[
            {
                "title": "City Lights Motion",
                "artist": "Aria Vector",
                "source": "Free Music Archive",
                "reason": (
                    "Offers a similar cinematic-electronic rise with a slightly "
                    "softer drop for branded content."
                ),
            },
            {
                "title": "Neon Run",
                "artist": "Static Harbor",
                "source": "Internet Archive",
                "reason": (
                    "Matches the night-drive atmosphere and pulse-driven pacing "
                    "with a more ambient texture."
                ),
            },
        ],
    )
