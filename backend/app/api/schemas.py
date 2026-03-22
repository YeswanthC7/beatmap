from typing import Literal

from pydantic import BaseModel, HttpUrl


class AnalyzeLinkRequest(BaseModel):
    url: HttpUrl


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
    reason: str


class HookWindow(BaseModel):
    range: TimeRange
    reason: str


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
    analysisMode: AnalysisMode = "metadata_only"
    youtubeVideoId: str | None = None
    soundcloudPath: str | None = None
    thumbnailUrl: str | None = None
    summary: str
    moodShifts: list[MoodShift]
    sceneFits: list[SceneFitSuggestion]
    voiceoverSafeSections: list[VoiceoverSafeSection]
    hookWindow: HookWindow
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


class AnalysisListResponse(BaseModel):
    analyses: list[AnalysisRecord]


class DeleteResponse(BaseModel):
    success: bool
    id: str
