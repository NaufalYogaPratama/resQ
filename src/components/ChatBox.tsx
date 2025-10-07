"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import { Send, Loader2 } from 'lucide-react';

interface Message {
  _id: string;
  sender: {
    _id: string;
    namaLengkap: string;
    peran: 'Warga' | 'Relawan' | 'Admin';
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
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchMessages = useCallback(async () => {
    try {
      const res = await fetch(`/api/chat/${reportId}/messages`);
      if (!res.ok) {
        const data = await res.json();
   
        if (res.status !== 404) {
            throw new Error(data.message || 'Gagal memuat pesan.');
        }
        setMessages([]); 
        return;
      }
      const data = await res.json();
      if (data.success) {
        setMessages(data.data);
      }
    } catch (err) { 
        if (err instanceof Error) {
            setError(err.message);
        }
    } finally {
      setIsLoading(false);
    }
  }, [reportId]);

  useEffect(() => {
    fetchMessages();
    const intervalId = setInterval(fetchMessages, 5000); 
    return () => clearInterval(intervalId);

  }, [fetchMessages]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || isSending) return;

    setIsSending(true);
    setError('');

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
    } catch (err) {
        if (err instanceof Error) {
            setError(err.message);
        }
    } finally {
        setIsSending(false);
    }
  };

  if (isLoading) {
    return <div className="p-4 text-center text-slate-500">Memuat percakapan...</div>;
  }
  
  if (error) {
    return <div className="p-4 text-center text-red-500 bg-red-50 border border-red-200 rounded-lg">{error}</div>;
  }

  return (
    <div className="flex flex-col h-96 bg-white border border-slate-200 rounded-lg shadow-inner">
      <div className="p-3 border-b border-slate-200">
        <h3 className="font-bold text-slate-800">Kanal Koordinasi</h3>
      </div>
      
      <div className="flex-grow p-4 overflow-y-auto bg-slate-50">
        {messages.length === 0 ? (
          <p className="text-center text-sm text-slate-400">Belum ada pesan. Mulai percakapan untuk berkoordinasi!</p>
        ) : (
          messages.map(msg => (
            <div key={msg._id} className={`flex my-2 ${msg.sender._id === currentUserId ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-xs md:max-w-md p-3 rounded-xl shadow-sm ${msg.sender._id === currentUserId ? 'bg-indigo-600 text-white' : 'bg-white text-slate-800 border'}`}>
                <p className={`text-xs font-bold mb-1 ${msg.sender._id === currentUserId ? 'text-indigo-200' : 'text-indigo-600'}`}>{msg.sender.namaLengkap} ({msg.sender.peran})</p>
                <p className="text-sm break-words">{msg.content}</p>
                <p className={`text-xs text-right mt-1 ${msg.sender._id === currentUserId ? 'text-indigo-300' : 'text-slate-400'}`}>
                  {new Date(msg.createdAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <div className="p-3 border-t border-slate-200">
        <form onSubmit={handleSendMessage} className="flex items-center gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Ketik pesan koordinasi..."
            disabled={isSending}
            className="w-full p-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-slate-100"
          />
          <button type="submit" disabled={isSending} className="bg-indigo-600 text-white p-2 rounded-lg hover:bg-indigo-700 flex-shrink-0 disabled:bg-indigo-400">
            {isSending ? <Loader2 className="w-5 h-5 animate-spin"/> : <Send className="w-5 h-5" />}
          </button>
        </form>
      </div>
    </div>
  );
}
