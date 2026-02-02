import { useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

export default function ChatBot() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);

  async function handleSend() {
    if (!input.trim()) return;
    const newMessages = [...messages, { role: "user", content: input }];
    setMessages(newMessages);
    setInput("");

    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const result = await model.generateContent(input);
      const reply = result.response.text();

      setMessages([...newMessages, { role: "assistant", content: reply }]);
    } catch (err) {
      console.error(err);
      setMessages([
        ...newMessages,
        { role: "assistant", content: "error" },
      ]);
    }
  }

  return (
    <div className="p-4 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-blue-600">🤖 SALAM SALAM AI Chatbot</h1>
      <div className="border p-3 h-80 overflow-y-auto mb-3 bg-gray-50 rounded">
        {messages.map((msg, i) => (
          <p key={i} className={msg.role === "user" ? "text-blue-700" : "text-green-700"}>
            <b>{msg.role}:</b> {msg.content}
          </p>
        ))}
      </div>
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type a message..."
        className="border p-2 w-full rounded"
      />
      <button
        onClick={handleSend}
        className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
      >
        Send
      </button>
    </div>
  );
}
