import React, { useState, useContext, useEffect, useRef } from "react";
import { ThemeContext } from "../Context/ThemeContext";

export default function Chatbot() {
  const { isDark } = useContext(ThemeContext);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
    { from: "bot", text: "👋 Hi! Need help reporting or tracking an issue?" },
  ]);
  const [input, setInput] = useState("");
  const listRef = useRef(null);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages, open]);

  const dummyUserIssues = [
    {
      title: "Pothole near school",
      location: "MG Road",
      status: "inprogress",
      createdAt: "2025-02-10",
      department: "Roads Department",
    },
    {
      title: "Streetlight not working",
      location: "Sector 5",
      status: "resolved",
      createdAt: "2025-01-28",
      department: "Street Lighting Department",
    },
  ];

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = { from: "user", text: input.trim() };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput("");
    setLoading(true);

    const payloadMessages = updatedMessages.map((m) => ({
      role: m.from === "user" ? "user" : "assistant",
      content: m.text,
    }));

    const userData = {
      userName: "Ravi Kumar",
      issues: dummyUserIssues,
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
                  {m.text}
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
                placeholder="Ask about your issue..."
                className={`flex-1 px-4 py-2 rounded-xl focus:outline-none ${
                  isDark
                    ? "bg-[#262626] text-white"
                    : "bg-gray-50 text-black"
                }`}
              />
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
