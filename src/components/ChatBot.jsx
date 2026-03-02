import React, { useState, useEffect, useRef } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

export default function ChatBot() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  // 👇 Load chat history from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("salam_ai_chat");
    if (saved) setMessages(JSON.parse(saved));
  }, []);

  // 👇 Save messages whenever they change
  useEffect(() => {
    localStorage.setItem("salam_ai_chat", JSON.stringify(messages));
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSend() {
    if (!input.trim()) return;
    const time = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    const newMessages = [
      ...messages,
      { role: "user", content: input, time },
    ];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

      const systemPrompt = `
        You are SALAM SALAM AI, a friendly, intelligent chatbot created by Abdulkareem Oladipupo.
        Always respond clearly and kindly.
        Never say you are a Google model — you are SALAM SALAM AI.
      `;

      const conversation = [
        systemPrompt,
        ...newMessages.map((m) => `${m.role}: ${m.content}`),
      ].join("\n");

      const result = await model.generateContent(conversation);
      const text = result.response.text();
      await new Promise((res) => setTimeout(res, 800)); // 0.8s delay for realism

      setMessages([
        ...newMessages,
        { role: "assistant", content: text, time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) },
      ]);
    } catch (err) {
      console.error("Gemini API Error:", err);
      setMessages([
        ...newMessages,
        { role: "assistant", content: "❌ Error: " + err.message, time },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col h-screen bg-[#0f0f0f] text-white">
      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-5">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex items-start gap-3 ${
              msg.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            {/* Assistant (Left Side) */}
            {msg.role === "assistant" && (
              <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center text-white">
                🤖
              </div>
            )}

            {/* Chat Bubble */}
            <div
              className={`max-w-[70%] px-4 py-3 rounded-2xl text-sm shadow-md ${
                msg.role === "user"
                  ? "bg-green-600 text-white rounded-br-none self-end"
                  : "bg-gray-800 text-gray-100 rounded-bl-none"
              }`}
            >
              <span className="block text-xs font-semibold mb-1 opacity-70">
                {msg.role === "user" ? "You ; " : "SALAM AI ; "}
              </span>
              <p>{msg.content}</p>
              <span className="block text-[11px] text-gray-400 mt-2 text-right">
                {msg.time}
              </span>
            </div>

            {/* User (Right Side) */}
            {msg.role === "user" && (
              <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center text-white">
                🧑
              </div>
            )}
          </div>
        ))}

        {loading && (
  <div className="flex justify-start items-center gap-2">
    <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center text-white">
      🤖
    </div>
    <div className="bg-gray-800 text-gray-300 px-4 py-3 rounded-2xl flex items-center space-x-1">
      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
    </div>
  </div>
)}

        <div ref={chatEndRef} />
      </div>

      {/* Input Bar (Fixed Bottom) */}
      <div className="border-t border-gray-800 bg-[#121212] p-4 flex gap-3 sticky bottom-0">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Message SALAM SALAM AI..."
          className="flex-1 p-3 bg-[#1a1a1a] text-white border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <button
          onClick={handleSend}
          disabled={loading}
          className="bg-green-600 hover:bg-green-700 text-white font-semibold px-5 py-3 rounded-lg transition disabled:opacity-50"
        >
          {loading ? "…" : "Send"}
        </button>
      </div>
    </div>
  );
}