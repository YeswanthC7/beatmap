from typing import Literal

from pydantic import BaseModel, HttpUrl

EditPreset = Literal[
    "instagram_reel",
    "tiktok_short",
    "youtube_intro",
    "travel_montage",
    "product_ad",
    "fashion_luxury",
    "emotional_story",
    "wedding_memory",
    "gym_hype",
    "podcast_intro",
    "documentary",
    "gaming_montage",
    "vlog",
    "slideshow",
    "general",
]

PRESET_LABELS: dict[str, str] = {
    "instagram_reel": "Instagram Reel",
    "tiktok_short": "TikTok / Short Video",
    "youtube_intro": "YouTube Intro",
    "travel_montage": "Travel Montage",
    "product_ad": "Product Ad",
    "fashion_luxury": "Fashion / Luxury",
    "emotional_story": "Emotional Storytelling",
    "wedding_memory": "Wedding / Memory Edit",
    "gym_hype": "Gym / Hype Edit",
    "podcast_intro": "Podcast Intro",
    "documentary": "Documentary / Cinematic",
    "gaming_montage": "Gaming Montage",
    "vlog": "Vlog",
    "slideshow": "Slideshow / Memories",
    "general": "General Edit",
}


class AnalyzeLinkRequest(BaseModel):
    url: HttpUrl
    preset: EditPreset = "general"


class AnalyzeAudioRequest(BaseModel):
    preset: EditPreset = "general"


class TimeRange(BaseModel):
    start: str
    end: str


class MoodShift(BaseModel):
    time: str
    label: str
    intensity: Literal["low", "medium", "high"]
    description: str


class SceneFitSuggestion(BaseModel):
    category: str
    confidence: float
    reason: str
    bestRange: TimeRange


class VoiceoverSafeSection(BaseModel):
    range: TimeRange
    safetyLevel: Literal["great", "okay", "risky"] = "okay"
    reason: str


class HookWindow(BaseModel):
    range: TimeRange
    reason: str


class BestCut(BaseModel):
    durationLabel: str
    start: str
    end: str
    title: str
    reason: str
    confidence: float = 0.75


class ShotPlanStep(BaseModel):
    label: str
    start: str
    end: str
    visualPurpose: str
    explanation: str


class AlternativeTrack(BaseModel):
    title: str
    artist: str
    source: str
    reason: str


AnalysisMode = Literal["metadata_only", "recorded_audio"]


class SongAnalysisResult(BaseModel):
    id: str | None = None
    songTitle: str
    artistName: str
    source: str
    sourceLabel: str
    platform: str
    preset: EditPreset = "general"
    analysisMode: AnalysisMode = "metadata_only"
    youtubeVideoId: str | None = None
    soundcloudPath: str | None = None
    thumbnailUrl: str | None = None
    summary: str
    moodShifts: list[MoodShift]
    sceneFits: list[SceneFitSuggestion]
    voiceoverSafeSections: list[VoiceoverSafeSection]
    hookWindow: HookWindow
    bestCuts: list[BestCut] = []
    shotPlan: list[ShotPlanStep] = []
    alternatives: list[AlternativeTrack]


class AnalysisRecord(BaseModel):
    id: str
    createdAt: str
    platform: str
    sourceLabel: str
    songTitle: str
    artistName: str
    thumbnailUrl: str | None = None
    analysisMode: AnalysisMode
    preset: EditPreset = "general"


class AnalysisListResponse(BaseModel):
    analyses: list[AnalysisRecord]


class DeleteResponse(BaseModel):
    success: bool
    id: str


# ── Trending ──────────────────────────────────────────────────────────────────

TrendLabel = Literal["new", "rising", "steady"]

TrendingLanguage = Literal[
    "worldwide", "english", "hindi", "telugu", "tamil",
    "spanish", "korean", "japanese",
]


class TrendingTrack(BaseModel):
    id: str
    rank: int
    title: str
    artist: str
    thumbnailUrl: str | None = None
    language: str
    region: str
    source: str
    sourceUrl: str
    trendLabel: TrendLabel = "steady"


class TrendingResponse(BaseModel):
    language: str
    tracks: list[TrendingTrack]
    cached: bool = False


# ── Compare ───────────────────────────────────────────────────────────────────

class CompareRequest(BaseModel):
    urls: list[HttpUrl]
    preset: EditPreset = "general"


class TrackCompareResult(BaseModel):
    rank: int
    songTitle: str
    artistName: str
    thumbnailUrl: str | None = None
    sourceUrl: str
    bestOpeningMoment: str
    best15sCut: str | None = None
    voiceoverSuitability: str
    emotionalPayoff: str
    overallFitScore: float
    overallFitReason: str
    summary: str


class CompareResponse(BaseModel):
    preset: EditPreset
    winnerTitle: str
    winnerReason: str
    tracks: list[TrackCompareResult]
