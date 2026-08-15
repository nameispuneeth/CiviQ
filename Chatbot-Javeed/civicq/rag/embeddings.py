"""Embedding model — text into 1024-dimensional vectors.

Both sides use this: ingest embeds chunks, app embeds the question.
"""

from langchain_mistralai import MistralAIEmbeddings

from civicq.config.settings import EMBED_MODEL, require_env


def get_embeddings() -> MistralAIEmbeddings:
    return MistralAIEmbeddings(
        model=EMBED_MODEL,
        api_key=require_env("MISTRAL_API_KEY"),
    )
