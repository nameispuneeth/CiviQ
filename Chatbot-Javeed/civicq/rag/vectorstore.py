"""Pinecone vector store — index creation, the write-side store, the read-side connection.

Indexing runs deliberately from ingest.py, never at boot, so app.py's cold
start is a client handshake rather than an embed-every-PDF rebuild, and every
gunicorn worker shares one index.
"""

from langchain_pinecone import PineconeVectorStore
from pinecone import Pinecone, ServerlessSpec

from civicq.config.settings import (
    EMBED_DIM,
    PINECONE_INDEX,
    PINECONE_NAMESPACE,
    require_env,
)
from civicq.rag.embeddings import get_embeddings


def ensure_index(pc: Pinecone) -> None:
    if pc.has_index(PINECONE_INDEX):
        return

    print(f"Creating index {PINECONE_INDEX} (dim={EMBED_DIM}, cosine)...")

    # create_index polls until the index reports ready, and raises if
    # initialisation fails outright.
    pc.create_index(
        name=PINECONE_INDEX,
        dimension=EMBED_DIM,
        metric="cosine",
        spec=ServerlessSpec(cloud="aws", region="us-east-1"),
    )

    print("Index ready.")


def open_index():
    """Connect, creating the index on first run. Write side."""
    pc = Pinecone(api_key=require_env("PINECONE_API_KEY"))
    ensure_index(pc)
    return pc.Index(PINECONE_INDEX)


def clear_namespace(index) -> None:
    stats = index.describe_index_stats()

    # Deleting a namespace that was never created 404s.
    if PINECONE_NAMESPACE in stats.get("namespaces", {}):
        print(f"Clearing namespace {PINECONE_NAMESPACE}...")
        index.delete(delete_all=True, namespace=PINECONE_NAMESPACE)


def writable_store(index) -> PineconeVectorStore:
    """Store bound to an already-resolved index. Used by ingest.py."""
    return PineconeVectorStore(
        index=index,
        embedding=get_embeddings(),
        namespace=PINECONE_NAMESPACE,
    )


def connect_vectorstore() -> PineconeVectorStore:
    """Read side — assumes the index already exists. Used by app.py."""
    return PineconeVectorStore.from_existing_index(
        index_name=PINECONE_INDEX,
        embedding=get_embeddings(),
        namespace=PINECONE_NAMESPACE,
    )
