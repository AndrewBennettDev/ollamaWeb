'use client'

import React, { useState, useRef, useEffect } from "react";

export default function Home() {
    const [prompt, setPrompt] = useState("");
    const [chatHistory, setChatHistory] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const chatEndRef = useRef<HTMLDivElement | null>(null);

    const handleSubmit = async (e: any) => {
      e.preventDefault();
      if (!prompt.trim()) return;
  
      const newUserMessage = { role: "user", content: prompt };
      setChatHistory((prev) => [...prev, newUserMessage]);
      setPrompt("");
      setLoading(true);
  
      let responseText = "";
      let newBotMessage = { role: "bot", content: "" }; 
  
      setChatHistory((prev) => [...prev, newBotMessage]);
  
      const res = await fetch("http://localhost:5000/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt }),
      });
  
      const reader = res.body!.getReader();
      const decoder = new TextDecoder();
  
      while (true) {
          const { value, done } = await reader.read();
          if (done) break;
          responseText += decoder.decode(value, { stream: true });
  
          setChatHistory((prev) => {
              const updatedHistory = [...prev];
              updatedHistory[updatedHistory.length - 1] = { role: "bot", content: responseText };
              return updatedHistory;
          });
      }
  
      setLoading(false);
  };
  

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [chatHistory]);

    return (
        <div className="flex flex-col h-screen bg-gray-900 text-white">
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {chatHistory.map((message, index) => (
                    <div key={index} className={`p-3 rounded-lg max-w-2xl ${message.role === "user" ? "bg-blue-600 self-end" : "bg-gray-700 self-start"}`}>
                        <pre className="whitespace-pre-wrap">{message.content}</pre>
                    </div>
                ))}
                <div ref={chatEndRef} />
            </div>

            <div className="p-4 bg-gray-800 border-t border-gray-700 sticky bottom-0">
                <form onSubmit={handleSubmit} className="flex space-x-2">
                  <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSubmit(e);
                      }
                    }}
                    className="w-full p-3 rounded-md bg-black text-white resize-none"
                    placeholder="Type your message..."
                  />
                  <button
                      type="submit"
                      className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
                      disabled={loading}
                  >
                      {loading ? "Loading..." : "Send"}
                  </button>
                </form>
            </div>
        </div>
    );
}
