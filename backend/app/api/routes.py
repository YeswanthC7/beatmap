import logging

from fastapi import APIRouter, Form, HTTPException, UploadFile

from app.api.schemas import (
    AnalysisListResponse,
    AnalyzeLinkRequest,
    CompareRequest,
    CompareResponse,
    DeleteResponse,
    SongAnalysisResult,
    TrendingLanguage,
    TrendingResponse,
)
from app.services.comparison.compare import compare_tracks
from app.services.orchestration.analyzer import analyse_audio_upload, analyse_link
from app.services.persistence.db import delete_analysis, get_analysis, list_analyses
from app.services.trending.youtube import fetch_trending_tracks

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api", tags=["analysis"])


@router.post("/analyze/link", response_model=SongAnalysisResult)
async def analyze_song_link(payload: AnalyzeLinkRequest) -> SongAnalysisResult:
    url = str(payload.url)
    preset = payload.preset
    logger.info("Link analysis request: %s [preset=%s]", url, preset)
    try:
        return await analyse_link(url, preset=preset)
    except Exception as exc:
        logger.exception("Link analysis failed for %s", url)
        raise HTTPException(status_code=500, detail=f"Analysis failed: {exc}") from exc


@router.post("/analyze/audio", response_model=SongAnalysisResult)
async def analyze_audio(
    file: UploadFile,
    preset: str = Form(default="general"),
) -> SongAnalysisResult:
    if not file.filename:
        raise HTTPException(status_code=400, detail="No file provided.")

    content_type = file.content_type or ""
    allowed = ("audio/", "video/webm", "application/octet-stream")
    if not any(content_type.startswith(a) for a in allowed):
        raise HTTPException(
            status_code=415,
            detail=f"Unsupported media type: {content_type}. Please upload an audio file.",
        )

    data = await file.read()
    if len(data) == 0:
        raise HTTPException(status_code=400, detail="Uploaded file is empty.")

    max_bytes = 25 * 1024 * 1024
    if len(data) > max_bytes:
        raise HTTPException(status_code=413, detail="File too large. Maximum 25 MB.")

    logger.info("Audio upload: filename=%s size=%d content_type=%s preset=%s", file.filename, len(data), content_type, preset)

    try:
        return await analyse_audio_upload(
            audio_bytes=data,
            filename=file.filename,
            original_filename=file.filename,
            preset=preset,
        )
    except Exception as exc:
        logger.exception("Audio analysis failed")
        raise HTTPException(status_code=500, detail=f"Audio analysis failed: {exc}") from exc


@router.get("/trending", response_model=TrendingResponse)
async def get_trending(
    language: TrendingLanguage = "worldwide",
    limit: int = 10,
) -> TrendingResponse:
    try:
        return await fetch_trending_tracks(language=language, limit=min(limit, 20))
    except Exception as exc:
        logger.exception("Trending fetch failed")
        raise HTTPException(status_code=500, detail=f"Could not load trending tracks: {exc}") from exc


@router.post("/compare", response_model=CompareResponse)
async def compare_songs(payload: CompareRequest) -> CompareResponse:
    if len(payload.urls) < 2:
        raise HTTPException(status_code=400, detail="Please provide at least 2 song links to compare.")
    if len(payload.urls) > 3:
        raise HTTPException(status_code=400, detail="You can compare up to 3 songs at once.")
    logger.info("Compare request: %d tracks, preset=%s", len(payload.urls), payload.preset)
    try:
        return await compare_tracks(payload)
    except Exception as exc:
        logger.exception("Track comparison failed")
        raise HTTPException(status_code=500, detail=f"Comparison failed: {exc}") from exc


@router.get("/analyses", response_model=AnalysisListResponse)
async def get_analyses() -> AnalysisListResponse:
    analyses = await list_analyses(limit=20)
    return AnalysisListResponse(analyses=analyses)


@router.get("/analyses/{record_id}", response_model=SongAnalysisResult)
async def get_analysis_by_id(record_id: str) -> SongAnalysisResult:
    result = await get_analysis(record_id)
    if result is None:
        raise HTTPException(status_code=404, detail=f"Analysis {record_id!r} not found.")
    return result


@router.delete("/analyses/{record_id}", response_model=DeleteResponse)
async def delete_analysis_by_id(record_id: str) -> DeleteResponse:
    deleted = await delete_analysis(record_id)
    if not deleted:
        raise HTTPException(status_code=404, detail=f"Analysis {record_id!r} not found.")
    return DeleteResponse(success=True, id=record_id)
