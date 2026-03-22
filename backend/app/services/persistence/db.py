import json
import logging
import sqlite3
import uuid
from datetime import datetime, timezone

from app.api.schemas import AnalysisMode, AnalysisRecord, SongAnalysisResult
from app.settings import settings

logger = logging.getLogger(__name__)


def _get_connection() -> sqlite3.Connection:
    conn = sqlite3.connect(settings.db_path)
    conn.row_factory = sqlite3.Row
    return conn


async def init_db() -> None:
    with _get_connection() as conn:
        conn.execute("""
            CREATE TABLE IF NOT EXISTS analyses (
                id TEXT PRIMARY KEY,
                created_at TEXT NOT NULL,
                platform TEXT NOT NULL,
                source_label TEXT NOT NULL,
                song_title TEXT NOT NULL,
                artist_name TEXT NOT NULL,
                thumbnail_url TEXT,
                analysis_mode TEXT NOT NULL,
                result_json TEXT NOT NULL
            )
        """)
        conn.commit()
    logger.info("Database initialised at %s", settings.db_path)


async def save_analysis(result: SongAnalysisResult) -> str:
    record_id = str(uuid.uuid4())
    created_at = datetime.now(timezone.utc).isoformat()

    result_with_id = result.model_copy(update={"id": record_id})

    with _get_connection() as conn:
        conn.execute(
            """
            INSERT INTO analyses
                (id, created_at, platform, source_label, song_title,
                 artist_name, thumbnail_url, analysis_mode, result_json)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (
                record_id,
                created_at,
                result.platform,
                result.sourceLabel,
                result.songTitle,
                result.artistName,
                result.thumbnailUrl,
                result.analysisMode,
                result_with_id.model_dump_json(),
            ),
        )
        conn.commit()

    logger.info("Saved analysis %s for '%s'", record_id, result.songTitle)
    return record_id


async def list_analyses(limit: int = 20) -> list[AnalysisRecord]:
    with _get_connection() as conn:
        rows = conn.execute(
            """
            SELECT id, created_at, platform, source_label,
                   song_title, artist_name, thumbnail_url, analysis_mode
            FROM analyses
            ORDER BY created_at DESC
            LIMIT ?
            """,
            (limit,),
        ).fetchall()

    return [
        AnalysisRecord(
            id=row["id"],
            createdAt=row["created_at"],
            platform=row["platform"],
            sourceLabel=row["source_label"],
            songTitle=row["song_title"],
            artistName=row["artist_name"],
            thumbnailUrl=row["thumbnail_url"],
            analysisMode=row["analysis_mode"],
        )
        for row in rows
    ]


async def get_analysis(record_id: str) -> SongAnalysisResult | None:
    with _get_connection() as conn:
        row = conn.execute(
            "SELECT result_json FROM analyses WHERE id = ?", (record_id,)
        ).fetchone()

    if not row:
        return None

    return SongAnalysisResult.model_validate_json(row["result_json"])


async def delete_analysis(record_id: str) -> bool:
    with _get_connection() as conn:
        cursor = conn.execute("DELETE FROM analyses WHERE id = ?", (record_id,))
        conn.commit()
    return cursor.rowcount > 0
