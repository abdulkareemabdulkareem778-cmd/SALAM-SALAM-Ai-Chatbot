import React from "react";

export default function Sidebar() {
  return (
    <div className="w-64 bg-gray-800 p-4 border-r border-gray-700 flex flex-col">
      <h1 className="text-2xl font-bold mb-4 text-green-400 text-center">
        🤖 SALAM SALAM AI
      </h1>

      <button
        className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded mb-4 transition"
        onClick={() => window.location.reload()}
      >
        ➕ New Chat
      </button>

      <div className="flex-1 overflow-y-auto">
        <p className="text-gray-400 text-sm text-center">
          Your past chats will appear here soon…
        </p>
      </div>

      <div className="text-gray-500 text-xs text-center mt-4">
        Built by Abdulkareem Oladipupo 💻
      </div>
    </div>
  );
}