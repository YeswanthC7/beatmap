from pydantic import BaseModel, HttpUrl


class AnalyzeLinkRequest(BaseModel):
    url: HttpUrl


class TimeRange(BaseModel):
    start: str
    end: str


class MoodShift(BaseModel):
    time: str
    label: str
    intensity: str
    description: str


class SceneFitSuggestion(BaseModel):
    category: str
    confidence: float
    reason: str
    bestRange: TimeRange


class VoiceoverSafeSection(BaseModel):
    range: TimeRange
    reason: str


class HookWindow(BaseModel):
    range: TimeRange
    reason: str


class AlternativeTrack(BaseModel):
    title: str
    artist: str
    source: str
    reason: str


class SongAnalysisResult(BaseModel):
    songTitle: str
    artistName: str
    source: str
    sourceLabel: str
    platform: str
    youtubeVideoId: str | None = None
    soundcloudPath: str | None = None
    thumbnailUrl: str | None = None
    summary: str
    moodShifts: list[MoodShift]
    sceneFits: list[SceneFitSuggestion]
    voiceoverSafeSections: list[VoiceoverSafeSection]
    hookWindow: HookWindow
    alternatives: list[AlternativeTrack]
