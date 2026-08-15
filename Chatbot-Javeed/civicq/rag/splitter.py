"""Text splitter — page Documents into overlapping chunks, plus each chunk's ID."""

import hashlib

from langchain_core.documents import Document
from langchain_text_splitters import RecursiveCharacterTextSplitter

from civicq.config.settings import CHUNK_OVERLAP, CHUNK_SIZE


def split_documents(documents: list[Document]) -> list[Document]:
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=CHUNK_SIZE,
        chunk_overlap=CHUNK_OVERLAP,
    )

    return splitter.split_documents(documents)


def chunk_id(doc: Document) -> str:
    """Content-addressed ID, so re-running overwrites a chunk instead of duplicating it.

    Deliberately excludes the chunk's position: keying on position means
    inserting a paragraph on page 1 renumbers everything after it, so unchanged
    text lands under a fresh ID and the old vector is orphaned.
    """
    raw = f"{doc.metadata['source']}:{doc.metadata['page']}:{doc.page_content}"
    return hashlib.sha256(raw.encode("utf-8")).hexdigest()[:32]
