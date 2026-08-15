"""Plain text helpers — no network, no state, easy to unit test.

User issue data is formatted as exact text rather than vectorised: it is small,
per-request, and already structured, so embedding it would only lose precision.
"""

from datetime import datetime


def format_date(value: str | None) -> str:
    """ISO timestamp -> "15 Aug 2026, 8:03 PM".

    The LLM repeats whatever it is given verbatim, so a raw
    "2026-08-15T20:03:09.442Z" ends up in front of the user unless it is
    made readable here.
    """
    if not value:
        return "unknown date"

    try:
        parsed = datetime.fromisoformat(value.replace("Z", "+00:00"))
    except (ValueError, AttributeError):
        return str(value)

    # %-d / %-I drop the leading zero (GNU strftime).
    return parsed.strftime("%-d %b %Y, %-I:%M %p")


def format_user_data(user_data: dict) -> str:
    if not user_data:
        return "No user-specific issue data available."

    issues = user_data.get("issues", [])

    if not issues:
        return "User has not raised any issues."

    text = f"User has raised {len(issues)} issues.\n"

    for idx, issue in enumerate(issues, start=1):
        text += (
            f"Issue {idx}: {issue.get('title')} | "
            f"Location: {issue.get('location')} | "
            f"Status: {issue.get('status')} | "
            f"Created: {format_date(issue.get('createdAt'))}\n"
        )

    last_issue = issues[-1]
    text += (
        f"\nLast raised issue: {last_issue.get('title')} "
        f"at {last_issue.get('location')} "
        f"with status {last_issue.get('status')}, "
        f"raised on {format_date(last_issue.get('createdAt'))}."
    )

    return text
