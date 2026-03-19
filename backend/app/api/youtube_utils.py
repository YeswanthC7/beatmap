from urllib.parse import parse_qs, urlparse


def extract_youtube_video_id(url: str) -> str | None:
    parsed_url = urlparse(url)
    domain = parsed_url.netloc.lower().replace("www.", "")

    if domain == "youtu.be":
        video_id = parsed_url.path.lstrip("/")
        return video_id or None

    if domain in {"youtube.com", "m.youtube.com"}:
        query_params = parse_qs(parsed_url.query)
        video_ids = query_params.get("v")
        if video_ids:
            return video_ids[0]

    return None
