from urllib.parse import urlparse


def extract_soundcloud_path(url: str) -> str | None:
    parsed_url = urlparse(url)
    domain = parsed_url.netloc.lower().replace("www.", "")

    if domain != "soundcloud.com":
        return None

    path = parsed_url.path.strip("/")
    return path or None
