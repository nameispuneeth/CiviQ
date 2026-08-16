import React, { useState, useContext, useEffect, useRef } from "react";
import { ThemeContext } from "../Context/ThemeContext";
import MarkdownMessage from "./MarkdownMessage";
import { getUser } from "../lib/auth";
import {
  createRecognizer,
  describeSpeechError,
  isSpeechSupported,
} from "../lib/speech";

export default function Chatbot() {
  const { isDark } = useContext(ThemeContext);
  const [user, setUser] = useState(getUser);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
    { from: "bot", text: "👋 Hi! Need help reporting or tracking an issue?" },
  ]);
  const [input, setInput] = useState("");
  const [listening, setListening] = useState(false);
  const listRef = useRef(null);
  const inputRef = useRef(null);
  const recognizerRef = useRef(null);
  const speechSupported = isSpeechSupported();

  // Grow the composer with its content, up to a ceiling. Driven off `input`
  // rather than onChange so dictated text resizes the box too — the mic writes
  // straight to state without ever firing a change event.
  const MAX_INPUT_HEIGHT = 128;

  useEffect(() => {
    const box = inputRef.current;
    if (!box) return;

    box.style.height = "auto"; // shrink first, or it can only ever get taller
    box.style.height = `${Math.min(box.scrollHeight, MAX_INPUT_HEIGHT)}px`;
  }, [input, open]);

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

    // Admins have no personal issue list — /api/user/issues is user-scoped — so
    // this side gets the knowledge-base half of the assistant only.
    const userData = {
      userName: user.name,
      issues: [],
    };

    try {
      const res = await fetch("https://chatbot-javeed-1.onrender.com/ask", {
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
    /* items-end: the panel is 384px wide and the bubble 64px, so without it the
       bubble aligns to the panel's left edge instead of sitting under its
       right-hand corner. */
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* CHAT WINDOW */}
      {open && (
        <div
          className={`w-96 h-[520px] mb-4 rounded-2xl shadow-2xl overflow-hidden flex flex-col transform transition-all duration-300 ${
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
            /* flex-1 instead of a fixed height: the transcript gives up space as
               the composer grows, so the panel never overflows. min-h-0 is what
               actually lets a flex child shrink below its content. */
            className="flex-1 min-h-0 p-4 space-y-3 overflow-y-auto"
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
            {/* items-end keeps the buttons on the bottom line as the box grows */}
            <div className="flex gap-2 items-end">
              <textarea
                ref={inputRef}
                rows={1}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  // Enter sends, Shift+Enter writes a newline. preventDefault
                  // stops the newline landing in the box before we clear it.
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
                placeholder={
                  listening ? "Listening..." : "Ask about your issue..."
                }
                className={`flex-1 px-4 py-2 rounded-xl resize-none overflow-y-auto leading-6 focus:outline-none ${
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
                  className={`shrink-0 w-10 h-10 grid place-items-center rounded-xl transition ${
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
                className={`shrink-0 w-10 h-10 grid place-items-center rounded-xl text-white transition ${
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
