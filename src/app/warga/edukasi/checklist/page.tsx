"use client";

import { useState, useEffect } from 'react';
import { CheckSquare, Square, ClipboardList, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface ChecklistItem {
  id: string;
  category: string;
  text: string;
}

export default function ChecklistPage() {
  const [items, setItems] = useState<ChecklistItem[]>([]);
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const res = await fetch('/api/checklist');
        const data = await res.json();
        if (data.success) {
          setItems(data.data.items);
          setCheckedItems(new Set(data.data.checkedItems));
        }
      } catch (error) {
        console.error("Gagal memuat checklist:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleToggle = (itemId: string) => {
    const newCheckedItems = new Set(checkedItems);
    if (newCheckedItems.has(itemId)) {
      newCheckedItems.delete(itemId);
    } else {
      newCheckedItems.add(itemId);
    }
    setCheckedItems(newCheckedItems);
  };
  
  const handleSave = async () => {
      setIsSaving(true);
      try {
        await fetch('/api/checklist', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ checkedItems: Array.from(checkedItems) }),
        });
        alert('Progres berhasil disimpan!');
      } catch (error) {
          alert('Gagal menyimpan progres. Coba lagi.');
      } finally {
          setIsSaving(false);
      }
  }

  const groupedItems = items.reduce((acc, item) => {
    (acc[item.category] = acc[item.category] || []).push(item);
    return acc;
  }, {} as Record<string, ChecklistItem[]>);
  
  const progress = items.length > 0 ? (checkedItems.size / items.length) * 100 : 0;

  if (isLoading) {
    return <div className="text-center p-10">Memuat checklist...</div>;
  }

  return (
    <div className="bg-gradient-to-br from-slate-50 via-white to-indigo-50 min-h-screen p-4 sm:p-8 font-sans">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
            <Link href="/warga/edukasi" className="inline-flex items-center text-indigo-600 hover:text-indigo-500 font-semibold">
                <ArrowLeft className="w-5 h-5 mr-2" />
                Kembali ke Pusat Edukasi
            </Link>
        </div>

        <div data-aos="fade-up" className="bg-white border border-slate-200 rounded-2xl shadow-lg p-6 sm:p-8">
            <div className="flex items-center mb-6">
                <ClipboardList className="w-10 h-10 mr-4 text-indigo-600"/>
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Checklist Tas Siaga Bencana</h1>
                    <p className="text-slate-600">Pastikan Anda siap menghadapi keadaan darurat.</p>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-6">
                <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-indigo-700">Progres Kesiapan</span>
                    <span className="text-sm font-medium text-indigo-700">{Math.round(progress)}%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2.5">
                    <div className="bg-indigo-600 h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
                </div>
            </div>

            <div className="space-y-6">
                {Object.entries(groupedItems).map(([category, catItems]) => (
                    <div key={category}>
                        <h2 className="text-xl font-semibold text-slate-800 border-b-2 border-indigo-200 pb-2 mb-3">{category}</h2>
                        <ul className="space-y-2">
                            {catItems.map(item => (
                                <li key={item.id} onClick={() => handleToggle(item.id)}
                                    className="flex items-center p-3 rounded-lg cursor-pointer hover:bg-slate-100 transition-colors">
                                    {checkedItems.has(item.id) ? 
                                        <CheckSquare className="w-6 h-6 text-indigo-600 mr-3"/> :
                                        <Square className="w-6 h-6 text-slate-400 mr-3"/>
                                    }
                                    <span className={`flex-1 ${checkedItems.has(item.id) ? 'text-slate-500 line-through' : 'text-slate-700'}`}>
                                        {item.text}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
            
            <div className="mt-8 text-right">
                <button 
                    onClick={handleSave}
                    disabled={isSaving}
                    className="bg-indigo-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-indigo-700 disabled:bg-slate-400">
                    {isSaving ? 'Menyimpan...' : 'Simpan Progres'}
                </button>
            </div>
        </div>
      </div>
    </div>
  );
}