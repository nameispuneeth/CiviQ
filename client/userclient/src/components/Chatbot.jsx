import React, { useState, useContext, useEffect, useRef } from "react";
import { ThemeContext } from "../Context/ThemeContext";
import MarkdownMessage from "./MarkdownMessage";
import { getUser, getToken } from "../lib/auth";
import {
  createRecognizer,
  describeSpeechError,
  isSpeechSupported,
} from "../lib/speech";

export default function Chatbot() {
  const { isDark } = useContext(ThemeContext);
  const [user, setUser] = useState(getUser);
  const [issues, setIssues] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const [messages, setMessages] = useState([
    { from: "bot", text: "👋 Hi! Need help reporting or tracking an issue?" },
  ]);
  const [input, setInput] = useState("");
  const listRef = useRef(null);
  const recognizerRef = useRef(null);
  const speechSupported = isSpeechSupported();

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages, open]);

  // A login in another tab fires `storage`; a logout in this tab has to call
  // this itself, so re-check whenever the chat is opened as well.
  useEffect(() => {
    const sync = () => setUser(getUser());
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);

  useEffect(() => {
    if (open) setUser(getUser());
  }, [open]);

  // The assistant answers "how many issues do I have" from this list, so it has
  // to be the real one — fetched with the same token the rest of the app uses.
  useEffect(() => {
    if (!user) {
      setIssues([]);
      return;
    }

    let cancelled = false;

    fetch(`${import.meta.env.VITE_APP_API_BACKEND_URL}/api/user/issues`, {
      headers: { "Content-Type": "application/json", authorization: getToken() },
    })
      .then((r) => r.json())
      .then((d) => {
        if (!cancelled) setIssues(d.issues || []);
      })
      .catch(() => {
        if (!cancelled) setIssues([]);
      });

    return () => {
      cancelled = true;
    };
  }, [user]);

  // Recognition holds the microphone open, so it has to be torn down when the
  // component unmounts or the panel closes — otherwise the browser keeps
  // showing the recording indicator on a chat the user already dismissed.
  useEffect(() => {
    if (!open && recognizerRef.current) recognizerRef.current.abort();
  }, [open]);

  useEffect(() => () => recognizerRef.current?.abort(), []);

  const toggleListening = () => {
    if (listening) {
      recognizerRef.current?.stop(); // stop() keeps the final result; abort() discards it
      return;
    }

    const recognizer = createRecognizer();
    if (!recognizer) return;

    // Every result so far, concatenated: `results` accumulates across the
    // session and the last entries are interim until `isFinal` flips.
    recognizer.onresult = (event) => {
      setInput(
        Array.from(event.results)
          .map((result) => result[0].transcript)
          .join("")
      );
    };

    recognizer.onerror = (event) => {
      // Firing stop() on a session that never heard anything reports "aborted",
      // which is the expected path rather than something worth surfacing.
      if (event.error !== "aborted") {
        setMessages((prev) => [
          ...prev,
          { from: "bot", text: describeSpeechError(event.error) },
        ]);
      }
      setListening(false);
    };

    recognizer.onend = () => setListening(false);

    recognizerRef.current = recognizer;
    recognizer.start();
    setListening(true);
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    if (listening) recognizerRef.current?.abort();

    const userMsg = { from: "user", text: input.trim() };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput("");
    setLoading(true);

    const payloadMessages = updatedMessages.map((m) => ({
      role: m.from === "user" ? "user" : "assistant",
      content: m.text,
    }));

    // `location` and `department` are what app.py's format_user_data() reads;
    // the Issue schema calls them `address` and `assigned_department`.
    const userData = {
      userName: user.name,
      issues: issues.map((i) => ({
        title: i.title,
        location: i.address,
        status: i.status,
        createdAt: i.createdAt,
        department: i.assigned_department,
      })),
    };
    try {
      const res = await fetch(`${import.meta.env.VITE_APP_CHATBOT_API_URL}/ask`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: payloadMessages, userData }),
      });

      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        { from: "bot", text: data.answer || "I couldn't find an answer." },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { from: "bot", text: "⚠️ Server error. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const TypingLoader = () => (
    <div className="flex gap-1 px-3 py-2">
      {[0, 150, 300].map((d, i) => (
        <span
          key={i}
          className={`w-2 h-2 rounded-full animate-bounce ${
            isDark ? "bg-gray-400" : "bg-gray-500"
          }`}
          style={{ animationDelay: `${d}ms` }}
        />
      ))}
    </div>
  );

  // Logged out: render nothing at all. The assistant is only useful with the
  // user's own issue data, and without a login there is none to send.
  if (!user) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* CHAT WINDOW */}
      {open && (
        <div
          className={`w-96 h-[520px] mb-4 rounded-2xl shadow-2xl overflow-hidden transform transition-all duration-300 ${
            isDark
              ? "bg-[#1c1c1c] text-white"
              : "bg-white text-gray-900"
          }`}
        >
          {/* HEADER */}
          <div className="px-4 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white">
            <div className="font-semibold text-lg">CiviQ Assistant</div>
            <div className="text-xs opacity-90">
              Smart help for civic issues
            </div>
          </div>

          {/* MESSAGES */}
          <div
            ref={listRef}
            className="p-4 space-y-3 overflow-y-auto h-[360px]"
          >
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex ${
                  m.from === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`px-4 py-2 rounded-2xl text-sm max-w-[80%] shadow ${
                    m.from === "user"
                      ? "bg-gradient-to-br from-blue-600 to-blue-500 text-white rounded-br-sm"
                      : isDark
                      ? "bg-[#2a2a2a] text-white rounded-bl-sm"
                      : "bg-gray-100 text-black rounded-bl-sm"
                  }`}
                >
                  {/* Only the bot writes markdown. A user typing "*" should
                      stay literal rather than turning into emphasis. */}
                  {m.from === "user" ? (
                    m.text
                  ) : (
                    <MarkdownMessage text={m.text} />
                  )}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div
                  className={`rounded-2xl ${
                    isDark ? "bg-[#2a2a2a]" : "bg-gray-100"
                  }`}
                >
                  <TypingLoader />
                </div>
              </div>
            )}
          </div>

          {/* INPUT */}
          <div
            className={`p-3 border-t ${
              isDark ? "border-[#333]" : "border-gray-200"
            }`}
          >
            <div className="flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                placeholder={
                  listening ? "Listening..." : "Ask about your issue..."
                }
                className={`flex-1 px-4 py-2 rounded-xl focus:outline-none ${
                  isDark
                    ? "bg-[#262626] text-white"
                    : "bg-gray-50 text-black"
                }`}
              />
              {/* Hidden rather than disabled where unsupported (Firefox): a
                  permanently dead button reads as a bug. */}
              {speechSupported && (
                <button
                  onClick={toggleListening}
                  disabled={loading}
                  aria-label={listening ? "Stop voice input" : "Start voice input"}
                  aria-pressed={listening}
                  title={listening ? "Stop listening" : "Speak your question"}
                  className={`px-4 rounded-xl transition ${
                    listening
                      ? "bg-red-500 text-white animate-pulse"
                      : isDark
                      ? "bg-[#262626] text-gray-300 hover:bg-[#333]"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {listening ? "⏹" : "🎤"}
                </button>
              )}
              <button
                onClick={sendMessage}
                disabled={loading}
                className={`px-5 rounded-xl text-white transition ${
                  loading
                    ? "bg-blue-400"
                    : "bg-gradient-to-r from-blue-600 to-cyan-500 hover:opacity-90"
                }`}
              >
                ➤
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FLOATING BUTTON */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-600 to-cyan-500 text-white shadow-xl hover:scale-110 transition-transform"
      >
        💬
      </button>
    </div>
  );
}
