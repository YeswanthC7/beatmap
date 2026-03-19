from urllib.parse import urlparse


def detect_platform(url: str) -> str:
    parsed_url = urlparse(url)
    domain = parsed_url.netloc.lower().replace("www.", "")

    if domain in {"youtube.com", "youtu.be", "m.youtube.com"}:
        return "youtube"

    if domain in {"soundcloud.com"}:
        return "soundcloud"

    return "unknown"
