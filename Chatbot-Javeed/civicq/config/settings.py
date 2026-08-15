"""Settings shared by ingest.py (writes) and app.py (reads).

Both sides must agree on index, namespace, and embedding model. A mismatch
fails *silently* — retrieval just returns nothing and the bot answers
"I don't know" to everything — so the values live in one place rather than
being declared twice and drifting.
"""

import os
from pathlib import Path

from dotenv import load_dotenv

load_dotenv()

PROJECT_ROOT = Path(__file__).resolve().parents[2]
DOCS_DIR = PROJECT_ROOT / "docs"


def require_env(name: str) -> str:
    value = os.getenv(name)

    if not value:
        raise RuntimeError(
            f"{name} is not set. Copy .env.example to .env and fill it in, "
            f"or set it in your deployment environment."
        )

    return value


# ---------------- PINECONE ----------------
# Deliberately no defaults. A plausible-but-wrong fallback points the app at an
# empty namespace, which produces no error anywhere — just a bot that knows
# nothing. Failing at boot is the louder, cheaper failure.
PINECONE_INDEX = require_env("PINECONE_INDEX")
PINECONE_NAMESPACE = require_env("PINECONE_NAMESPACE")

# ---------------- SOURCE DOCUMENTS ----------------
# Explicit allowlist. Everything not named here is ignored, including any file
# dropped into docs/ later. docs/ also holds credential dumps
# (authdata.txt, department_logins*.txt, dummydata.json,
# citygov_employee_records.pdf) which must never reach the vector store —
# the /ask endpoint is unauthenticated and would happily read them back out.
ALLOWED_DOCS = [
    "civicq_chatbot_training_pages_explicit.pdf",
    "HackatoobPDF.pdf",
    "citygov_chatbot_training_data.pdf",
]

# ---------------- SPLITTER ----------------
CHUNK_SIZE = 1000
CHUNK_OVERLAP = 200

# ---------------- EMBEDDINGS ----------------
EMBED_MODEL = "mistral-embed"

# mistral-embed emits 1024-dimensional vectors, and a Pinecone index's dimension
# is fixed at creation. Changing EMBED_MODEL means recreating the index.
EMBED_DIM = 1024

# Texts sent to Mistral per embedding call. The default (1000) would batch the
# whole corpus into one request; keeping it small stays clear of rate limits.
EMBED_BATCH = 32

# ---------------- VISION ----------------
# The only image-capable model on this Groq account — llama-3.1-8b-instant and
# llama-3.3-70b-versatile reject a list-shaped `content` outright, and the
# llama-4 vision models are not served here. Re-check `client.models.list()`
# before changing this.
VISION_MODEL = "qwen/qwen3.6-27b"

# A reasoning model: it spends tokens thinking before it answers, so a budget
# sized for the JSON alone gets truncated mid-object.
VISION_MAX_TOKENS = 900

# Measured: json_object mode on this model 400s with `json_validate_failed` on
# roughly 3 of 8 identical calls, then succeeds on retry. Three attempts puts
# the residual failure near 6%. Dropping json_object mode instead was tested and
# is worse — the model then sometimes replies with no JSON object at all.
VISION_ATTEMPTS = 3

# Must mirror the category buttons in client/userclient/src/pages/Report.jsx.
# A model that invents a category outside this list is coerced to "Other" rather
# than passed through — the form has no button to render an unknown value.
ISSUE_CATEGORIES = [
    "Roads",
    "Lighting",
    "Sanitation",
    "Parks",
    "Traffic",
    "Water",
    "Other",
]
