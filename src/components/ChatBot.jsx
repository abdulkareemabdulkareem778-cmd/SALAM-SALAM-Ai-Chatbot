import React, { useState, useEffect, useRef } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

export default function ChatBot() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSend() {
    if (!input.trim()) return;
    const newMessages = [...messages, { role: "user", content: input }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

      const systemPrompt = `
        You are SALAM SALAM AI, a friendly, intelligent chatbot created by Abdulkareem Oladipupo.
        Always speak clearly, kindly, and naturally.
        Never say you are a Google model — you are SALAM SALAM AI.
      `;

      const conversation = [
        systemPrompt,
        ...newMessages.map((m) => `${m.role}: ${m.content}`),
      ].join("\n");

      const result = await model.generateContent(conversation);
      const response = await result.response;
      const text = response.text();

      setMessages([...newMessages, { role: "assistant", content: text }]);
    } catch (err) {
      console.error("Gemini API Error:", err);
      setMessages([
        ...newMessages,
        { role: "assistant", content: "❌ Error: " + err.message },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col flex-1 p-4 bg-gray-900 text-white">
      {/* Chat Messages */}
     <div className="flex-1 overflow-y-auto mb-4 space-y-4 bg-gray-900 p-4 rounded-xl">
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
            ? "bg-green-500 text-white rounded-br-none self-end"
            : "bg-gray-700 text-gray-100 rounded-bl-none"
        }`}
      >
        <span className="block text-xs font-semibold mb-1 opacity-70">
          {msg.role === "user" ? "You" : "SALAM AI"}
        </span>
        {msg.content}
      </div>

      {/* User (Right Side) */}
      {msg.role === "user" && (
        <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white">
          🧑
        </div>
      )}
    </div>
  ))}

  {loading && (
    <div className="flex justify-start">
      <div className="bg-gray-700 text-gray-300 px-4 py-2 rounded-2xl animate-pulse">
        SALAM AI is thinking…
      </div>
    </div>
  )}

  <div ref={chatEndRef} />
</div>


      {/* Input Area */}
      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Type a message…"
          className="flex-1 p-3 bg-gray-800 text-white border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
        />
        <button
          onClick={handleSend}
          disabled={loading}
          className="bg-green-500 hover:bg-green-600 text-white font-semibold px-5 py-3 rounded-lg transition disabled:opacity-50"
        >
          {loading ? "…" : "Send"}
        </button>
      </div>
    </div>
  );
}