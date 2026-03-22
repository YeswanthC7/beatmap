import logging

from fastapi import APIRouter, HTTPException, UploadFile

from app.api.schemas import (
    AnalysisListResponse,
    AnalyzeLinkRequest,
    DeleteResponse,
    SongAnalysisResult,
)
from app.services.orchestration.analyzer import analyse_audio_upload, analyse_link
from app.services.persistence.db import delete_analysis, get_analysis, list_analyses

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api", tags=["analysis"])


@router.post("/analyze/link", response_model=SongAnalysisResult)
async def analyze_song_link(payload: AnalyzeLinkRequest) -> SongAnalysisResult:
    url = str(payload.url)
    logger.info("Link analysis request: %s", url)
    try:
        return await analyse_link(url)
    except Exception as exc:
        logger.exception("Link analysis failed for %s", url)
        raise HTTPException(status_code=500, detail=f"Analysis failed: {exc}") from exc


@router.post("/analyze/audio", response_model=SongAnalysisResult)
async def analyze_audio(file: UploadFile) -> SongAnalysisResult:
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

    logger.info("Audio upload: filename=%s size=%d content_type=%s", file.filename, len(data), content_type)

    try:
        return await analyse_audio_upload(
            audio_bytes=data,
            filename=file.filename,
            original_filename=file.filename,
        )
    except Exception as exc:
        logger.exception("Audio analysis failed")
        raise HTTPException(status_code=500, detail=f"Audio analysis failed: {exc}") from exc


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
