"use client";

import { useState, useEffect, useCallback } from 'react';
import { ClipboardList, ArrowLeft, Loader2, Save, X, Trophy } from 'lucide-react'; // Tambah ikon
import Link from 'next/link';

interface ChecklistItem {
    id: string;
    category: string;
    text: string;
}

interface ChecklistData {
    items: ChecklistItem[];
    checkedItems: string[];
}

export default function ChecklistPage() {
    const [checklistData, setChecklistData] = useState<ChecklistData | null>(null);
    const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
 
    const [showBadgeModal, setShowBadgeModal] = useState(false);
    const [badgeName, setBadgeName] = useState('');

    const fetchChecklist = useCallback(async () => {
        setIsLoading(true);
        try {
            const res = await fetch('/api/checklist');
            const data = await res.json();
            if (data.success) {
                setChecklistData(data.data);
                setCheckedItems(new Set(data.data.checkedItems));
            }
        } catch (error) {
            console.error("Gagal memuat checklist:", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchChecklist();
    }, [fetchChecklist]);

    const handleCheckboxChange = (id: string) => {
        setCheckedItems(prev => {
            const newSet = new Set(prev);
            if (newSet.has(id)) {
                newSet.delete(id);
            } else {
                newSet.add(id);
            }
            return newSet;
        });
    };

    const handleSaveProgress = async () => {
        setIsSaving(true);
        try {
            const res = await fetch('/api/checklist', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ checkedItems: Array.from(checkedItems) }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error("Gagal menyimpan.");
            
      
            if (data.badgeAwarded) {
                setBadgeName(data.badgeName);
                setShowBadgeModal(true);
            } else {
                alert("Progres Anda telah disimpan!");
            }
        } catch (err) {
            if (err instanceof Error) {
                alert(`Gagal menyimpan: ${err.message}`);
            } else {
                alert("Gagal menyimpan karena kesalahan tidak dikenal.");
            }
        } finally {
            setIsSaving(false);
        }
    };
    
    const progress = checklistData ? Math.round((checkedItems.size / checklistData.items.length) * 100) : 0;
    const groupedItems = checklistData?.items.reduce((acc, item) => {
        (acc[item.category] = acc[item.category] || []).push(item);
        return acc;
    }, {} as Record<string, ChecklistItem[]>);


    if (isLoading) {
        return <div className="flex items-center justify-center min-h-screen"><Loader2 className="animate-spin" /> <span className="ml-2">Memuat Checklist...</span></div>;
    }

    return (
        <div className="bg-slate-50 min-h-screen p-4 sm:p-8 font-sans">
            <div className="max-w-4xl mx-auto">
                <div className="mb-6">
                    <Link href="/warga/dashboard" className="inline-flex items-center gap-2 text-slate-600 hover:text-indigo-600 font-semibold">
                        <ArrowLeft className="w-4 h-4" />
                        Kembali ke Dashboard
                    </Link>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl shadow-md p-6 sm:p-8">
                    <div className="flex items-center gap-4">
                        <div className="bg-indigo-100 p-4 rounded-full">
                            <ClipboardList className="w-10 h-10 text-indigo-600" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-extrabold text-slate-900">Checklist Kesiapsiagaan Bencana</h1>
                            <p className="mt-1 text-slate-600">Pastikan Tas Siaga Bencana (TSB) Anda lengkap.</p>
                        </div>
                    </div>
                    
                    <div className="mt-8">
                        <div className="flex justify-between items-center mb-1">
                            <span className="text-sm font-semibold text-slate-700">Progres Kelengkapan: {progress}%</span>
                            <button onClick={handleSaveProgress} disabled={isSaving}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 disabled:bg-slate-400">
                                <Save className="w-4 h-4" />
                                {isSaving ? 'Menyimpan...' : 'Simpan Progres'}
                            </button>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-2.5">
                            <div className="bg-indigo-600 h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
                        </div>
                    </div>
                    
                    <div className="mt-8 space-y-6">
                        {groupedItems && Object.entries(groupedItems).map(([category, items]) => (
                            <div key={category}>
                                <h3 className="text-lg font-bold text-slate-800 border-b pb-2 mb-3">{category}</h3>
                                <div className="space-y-3">
                                    {items.map(item => (
                                        <label key={item.id} className="flex items-center p-3 bg-slate-50 rounded-lg hover:bg-slate-100 cursor-pointer">
                                            <input 
                                                type="checkbox" 
                                                checked={checkedItems.has(item.id)}
                                                onChange={() => handleCheckboxChange(item.id)}
                                                className="h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                            />
                                            <span className="ml-3 text-slate-700">{item.text}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* --- MODAL PEMBERIAN LENCANA --- */}
                {showBadgeModal && (
                    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
                        <div className="bg-white rounded-2xl shadow-xl max-w-sm text-center p-8 relative" data-aos="zoom-in">
                            <button onClick={() => setShowBadgeModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"><X /></button>
                            <Trophy className="w-20 h-20 text-yellow-500 mx-auto animate-bounce"/>
                            <h2 className="text-2xl font-bold text-slate-900 mt-4">Pencapaian Diraih!</h2>
                            <p className="text-slate-600 mt-2">Selamat, Anda telah menyelesaikan checklist dan mendapatkan:</p>
                            <p className="text-xl font-bold text-indigo-600 mt-2">{badgeName}</p>
                            <Link href="/warga/profil" className="mt-6 inline-block w-full bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-indigo-700">
                                Lihat di Profil
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}