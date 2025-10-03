"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { Edit, X, User as UserIcon, Mail, Phone } from "lucide-react";

interface UserData {
    namaLengkap: string;
    email: string;
    noWa: string;
}

// PERBAIKAN: Berikan tipe data 'UserData' pada props 'user'
export default function EditProfileModal({ user }: { user: UserData }) {
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();

    const [namaLengkap, setNamaLengkap] = useState(user.namaLengkap);
    const [noWa, setNoWa] = useState(user.noWa);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");
    
    const [isMounted, setIsMounted] = useState(false);
    useEffect(() => setIsMounted(true), []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError("");
        try {
            const res = await fetch('/api/user/profile', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ namaLengkap, noWa }),
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || "Gagal memperbarui profil.");
            }

            setIsOpen(false);
            router.refresh(); 
            alert("Profil berhasil diperbarui!");

        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const modalContent = (
        <div 
            className="fixed inset-0 bg-black/60 z-[1200] flex items-center justify-center p-4"
            onClick={() => setIsOpen(false)}
        >
            <div 
                className="bg-white rounded-2xl shadow-xl w-full max-w-lg" 
                onClick={(e) => e.stopPropagation()}
            >
                <div className="p-6 flex justify-between items-center border-b">
                    <h2 className="text-2xl font-bold text-slate-900">Edit Profil</h2>
                    <button onClick={() => setIsOpen(false)} className="text-slate-500 hover:text-slate-800">
                        <X className="w-6 h-6" />
                    </button>
                </div>
                
                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    <div>
                        <label htmlFor="namaLengkap" className="block text-sm font-medium text-slate-700 mb-1">Nama Lengkap</label>
                        <div className="relative">
                            <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <input id="namaLengkap" type="text" value={namaLengkap} onChange={(e) => setNamaLengkap(e.target.value)} required 
                                className="w-full p-3 pl-10 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent" />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                        <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <input id="email" type="email" value={user.email} disabled
                                className="w-full p-3 pl-10 border border-slate-200 rounded-lg bg-slate-100 text-slate-500 cursor-not-allowed" />
                        </div>
                        <p className="text-xs text-slate-500 mt-1 ml-1">Email tidak dapat diubah.</p>
                    </div>
                    <div>
                        <label htmlFor="noWa" className="block text-sm font-medium text-slate-700 mb-1">Nomor WhatsApp</label>
                            <div className="relative">
                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <input id="noWa" type="tel" value={noWa} onChange={(e) => setNoWa(e.target.value)} required 
                                className="w-full p-3 pl-10 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent" />
                        </div>
                    </div>
                    
                    {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                    
                    <div className="flex justify-end gap-3 pt-4 border-t">
                        <button type="button" onClick={() => setIsOpen(false)} className="px-5 py-2 text-sm font-semibold text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200">
                            Batal
                        </button>
                        <button type="submit" disabled={isSubmitting} className="px-5 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:bg-slate-400">
                            {isSubmitting ? 'Menyimpan...' : 'Simpan Perubahan'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );

    return (
        <>
            <button 
                onClick={() => setIsOpen(true)}
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#4B5EAA] text-white px-5 py-3 rounded-lg font-semibold hover:bg-[#3A4D89] transition-colors"
            >
                <Edit className="w-4 h-4" />
                Edit Profil
            </button>
            {isOpen && isMounted && createPortal(modalContent, document.getElementById('modal-root')!)}
        </>
    );
}