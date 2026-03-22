import json
import logging
import re
from pathlib import Path

from app.settings import settings

logger = logging.getLogger(__name__)

SCENE_CATEGORIES = (
    "intro", "reveal", "montage", "workout_peak",
    "end_card", "boss_fight", "night_drive", "study_focus",
)

ANALYSIS_SCHEMA = """
{
  "summary": "<2-3 sentences about the song's sonic character, emotional arc, and creative use cases>",
  "moodShifts": [
    {"time": "MM:SS", "label": "<short label>", "intensity": "low|medium|high", "description": "<1-2 sentences about this segment>"}
  ],
  "hookWindow": {
    "range": {"start": "MM:SS", "end": "MM:SS"},
    "reason": "<why this is the strongest moment for short-form content>"
  },
  "voiceoverSafeSections": [
    {"range": {"start": "MM:SS", "end": "MM:SS"}, "reason": "<why narration works here>"}
  ],
  "sceneFits": [
    {
      "category": "<one of: intro|reveal|montage|workout_peak|end_card|boss_fight|night_drive|study_focus>",
      "confidence": 0.0,
      "reason": "<specific reason>",
      "bestRange": {"start": "MM:SS", "end": "MM:SS"}
    }
  ],
  "alternatives": [
    {"title": "<track title>", "artist": "<artist name>", "source": "<library or platform>", "reason": "<specific creative reason>"}
  ]
}"""


def _parse_json_response(text: str) -> dict:
    text = text.strip()
    match = re.search(r"```(?:json)?\s*([\s\S]+?)\s*```", text)
    if match:
        text = match.group(1)
    return json.loads(text)


def _normalize_analysis(data: dict) -> dict:
    valid_categories = set(SCENE_CATEGORIES)

    scene_fits = []
    for sf in data.get("sceneFits", []):
        cat = sf.get("category", "")
        if cat not in valid_categories:
            continue
        confidence = max(0.0, min(1.0, float(sf.get("confidence", 0.75))))
        scene_fits.append({**sf, "category": cat, "confidence": confidence})

    mood_shifts = []
    for ms in data.get("moodShifts", []):
        intensity = ms.get("intensity", "medium")
        if intensity not in ("low", "medium", "high"):
            intensity = "medium"
        mood_shifts.append({**ms, "intensity": intensity})

    return {
        "summary": data.get("summary", ""),
        "moodShifts": mood_shifts,
        "hookWindow": data.get("hookWindow", {}),
        "voiceoverSafeSections": data.get("voiceoverSafeSections", []),
        "sceneFits": scene_fits,
        "alternatives": data.get("alternatives", []),
    }


# ---------------------------------------------------------------------------
# Groq provider
# ---------------------------------------------------------------------------

GROQ_MODEL = "llama-3.3-70b-versatile"


def _is_quota_error_groq(exc: Exception) -> bool:
    msg = str(exc).lower()
    return "429" in msg or "rate_limit" in msg or "quota" in msg


def _get_groq_client():
    if not settings.has_groq:
        return None
    try:
        from groq import Groq
        return Groq(api_key=settings.groq_api_key)
    except Exception as exc:
        logger.error("Failed to initialise Groq client: %s", exc)
        return None


async def _analyse_via_groq(prompt: str) -> tuple[dict | None, str]:
    """Call Groq chat completions and return (result, failure_reason)."""
    client = _get_groq_client()
    if client is None:
        return None, "no_key"
    try:
        response = client.chat.completions.create(
            model=GROQ_MODEL,
            messages=[{"role": "user", "content": prompt}],
            response_format={"type": "json_object"},
            temperature=0.7,
        )
        raw = response.choices[0].message.content or ""
        data = _parse_json_response(raw)
        return _normalize_analysis(data), ""
    except Exception as exc:
        if _is_quota_error_groq(exc):
            logger.warning("Groq rate limit hit: %s", exc)
            return None, "quota"
        logger.error("Groq analysis failed: %s", exc)
        return None, "error"


# ---------------------------------------------------------------------------
# Gemini provider (fallback)
# ---------------------------------------------------------------------------

GEMINI_MODEL = "gemini-2.0-flash-lite"


def _is_quota_error_gemini(exc: Exception) -> bool:
    msg = str(exc).lower()
    return "quota" in msg or "429" in msg or "resource_exhausted" in msg


def _get_gemini_client():
    if not settings.has_gemini:
        return None
    try:
        from google import genai
        return genai.Client(api_key=settings.gemini_api_key)
    except Exception as exc:
        logger.error("Failed to initialise Gemini client: %s", exc)
        return None


async def _analyse_via_gemini(prompt: str) -> tuple[dict | None, str]:
    """Call Gemini and return (result, failure_reason)."""
    client = _get_gemini_client()
    if client is None:
        return None, "no_key"
    try:
        response = client.models.generate_content(
            model=GEMINI_MODEL,
            contents=prompt,
            config={"response_mime_type": "application/json"},
        )
        data = _parse_json_response(response.text)
        return _normalize_analysis(data), ""
    except Exception as exc:
        if _is_quota_error_gemini(exc):
            logger.warning("Gemini quota exceeded: %s", exc)
            return None, "quota"
        logger.error("Gemini analysis failed: %s", exc)
        return None, "error"


# ---------------------------------------------------------------------------
# Public API — try Groq first, fall back to Gemini
# ---------------------------------------------------------------------------

async def analyse_song_from_metadata(
    title: str,
    artist: str,
    platform: str,
    source_label: str,
) -> tuple[dict | None, str]:
    """Generate scene analysis from song metadata.

    Tries Groq first (if GROQ_API_KEY is set), then falls back to Gemini.

    Returns (result_dict, failure_reason) where failure_reason is one of:
      ""        — success
      "no_key"  — no AI key configured
      "quota"   — API quota/rate-limit exhausted
      "error"   — unexpected failure
    """
    prompt = f"""You are a professional music supervisor creating scene-fit analysis for film and video production.

Analyse this song based on your knowledge and return a JSON object ONLY — no markdown, no extra text.

Song: "{title}"
Artist: {artist}
Platform: {platform}

Requirements:
- moodShifts: 4-5 entries covering the full emotional arc (realistic MM:SS times for a typical 3-4 minute song)
- hookWindow: the single strongest short-form payoff moment
- voiceoverSafeSections: 2-3 quiet or sparse segments
- sceneFits: 3-4 scene categories with confidence 0.0-1.0
- alternatives: 2-3 tracks from open/free libraries (Free Music Archive, ccMixter, Internet Archive, Epidemic Sound)
- Be specific to this song and artist — no generic filler
- Times must be realistic MM:SS strings

Return this exact JSON structure:{ANALYSIS_SCHEMA}"""

    if settings.has_groq:
        logger.info("Using Groq (%s) for metadata analysis", GROQ_MODEL)
        result, reason = await _analyse_via_groq(prompt)
        if result is not None:
            return result, reason
        logger.warning("Groq failed (%s), trying Gemini fallback", reason)

    if settings.has_gemini:
        logger.info("Using Gemini (%s) for metadata analysis", GEMINI_MODEL)
        return await _analyse_via_gemini(prompt)

    return None, "no_key"


async def analyse_audio_file(audio_path: Path, duration_seconds: float) -> tuple[dict | None, str]:
    """Analyse an uploaded audio file.

    Groq does not support audio uploads, so this uses Gemini only.
    Returns (result_dict, failure_reason).
    """
    client = _get_gemini_client()
    if client is None:
        logger.info("Gemini unavailable — skipping audio analysis")
        return None, "no_key"

    try:
        from google import genai as _genai
        uploaded = _genai.Client(api_key=settings.gemini_api_key).files.upload(
            file=str(audio_path),
        )
        logger.info("Uploaded audio to Gemini Files API: %s", uploaded.name)
    except Exception as exc:
        logger.error("Failed to upload audio to Gemini: %s", exc)
        return None, "error"

    prompt = f"""You are a professional music supervisor analysing a recorded audio clip for scene-fit use in film, video, and content production.

The user submitted a recording of approximately {duration_seconds:.1f} seconds.

Listen to the audio carefully and generate a scene-fit analysis. Return a JSON object ONLY — no markdown, no extra text.

Requirements:
- moodShifts: use actual timing from the audio (3-5 entries)
- hookWindow: the actual strongest moment you hear
- voiceoverSafeSections: actual quiet or sparse segments
- sceneFits: 3-4 scene categories with realistic confidence
- alternatives: 2-3 tracks from open/free libraries with specific reasons
- All MM:SS times must be within the {duration_seconds:.1f} second duration

Return this exact JSON structure:{ANALYSIS_SCHEMA}"""

    try:
        from google.genai import types as genai_types
        response = client.models.generate_content(
            model=GEMINI_MODEL,
            contents=[
                genai_types.Part.from_uri(file_uri=uploaded.uri, mime_type=uploaded.mime_type or "audio/webm"),
                prompt,
            ],
            config={"response_mime_type": "application/json"},
        )
        data = _parse_json_response(response.text)
        return _normalize_analysis(data), ""
    except Exception as exc:
        if _is_quota_error_gemini(exc):
            logger.warning("Gemini quota exceeded during audio analysis: %s", exc)
            return None, "quota"
        logger.error("Gemini audio analysis failed: %s", exc)
        return None, "error"
    finally:
        try:
            client.files.delete(name=uploaded.name)
        except Exception:
            pass
