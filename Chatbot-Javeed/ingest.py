"""
One-off / re-runnable ingestion into Pinecone.

Run this locally whenever docs/ changes:

    python ingest.py            # add or update the allowlisted docs
    python ingest.py --reset    # wipe the namespace first, then re-upsert

Use --reset after *editing* a doc: chunk IDs are content hashes, so edited text
upserts as new vectors while the superseded ones linger until the namespace is
cleared. Plain runs are enough when only adding files.

The web process (app.py) never ingests. It only reads from Pinecone.
"""

import sys

from civicq.config.settings import EMBED_BATCH, PINECONE_INDEX, PINECONE_NAMESPACE
from civicq.rag.loader import load_documents
from civicq.rag.splitter import chunk_id, split_documents
from civicq.rag.vectorstore import clear_namespace, open_index, writable_store


def main() -> int:
    reset = "--reset" in sys.argv

    # Load and split before touching Pinecone. Both are local and free, so a
    # typo in ALLOWED_DOCS fails here instead of leaving a stray empty index
    # behind in the account.
    print("Loading documents...")
    documents = load_documents()
    chunks = split_documents(documents)

    if not chunks:
        print("No chunks produced — check ALLOWED_DOCS and docs/.")
        return 1

    print(f"Split {len(documents)} pages -> {len(chunks)} chunks")

    index = open_index()

    if reset:
        clear_namespace(index)

    print(f"Upserting {len(chunks)} chunks into {PINECONE_INDEX}/{PINECONE_NAMESPACE}...")

    writable_store(index).add_documents(
        documents=chunks,
        ids=[chunk_id(doc) for doc in chunks],
        embedding_chunk_size=EMBED_BATCH,
    )

    print("Done.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
