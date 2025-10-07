"use client";

import { useState } from "react";
import { Bot, User, X, Send, Loader2 } from "lucide-react";

interface WaraResult {
  kategori: string;
  deskripsi: string;
}

interface WaraChatbotProps {
  onComplete: (data: WaraResult) => void;
  onClose: () => void;
}

interface Message {
  sender: "user" | "bot";
  text: string;
}

export default function WaraChatbot({ onComplete, onClose }: WaraChatbotProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: "bot",
      text: "Halo! Saya WARA, asisten darurat Anda. Ceritakan kejadian yang Anda lihat dalam satu kalimat.",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);


  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/wara", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Gagal memproses pesan Anda.");
      }

      const { kategori, deskripsi } = data.data;

      const botResponse: Message = {
        sender: "bot",
        text: `Baik, laporan Anda sudah saya catat:\n- Kategori: ${kategori || "?"}\n- Deskripsi: ${deskripsi || "?"}\n\nSekarang, untuk lokasi yang akurat, silakan klik tombol "Gunakan Lokasi Saat Ini" di peta.`,
      };
      setMessages((prev) => [...prev, botResponse]);

      onComplete(data.data);
    } catch (err) {
      let errorMessage = "Maaf, terjadi kesalahan.";
      if (err instanceof Error) {
        errorMessage = `Maaf, terjadi kesalahan: ${err.message}`;
      }

      const errorResponse: Message = { sender: "bot", text: errorMessage };
      setMessages((prev) => [...prev, userMessage, errorResponse]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-[1200] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg flex flex-col h-[70vh]">
        {/* Header */}
        <div className="p-4 flex justify-between items-center border-b bg-slate-50 rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 p-2 rounded-full">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Asisten Laporan WARA
              </h2>
              <p className="text-sm text-slate-500">
                Laporkan dengan cepat pakai kalimat biasa
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-slate-800"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Chat body */}
        <div className="flex-grow p-4 overflow-y-auto space-y-4">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex items-start gap-3 ${
                msg.sender === "user" ? "justify-end" : ""
              }`}
            >
              {msg.sender === "bot" && (
                <div className="bg-slate-200 p-2 rounded-full">
                  <Bot className="w-5 h-5 text-slate-600" />
                </div>
              )}
              <div
                className={`max-w-xs md:max-w-md p-3 rounded-xl whitespace-pre-wrap ${
                  msg.sender === "user"
                    ? "bg-indigo-600 text-white"
                    : "bg-slate-100 text-slate-800"
                }`}
              >
                <p className="text-sm">{msg.text}</p>
              </div>
              {msg.sender === "user" && (
                <div className="bg-slate-200 p-2 rounded-full">
                  <User className="w-5 h-5 text-slate-600" />
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex items-start gap-3">
              <div className="bg-slate-200 p-2 rounded-full">
                <Bot className="w-5 h-5 text-slate-600" />
              </div>
              <div className="max-w-xs md:max-w-md p-3 rounded-xl bg-slate-100 text-slate-800">
                <Loader2 className="w-5 h-5 animate-spin" />
              </div>
            </div>
          )}
        </div>

        {/* Input area */}
        <div className="p-4 border-t">
          <form onSubmit={handleSendMessage} className="flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Contoh: Ada kebakaran di Jalan Mawar No. 5..."
              className="w-full p-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              disabled={isLoading}
            />
            <button
              type="submit"
              className="bg-indigo-600 text-white p-3 rounded-lg hover:bg-indigo-700 disabled:bg-slate-400 flex-shrink-0"
              disabled={isLoading}
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
