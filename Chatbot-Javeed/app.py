from flask import Flask, request, jsonify
from flask_cors import CORS
import os

from langchain_groq import ChatGroq

from civicq.config.settings import require_env
from civicq.prompts.templates import prompt
from civicq.rag.vectorstore import connect_vectorstore
from civicq.utils.formatting import format_user_data
from civicq.vision import analyze_image, to_data_uri

# ---------------- ENV ----------------
# MistralAIEmbeddings loads a HuggingFace tokenizer purely to pack *multi-text*
# embedding requests under a token budget. This process only ever embeds one
# query at a time, so it never packs anything — and Render's free tier has no
# persistent disk, so the 1.8 MB download is paid on every cold start. Skipping
# it is a no-op for output (verified: still 1024-dim vectors) and saves ~0.7s.
# ingest.py deliberately does NOT set this: batching real work needs the tokenizer.
os.environ.setdefault("HF_HUB_OFFLINE", "1")

GROQ_API_KEY = require_env("GROQ_API_KEY")

# ---------------- APP ----------------
app = Flask(__name__)
CORS(app)

# ---------------- LLM ----------------
llm = ChatGroq(
    groq_api_key=GROQ_API_KEY,
    model_name="llama-3.1-8b-instant"
)

# ---------------- VECTOR STORE (STATIC KNOWLEDGE) ----------------
vectorstore = connect_vectorstore()
retriever = vectorstore.as_retriever(search_kwargs={"k": 4})

@app.route("/", methods=["GET", "HEAD"])
def home():
    return {"status": "running"}



# ---------------- IMAGE ANALYSIS ----------------
# Called from Report.jsx as soon as a photo is chosen, so the form fills itself
# in for someone who cannot type it.
#
# Accepts the photo either way:
#   multipart  image=<file>              — the file itself
#   json       {"url": "https://..."}    — an already-uploaded Cloudinary URL
#
# Report.jsx sends the URL, because the photo has to reach Cloudinary regardless
# (issue.photo stores that URL) and re-sending the bytes here would upload the
# same picture twice.
@app.route("/analyze-image", methods=["POST"])
def analyze():
    try:
        upload = request.files.get("image")

        if upload:
            source = to_data_uri(upload.read(), upload.mimetype)
        else:
            source = (request.get_json(silent=True) or {}).get("url")

        if not source:
            return jsonify({"error": "send an `image` file or a `url`"}), 400

        return jsonify(analyze_image(source))

    except Exception as e:
        print("🔥 VISION ERROR:", e)
        return jsonify({"error": str(e)}), 500


# ---------------- API ROUTE ----------------
@app.route("/ask", methods=["POST"])
def ask():
    try:
        data = request.get_json(force=True)

        messages = data.get("messages")
        user_data = data.get("userData")

        if not messages:
            return jsonify({"error": "messages missing"}), 400

        # last user message
        last_user_message = next(
            (m["content"] for m in reversed(messages) if m["role"] == "user"),
            None
        )

        if not last_user_message:
            return jsonify({"error": "no user message"}), 400

        # -------- USER CONTEXT (EXACT FACTS) --------
        user_context = format_user_data(user_data)

        # -------- RAG CONTEXT (APP KNOWLEDGE) --------
        docs = retriever.invoke(last_user_message)
        rag_context = "\n\n".join(doc.page_content for doc in docs)

        # -------- FINAL CONTEXT --------
        final_context = f"""
            User Issue Data:
            {user_context}

            Application Knowledge:
            {rag_context}
            """

        response = llm.invoke(
            prompt.format_messages(
                context=final_context,
                question=last_user_message
            )
        )

        return jsonify({"answer": response.content})

    except Exception as e:
        print("🔥 BACKEND ERROR:", e)
        return jsonify({"error": str(e)}), 500


# ---------------- RUN ----------------
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 10000))
    app.run(host="0.0.0.0", port=port)

