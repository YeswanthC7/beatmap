import json
import logging
import re
import tempfile
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
    """Extract and parse JSON from a Gemini response, stripping any markdown fences."""
    text = text.strip()
    match = re.search(r"```(?:json)?\s*([\s\S]+?)\s*```", text)
    if match:
        text = match.group(1)
    return json.loads(text)


def _normalize_analysis(data: dict) -> dict:
    """Validate and normalise the raw dict from Gemini."""
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


def _get_model():
    """Return a configured Gemini GenerativeModel, or None if unavailable."""
    if not settings.has_gemini:
        return None
    try:
        import google.generativeai as genai
        genai.configure(api_key=settings.gemini_api_key)
        return genai.GenerativeModel("gemini-2.0-flash")
    except Exception as exc:
        logger.error("Failed to initialise Gemini model: %s", exc)
        return None


async def analyse_song_from_metadata(
    title: str,
    artist: str,
    platform: str,
    source_label: str,
) -> dict | None:
    """Use Gemini to generate scene analysis based on song metadata."""
    model = _get_model()
    if model is None:
        logger.info("Gemini unavailable — skipping metadata analysis")
        return None

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

    try:
        response = model.generate_content(
            prompt,
            generation_config={"response_mime_type": "application/json"},
        )
        data = _parse_json_response(response.text)
        return _normalize_analysis(data)
    except Exception as exc:
        logger.error("Gemini metadata analysis failed: %s", exc)
        return None


async def analyse_audio_file(audio_path: Path, duration_seconds: float) -> dict | None:
    """Use Gemini to analyse an uploaded audio file."""
    if not settings.has_gemini:
        logger.info("Gemini unavailable — skipping audio analysis")
        return None

    try:
        import google.generativeai as genai
        genai.configure(api_key=settings.gemini_api_key)
    except Exception as exc:
        logger.error("Failed to configure Gemini: %s", exc)
        return None

    try:
        uploaded = genai.upload_file(str(audio_path))
        logger.info("Uploaded audio to Gemini: %s", uploaded.name)
    except Exception as exc:
        logger.error("Failed to upload audio to Gemini: %s", exc)
        return None

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

    model = genai.GenerativeModel("gemini-2.0-flash")

    try:
        response = model.generate_content(
            [uploaded, prompt],
            generation_config={"response_mime_type": "application/json"},
        )
        data = _parse_json_response(response.text)
        return _normalize_analysis(data)
    except Exception as exc:
        logger.error("Gemini audio analysis failed: %s", exc)
        return None
    finally:
        try:
            genai.delete_file(uploaded.name)
        except Exception:
            pass
