"""Reads a civic-issue photo and returns the values the report form needs.

The photo itself never passes through this process. The browser uploads it to
Cloudinary first and sends only the resulting URL; Groq fetches the image from
that URL. So the payload here is a string, whatever the size of the photo.

Written for people who cannot fill the form themselves — a citizen photographs
the problem and these three fields (category, title, description) arrive
pre-filled. Everything returned is a suggestion the user can overwrite.
"""

import json
import re

from groq import Groq

from civicq.config.settings import (
    ISSUE_CATEGORIES,
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
- "confidence": a number between 0 and 1 for how sure you are of the category

Rules:
- Describe only what you can see. Never invent street names, dates, dimensions,
  or how long the problem has existed.
- If it is not a civic issue, still return every key: use "Other" and set
  is_civic_issue to false.
"""

# Cloudinary applies transformations named in the URL path. Asking for a 1024px
# wide, auto-quality copy costs the model far fewer tokens than a 12 MP phone
# photo, and a pothole is equally identifiable at either size.
_CLOUDINARY_UPLOAD = "/image/upload/"
_TRANSFORM = "w_1024,q_auto/"

# The model answers "high"/"medium"/"low" as often as it answers a number, even
# when the prompt asks for a float.
_CONFIDENCE_WORDS = {
    "very high": 0.95,
    "high": 0.9,
    "medium": 0.6,
    "moderate": 0.6,
    "low": 0.3,
    "very low": 0.15,
}


def _downscale(url: str) -> str:
    if _CLOUDINARY_UPLOAD not in url or _TRANSFORM in url:
        return url

    return url.replace(_CLOUDINARY_UPLOAD, _CLOUDINARY_UPLOAD + _TRANSFORM, 1)


def _to_category(value) -> str:
    if isinstance(value, str):
        for category in ISSUE_CATEGORIES:
            if value.strip().lower() == category.lower():
                return category

    return "Other"


def _to_confidence(value) -> float:
    if isinstance(value, bool):
        return 0.5

    if isinstance(value, (int, float)):
        # Some replies use a 0-100 scale despite the prompt.
        number = float(value) / 100 if value > 1 else float(value)
        return round(max(0.0, min(1.0, number)), 2)

    if isinstance(value, str):
        text = value.strip().lower()

        if text in _CONFIDENCE_WORDS:
            return _CONFIDENCE_WORDS[text]

        match = re.search(r"\d*\.?\d+", text)
        if match:
            return _to_confidence(float(match.group()))

    return 0.5


def _to_text(value, limit: int) -> str:
    if not isinstance(value, str):
        return ""

    text = " ".join(value.split())
    return text[:limit].rstrip()


def analyze_image(url: str) -> dict:
    """Return {category, title, description, is_civic_issue, confidence}.

    Every field is normalised before it leaves here, so callers never see a
    category the form cannot render or a confidence that isn't a float.
    """
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
                    {"type": "image_url", "image_url": {"url": _downscale(url)}},
                ],
            }
        ],
    )

    raw = json.loads(response.choices[0].message.content)

    return {
        "category": _to_category(raw.get("category")),
        "title": _to_text(raw.get("title"), 60),
        "description": _to_text(raw.get("description"), 400),
        "is_civic_issue": bool(raw.get("is_civic_issue", True)),
        "confidence": _to_confidence(raw.get("confidence")),
    }
