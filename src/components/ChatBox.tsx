"use client";

import { useState, useEffect, useRef } from 'react';
import { Send } from 'lucide-react';

interface Message {
  _id: string;
  sender: {
    _id: string;
    namaLengkap: string;
  };
  content: string;
  createdAt: string;
}

interface ChatBoxProps {
  reportId: string;
  currentUserId: string;
}

export default function ChatBox({ reportId, currentUserId }: ChatBoxProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchMessages = async () => {
    try {
      const res = await fetch(`/api/chat/${reportId}/messages`);
      if (!res.ok) throw new Error('Gagal memuat pesan.');
      const data = await res.json();
      if (data.success) {
        setMessages(data.data);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
    const intervalId = setInterval(fetchMessages, 3000); // Polling setiap 3 detik
    return () => clearInterval(intervalId); // Membersihkan interval
  }, [reportId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      const res = await fetch(`/api/chat/${reportId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: newMessage }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Gagal mengirim pesan.');
      
      setMessages(prev => [...prev, data.data]);
      setNewMessage('');
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (isLoading) {
    return <div className="p-4 text-center text-slate-500">Memuat percakapan...</div>;
  }
  
  if (error) {
    return <div className="p-4 text-center text-red-500">{error}</div>;
  }

  return (
    <div className="flex flex-col h-96 bg-white border border-slate-200 rounded-lg shadow-inner">
      {/* Header Chat */}
      <div className="p-3 border-b border-slate-200">
        <h3 className="font-bold text-slate-800">Kanal Koordinasi</h3>
      </div>
      
      {/* Area Pesan */}
      <div className="flex-grow p-4 overflow-y-auto bg-slate-50">
        {messages.length === 0 ? (
          <p className="text-center text-sm text-slate-400">Belum ada pesan. Mulai percakapan!</p>
        ) : (
          messages.map(msg => (
            <div key={msg._id} className={`flex my-2 ${msg.sender._id === currentUserId ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-xs md:max-w-md p-3 rounded-xl ${msg.sender._id === currentUserId ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-800'}`}>
                <p className="text-xs font-bold mb-1 opacity-80">{msg.sender.namaLengkap}</p>
                <p className="text-sm">{msg.content}</p>
                <p className="text-xs text-right mt-1 opacity-60">
                  {new Date(msg.createdAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
      
      {/* Input Pesan */}
      <div className="p-3 border-t border-slate-200">
        <form onSubmit={handleSendMessage} className="flex items-center gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Ketik pesan koordinasi..."
            className="w-full p-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button type="submit" className="bg-indigo-600 text-white p-2 rounded-lg hover:bg-indigo-700 flex-shrink-0">
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
}