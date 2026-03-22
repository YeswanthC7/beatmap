import logging
from pathlib import Path
from urllib.parse import urlparse

from app.api.link_utils import detect_platform
from app.api.schemas import (
    AlternativeTrack,
    AnalysisMode,
    HookWindow,
    MoodShift,
    SceneFitSuggestion,
    SongAnalysisResult,
    TimeRange,
    VoiceoverSafeSection,
)
from app.api.soundcloud_utils import extract_soundcloud_path
from app.api.youtube_utils import extract_youtube_video_id
from app.services.audio.processor import get_audio_duration
from app.services.gemini.client import analyse_audio_file, analyse_song_from_metadata
from app.services.metadata.soundcloud import fetch_soundcloud_metadata
from app.services.metadata.youtube import fetch_youtube_metadata
from app.services.persistence.db import save_analysis

logger = logging.getLogger(__name__)


def _build_source_label(url: str) -> str:
    parsed = urlparse(url)
    domain = parsed.netloc.replace("www.", "")
    path = parsed.path or "/"
    query = f"?{parsed.query}" if parsed.query else ""
    return f"{domain}{path}{query}"


_FALLBACK_REASONS = {
    "no_key": "AI scene analysis requires an API key — add GROQ_API_KEY or GEMINI_API_KEY in Secrets to enable full intelligence.",
    "quota": "AI API quota is exhausted for today. Analysis will resume when the quota resets (daily at midnight Pacific time).",
    "error": "AI returned an unexpected error. Metadata was fetched successfully; try again shortly.",
}


def _fallback_analysis(
    title: str,
    artist: str,
    failure_reason: str = "no_key",
) -> dict:
    """Return honest placeholder analysis when AI is unavailable."""
    reason_msg = _FALLBACK_REASONS.get(failure_reason, _FALLBACK_REASONS["error"])
    short = "AI scene analysis temporarily unavailable" if failure_reason == "quota" else "AI scene analysis unavailable"

    return {
        "summary": (
            f'Metadata retrieved successfully. {reason_msg}'
        ),
        "moodShifts": [
            {
                "time": "00:00",
                "label": short,
                "intensity": "low",
                "description": reason_msg,
            }
        ],
        "hookWindow": {
            "range": {"start": "00:00", "end": "00:30"},
            "reason": reason_msg,
        },
        "voiceoverSafeSections": [
            {
                "range": {"start": "00:00", "end": "00:30"},
                "reason": reason_msg,
            }
        ],
        "sceneFits": [
            {
                "category": "montage",
                "confidence": 0.5,
                "reason": reason_msg,
                "bestRange": {"start": "00:00", "end": "00:30"},
            }
        ],
        "alternatives": [
            {
                "title": short,
                "artist": "—",
                "source": "Gemini AI",
                "reason": reason_msg,
            }
        ],
    }


def _build_result(
    *,
    song_title: str,
    artist_name: str,
    source: str,
    source_label: str,
    platform: str,
    analysis_mode: AnalysisMode,
    youtube_video_id: str | None,
    soundcloud_path: str | None,
    thumbnail_url: str | None,
    ai: dict,
) -> SongAnalysisResult:
    def tr(d: dict) -> TimeRange:
        return TimeRange(start=d.get("start", "00:00"), end=d.get("end", "00:30"))

    mood_shifts = [
        MoodShift(
            time=ms.get("time", "00:00"),
            label=ms.get("label", ""),
            intensity=ms.get("intensity", "medium"),
            description=ms.get("description", ""),
        )
        for ms in ai.get("moodShifts", [])
    ]

    hook_raw = ai.get("hookWindow", {})
    hook_window = HookWindow(
        range=tr(hook_raw.get("range", {})),
        reason=hook_raw.get("reason", ""),
    )

    voiceover = [
        VoiceoverSafeSection(
            range=tr(vs.get("range", {})),
            reason=vs.get("reason", ""),
        )
        for vs in ai.get("voiceoverSafeSections", [])
    ]

    scene_fits = [
        SceneFitSuggestion(
            category=sf.get("category", "montage"),
            confidence=float(sf.get("confidence", 0.75)),
            reason=sf.get("reason", ""),
            bestRange=tr(sf.get("bestRange", {})),
        )
        for sf in ai.get("sceneFits", [])
    ]

    alternatives = [
        AlternativeTrack(
            title=alt.get("title", ""),
            artist=alt.get("artist", ""),
            source=alt.get("source", ""),
            reason=alt.get("reason", ""),
        )
        for alt in ai.get("alternatives", [])
    ]

    return SongAnalysisResult(
        songTitle=song_title,
        artistName=artist_name,
        source=source,
        sourceLabel=source_label,
        platform=platform,
        analysisMode=analysis_mode,
        youtubeVideoId=youtube_video_id,
        soundcloudPath=soundcloud_path,
        thumbnailUrl=thumbnail_url,
        summary=ai.get("summary", ""),
        moodShifts=mood_shifts,
        hookWindow=hook_window,
        voiceoverSafeSections=voiceover,
        sceneFits=scene_fits,
        alternatives=alternatives,
    )


async def analyse_link(url: str) -> SongAnalysisResult:
    """Full pipeline for link-based analysis (YouTube or SoundCloud)."""
    source_label = _build_source_label(url)
    platform = detect_platform(url)

    song_title = "Unknown Song"
    artist_name = "Unknown Artist"
    thumbnail_url = None
    youtube_video_id = None
    soundcloud_path = None

    if platform == "youtube":
        youtube_video_id = extract_youtube_video_id(url)
        if youtube_video_id:
            meta = await fetch_youtube_metadata(youtube_video_id)
            if meta:
                song_title = meta.title
                artist_name = meta.channel_title
                thumbnail_url = meta.thumbnail_url

    elif platform == "soundcloud":
        soundcloud_path = extract_soundcloud_path(url)
        meta = await fetch_soundcloud_metadata(url)
        if meta:
            song_title = meta.title
            artist_name = meta.artist
            thumbnail_url = meta.thumbnail_url

    logger.info("Analysing '%s' by %s [%s] — metadata_only mode", song_title, artist_name, platform)

    ai, failure_reason = await analyse_song_from_metadata(
        title=song_title,
        artist=artist_name,
        platform=platform,
        source_label=source_label,
    )

    if ai is None:
        ai = _fallback_analysis(song_title, artist_name, failure_reason)

    result = _build_result(
        song_title=song_title,
        artist_name=artist_name,
        source="link",
        source_label=source_label,
        platform=platform,
        analysis_mode="metadata_only",
        youtube_video_id=youtube_video_id,
        soundcloud_path=soundcloud_path,
        thumbnail_url=thumbnail_url,
        ai=ai,
    )

    record_id = await save_analysis(result)
    return result.model_copy(update={"id": record_id})


async def analyse_audio_upload(
    audio_bytes: bytes,
    filename: str,
    original_filename: str = "recording",
) -> SongAnalysisResult:
    """Full pipeline for uploaded/recorded audio analysis."""
    import tempfile
    from app.services.audio.processor import cleanup_temp, save_upload_to_temp

    suffix = Path(filename).suffix or ".webm"
    audio_path = save_upload_to_temp(audio_bytes, suffix=suffix)

    try:
        duration = get_audio_duration(audio_path) or 30.0
        logger.info("Audio upload: file=%s size=%d duration=%.1fs", filename, len(audio_bytes), duration)

        ai, failure_reason = await analyse_audio_file(audio_path, duration)

        if ai is None:
            ai = _fallback_analysis("Recorded Audio", "Unknown Artist", failure_reason)

        result = _build_result(
            song_title="Recorded Audio",
            artist_name="Mic Recording",
            source="mic",
            source_label=f"mic/{original_filename}",
            platform="mic",
            analysis_mode="recorded_audio",
            youtube_video_id=None,
            soundcloud_path=None,
            thumbnail_url=None,
            ai=ai,
        )

        record_id = await save_analysis(result)
        return result.model_copy(update={"id": record_id})

    finally:
        cleanup_temp(audio_path)
