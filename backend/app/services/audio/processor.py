import logging
import struct
import tempfile
import wave
from pathlib import Path

logger = logging.getLogger(__name__)


def get_audio_duration(path: Path) -> float | None:
    """Try to get duration in seconds from a WAV file. Returns None for other formats."""
    try:
        with wave.open(str(path), "rb") as wf:
            frames = wf.getnframes()
            rate = wf.getframerate()
            return frames / float(rate)
    except Exception:
        pass

    stat = path.stat()
    size_bytes = stat.st_size
    estimated = size_bytes / (16000 * 2)
    logger.info("Could not determine exact duration; estimating %.1fs from file size", estimated)
    return max(1.0, estimated)


def save_upload_to_temp(data: bytes, suffix: str = ".webm") -> Path:
    """Save uploaded audio bytes to a named temp file and return its path."""
    tmp = tempfile.NamedTemporaryFile(delete=False, suffix=suffix)
    tmp.write(data)
    tmp.flush()
    tmp.close()
    return Path(tmp.name)


def cleanup_temp(path: Path) -> None:
    try:
        path.unlink(missing_ok=True)
    except Exception as exc:
        logger.warning("Failed to clean up temp file %s: %s", path, exc)
