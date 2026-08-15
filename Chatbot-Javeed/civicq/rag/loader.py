"""PDF loader — docs/*.pdf into Documents, one per page."""

import os

from langchain_core.documents import Document
from pypdf import PdfReader

from civicq.config.settings import ALLOWED_DOCS, DOCS_DIR


def load_pdf(filename: str) -> list[Document]:
    """One Document per page, tagged with source + page number."""
    reader = PdfReader(DOCS_DIR / filename)

    # split_documents carries this metadata onto every chunk it produces.
    return [
        Document(page_content=text, metadata={"source": filename, "page": number})
        for number, page in enumerate(reader.pages)
        # Scanned/image-only pages extract as empty; embedding them wastes
        # quota and pollutes retrieval with blank hits.
        if (text := (page.extract_text() or "").strip())
    ]


def load_documents() -> list[Document]:
    """Every allowlisted PDF, as page-level Documents."""
    documents = []

    for filename in ALLOWED_DOCS:
        if not filename.lower().endswith(".pdf"):
            print(f"  ! not a PDF, skipped: {filename}")
            continue

        if not os.path.exists(DOCS_DIR / filename):
            print(f"  ! missing, skipped: {filename}")
            continue

        pages = load_pdf(filename)
        print(f"  {filename}: {len(pages)} pages")
        documents.extend(pages)

    return documents
