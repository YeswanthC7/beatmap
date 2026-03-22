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

PRESET_CONTEXT: dict[str, str] = {
    "instagram_reel": "The creator wants a punchy Instagram Reel (15-30s). Prioritise fast hooks and high-energy opening moments.",
    "tiktok_short": "The creator is making a TikTok short. Recommend the most attention-grabbing 15-30 second window and a strong opening beat.",
    "youtube_intro": "The creator needs a YouTube channel intro (10-20s). Suggest a dramatic opener with strong musical identity.",
    "travel_montage": "The creator is making a travel montage. Favour sweeping builds, scenic emotional peaks, and cinematic transitions.",
    "product_ad": "The creator is making a product advertisement. Favour clean intros, a clear reveal window, and a punchy CTA-friendly outro.",
    "fashion_luxury": "The creator is making a fashion or luxury brand video. Favour smooth, elegant builds, cool atmospheric sections.",
    "emotional_story": "The creator is making an emotional storytelling piece. Favour gentle builds, emotional peaks, and reflective quiet sections.",
    "wedding_memory": "The creator is making a wedding or memory edit. Favour warm, gentle, romantic sections and emotional payoff moments.",
    "gym_hype": "The creator is making a gym or hype edit. Favour hard-hitting drops, intense energy peaks, and driving rhythmic sections.",
    "podcast_intro": "The creator needs a podcast intro (5-15s). Favour clean, professional, not overpowering opening sections.",
    "documentary": "The creator is making a documentary or cinematic film. Favour atmospheric builds, tension, and emotional arcs.",
    "gaming_montage": "The creator is making a gaming montage. Favour intense action beats, rapid energy peaks, and dramatic finishes.",
    "vlog": "The creator is making a vlog. Favour upbeat, casual, friendly sections that don't overpower speech.",
    "slideshow": "The creator is making a slideshow or memories video. Favour gentle, nostalgic, unhurried sections with emotional warmth.",
    "general": "General edit — provide balanced recommendations suitable for most creative uses.",
}

ANALYSIS_SCHEMA = """
{
  "summary": "<2-3 sentences about the song's character and recommended creative uses for the selected edit type>",
  "moodShifts": [
    {"time": "MM:SS", "label": "<short label>", "intensity": "low|medium|high", "description": "<1-2 practical sentences about this segment>"}
  ],
  "hookWindow": {
    "range": {"start": "MM:SS", "end": "MM:SS"},
    "reason": "<why this is the best opening or payoff moment for the selected edit type>"
  },
  "voiceoverSafeSections": [
    {"range": {"start": "MM:SS", "end": "MM:SS"}, "safetyLevel": "great|okay|risky", "reason": "<practical reason why narration works or doesn't work here>"}
  ],
  "sceneFits": [
    {
      "category": "<one of: intro|reveal|montage|workout_peak|end_card|boss_fight|night_drive|study_focus>",
      "confidence": 0.0,
      "reason": "<specific practical reason>",
      "bestRange": {"start": "MM:SS", "end": "MM:SS"}
    }
  ],
  "bestCuts": [
    {"durationLabel": "15 seconds", "start": "MM:SS", "end": "MM:SS", "title": "<short memorable title>", "reason": "<why this 15s window is the best for the edit type>", "confidence": 0.85},
    {"durationLabel": "30 seconds", "start": "MM:SS", "end": "MM:SS", "title": "<short memorable title>", "reason": "<why this 30s window is the best>", "confidence": 0.85},
    {"durationLabel": "45 seconds", "start": "MM:SS", "end": "MM:SS", "title": "<short memorable title>", "reason": "<why this 45s window is the best>", "confidence": 0.80}
  ],
  "shotPlan": [
    {"label": "<step name e.g. Opening hook>", "start": "MM:SS", "end": "MM:SS", "visualPurpose": "<e.g. Grab attention fast>", "explanation": "<practical editing advice for this window>"}
  ],
  "alternatives": [
    {"title": "<track title>", "artist": "<artist name>", "source": "<library or platform>", "reason": "<specific creative reason for this edit type>"}
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

    voiceover = []
    for vs in data.get("voiceoverSafeSections", []):
        safety = vs.get("safetyLevel", "okay")
        if safety not in ("great", "okay", "risky"):
            safety = "okay"
        voiceover.append({**vs, "safetyLevel": safety})

    best_cuts = []
    for bc in data.get("bestCuts", []):
        conf = max(0.0, min(1.0, float(bc.get("confidence", 0.75))))
        best_cuts.append({**bc, "confidence": conf})

    shot_plan = data.get("shotPlan", [])

    return {
        "summary": data.get("summary", ""),
        "moodShifts": mood_shifts,
        "hookWindow": data.get("hookWindow", {}),
        "voiceoverSafeSections": voiceover,
        "sceneFits": scene_fits,
        "bestCuts": best_cuts,
        "shotPlan": shot_plan,
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
# Public API
# ---------------------------------------------------------------------------

async def analyse_song_from_metadata(
    title: str,
    artist: str,
    platform: str,
    source_label: str,
    preset: str = "general",
) -> tuple[dict | None, str]:
    preset_ctx = PRESET_CONTEXT.get(preset, PRESET_CONTEXT["general"])

    prompt = f"""You are a professional music supervisor and video editor helping everyday creators.

Analyse this song and return creative editing intelligence. Return a JSON object ONLY — no markdown, no extra text.

Song: "{title}"
Artist: {artist}
Platform: {platform}

Edit type context: {preset_ctx}

Requirements:
- moodShifts: 4-6 entries covering the full emotional arc (realistic MM:SS for a 3-4 min song)
- hookWindow: the single best moment for the selected edit type
- voiceoverSafeSections: 2-3 sections with safetyLevel (great/okay/risky) and plain-English reasons
- sceneFits: 3-4 scene categories with confidence 0.0-1.0
- bestCuts: exactly 3 entries — for 15s, 30s, and 45s — with practical reasons for the edit type
- shotPlan: 5-7 sequential steps that describe how to cut a video to this track for the edit type
- alternatives: 2-3 tracks from open/free libraries (Free Music Archive, ccMixter, Internet Archive)
- Be specific to this song and artist — no generic filler
- All times must be realistic MM:SS strings

Return this exact JSON structure:{ANALYSIS_SCHEMA}"""

    if settings.has_groq:
        logger.info("Using Groq (%s) for metadata analysis [preset=%s]", GROQ_MODEL, preset)
        result, reason = await _analyse_via_groq(prompt)
        if result is not None:
            return result, reason
        logger.warning("Groq failed (%s), trying Gemini fallback", reason)

    if settings.has_gemini:
        logger.info("Using Gemini (%s) for metadata analysis", GEMINI_MODEL)
        return await _analyse_via_gemini(prompt)

    return None, "no_key"


async def analyse_audio_file(
    audio_path: Path,
    duration_seconds: float,
    preset: str = "general",
) -> tuple[dict | None, str]:
    client = _get_gemini_client()
    if client is None:
        return None, "no_key"

    preset_ctx = PRESET_CONTEXT.get(preset, PRESET_CONTEXT["general"])

    try:
        from google import genai as _genai
        uploaded = _genai.Client(api_key=settings.gemini_api_key).files.upload(
            file=str(audio_path),
        )
        logger.info("Uploaded audio to Gemini Files API: %s", uploaded.name)
    except Exception as exc:
        logger.error("Failed to upload audio to Gemini: %s", exc)
        return None, "error"

    prompt = f"""You are a professional music supervisor and video editor helping creators.

Analyse this audio clip (approximately {duration_seconds:.1f} seconds).
Edit type context: {preset_ctx}

Return a JSON object ONLY — no markdown, no extra text.

Requirements:
- moodShifts: actual timing from the audio (3-5 entries)
- hookWindow: the actual strongest moment for the edit type
- voiceoverSafeSections: actual quiet segments with safetyLevel (great/okay/risky)
- sceneFits: 3-4 categories with realistic confidence
- bestCuts: 3 entries for 15s, 30s, 45s (within the {duration_seconds:.1f}s duration)
- shotPlan: 5-7 sequential editing steps for the selected edit type
- alternatives: 2-3 tracks from open/free libraries
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
