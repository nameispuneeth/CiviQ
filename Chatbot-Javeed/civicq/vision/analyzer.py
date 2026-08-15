"""Reads a civic-issue photo and returns the values the report form needs.

The photo never passes through this process. The browser uploads it to
Cloudinary and sends only the resulting URL; Groq fetches the image from that
URL itself. Everything here operates on a string, whatever the size of the photo.

Written for people who cannot fill the form themselves — a citizen photographs
the problem and category, title and description arrive pre-filled. All of it is
a suggestion the user can overwrite.
"""

import json

from groq import BadRequestError, Groq

from civicq.config.settings import (
    ISSUE_CATEGORIES,
    VISION_ATTEMPTS,
    VISION_MAX_TOKENS,
    VISION_MODEL,
    require_env,
)

_client = None


def _get_client() -> Groq:
    # Built on first use rather than at import: app.py imports this module at
    # boot, and a missing key should fail the request, not the whole process.
    global _client

    if _client is None:
        _client = Groq(api_key=require_env("GROQ_API_KEY"))

    return _client


PROMPT = f"""You are triaging a photograph submitted to a city's civic issue
reporting app. The person reporting may not be able to read or write, so your
description becomes what they file.

Return ONLY a JSON object with exactly these keys:

- "category": exactly one of: {", ".join(ISSUE_CATEGORIES)}
- "title": a short factual title, under 60 characters, no trailing full stop
- "description": one or two plain sentences stating what the problem is and
  what is visible. Write plainly, as the citizen would report it.
- "is_civic_issue": true if this shows a public problem a city department could
  fix. false for selfies, screenshots, documents, indoor scenes, private
  property, or anything unrelated to public infrastructure.

Rules:
- Describe only what you can see. Never invent street names, dates, dimensions,
  or how long the problem has existed.
- If it is not a civic issue, still return every key: use "Other" and set
  is_civic_issue to false.
"""

# Cloudinary reads transformations out of the URL path, so asking for a smaller
# copy is a string edit rather than any image processing here. 1024px costs the
# model far fewer tokens than a 12 MP phone photo, and a pothole is equally
# identifiable at either size.
_CLOUDINARY_UPLOAD = "/image/upload/"
_TRANSFORM = "w_1024,q_auto/"


def _downscale(url: str) -> str:
    # Left alone if it isn't a Cloudinary URL, or already carries the transform.
    if _CLOUDINARY_UPLOAD not in url or _TRANSFORM in url:
        return url

    return url.replace(_CLOUDINARY_UPLOAD, _CLOUDINARY_UPLOAD + _TRANSFORM, 1)


def _to_category(value) -> str:
    # The form renders seven fixed buttons, so a category it has never heard of
    # would silently select nothing. Anything unrecognised becomes "Other".
    if isinstance(value, str):
        for category in ISSUE_CATEGORIES:
            if value.strip().lower() == category.lower():
                return category

    return "Other"


def _to_text(value, limit: int) -> str:
    if not isinstance(value, str):
        return ""

    return " ".join(value.split())[:limit].rstrip()


def _ask_model(url: str) -> str:
    response = _get_client().chat.completions.create(
        model=VISION_MODEL,
        max_completion_tokens=VISION_MAX_TOKENS,
        # Without this the reply opens with a <think> block and json.loads fails.
        reasoning_format="hidden",
        response_format={"type": "json_object"},
        messages=[
            {
                "role": "user",
                "content": [
                    {"type": "text", "text": PROMPT},
                    # The image, as a URL Groq will fetch. This one entry is the
                    # only difference between a vision call and a text one.
                    {"type": "image_url", "image_url": {"url": _downscale(url)}},
                ],
            }
        ],
    )

    return response.choices[0].message.content


def analyze_image(url: str) -> dict:
    """Return {category, title, description, is_civic_issue} for a photo URL."""
    # Measured against a live Cloudinary image: json_object mode on this model
    # intermittently 400s with an empty `failed_generation`, then succeeds on an
    # identical retry.
    last_error = None

    for _ in range(VISION_ATTEMPTS):
        try:
            raw = json.loads(_ask_model(url))
            break
        except (BadRequestError, json.JSONDecodeError) as error:
            last_error = error
    else:
        raise last_error

    return {
        "category": _to_category(raw.get("category")),
        "title": _to_text(raw.get("title"), 60),
        "description": _to_text(raw.get("description"), 400),
        "is_civic_issue": bool(raw.get("is_civic_issue", True)),
    }
