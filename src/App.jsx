import React from "react";
import ChatBot from "./components/ChatBot";
import Sidebar from "./components/Sidebar";

export default function App() {
  return (
    <div className="flex h-screen bg-gray-900 text-white">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <ChatBot />
      </div>
    </div>
  );
}