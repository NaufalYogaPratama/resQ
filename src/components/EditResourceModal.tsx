"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Edit, X, Camera } from "lucide-react";


interface Resource {
    _id: string;
    namaSumberDaya: string;
    tipe: 'Aset' | 'Keahlian';
    deskripsi?: string;
    gambarUrl?: string;
}

export default function EditResourceModal({ resource }: { resource: Resource }) {
    const [isOpen, setIsOpen] = useState(false);
    const [namaSumberDaya, setNamaSumberDaya] = useState(resource.namaSumberDaya);
    const [tipe, setTipe] = useState(resource.tipe);
    const [deskripsi, setDeskripsi] = useState(resource.deskripsi || "");
    const [gambar, setGambar] = useState<File | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError("");

        const formData = new FormData();
        formData.append('namaSumberDaya', namaSumberDaya);
        formData.append('tipe', tipe);
        formData.append('deskripsi', deskripsi);
        if (gambar) {
            formData.append('gambar', gambar);
        }

        try {
            const res = await fetch(`/api/resources/${resource._id}`, {
                method: 'PUT',
                body: formData,
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.message || "Gagal memperbarui sumber daya.");
            }
            
            setIsOpen(false);
            router.refresh(); 
            alert("Sumber daya berhasil diperbarui!");

        } catch (err) {

            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("Terjadi kesalahan yang tidak diketahui.");
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="inline-flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-indigo-500 transition-colors"
            >
                <Edit className="w-4 h-4" />
                Edit Sumber Daya
            </button>

            {isOpen && (
                <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center p-4">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 relative" data-aos="fade-up">
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">Edit Sumber Daya</h2>
                        <button onClick={() => setIsOpen(false)} className="absolute top-4 right-4 text-slate-500 hover:text-slate-800">
                            <X className="w-6 h-6" />
                        </button>
                        
                        <form onSubmit={handleSubmit} className="space-y-4">
                             <div>
                                <label htmlFor="edit-nama" className="block text-sm font-medium text-slate-600">Nama Aset/Keahlian</label>
                                <input id="edit-nama" type="text" value={namaSumberDaya} onChange={(e) => setNamaSumberDaya(e.target.value)} required 
                                className="w-full mt-1 p-2 border border-slate-300 rounded-md" />
                            </div>
                            <div>
                                <label htmlFor="edit-tipe" className="block text-sm font-medium text-slate-600">Tipe</label>
                                <select id="edit-tipe" value={tipe} onChange={(e) => setTipe(e.target.value as 'Aset' | 'Keahlian')} 
                                className="w-full mt-1 p-2 border border-slate-300 rounded-md bg-white">
                                    <option value="Aset">Aset</option>
                                    <option value="Keahlian">Keahlian</option>
                                </select>
                            </div>
                            <div>
                                <label htmlFor="edit-deskripsi" className="block text-sm font-medium text-slate-600">Deskripsi</label>
                                <textarea id="edit-deskripsi" value={deskripsi} onChange={(e) => setDeskripsi(e.target.value)} rows={3}
                                className="w-full mt-1 p-2 border border-slate-300 rounded-md"></textarea>
                            </div>
                            <div>
                                <label htmlFor="edit-gambar" className="block text-sm font-medium text-slate-600">Ganti Foto (Opsional)</label>
                                <div className="mt-1 flex items-center border border-slate-300 rounded-md p-2">
                                    <Camera className="w-5 h-5 text-slate-500"/>
                                    <input id="edit-gambar" type="file" accept="image/*" onChange={(e) => setGambar(e.target.files ? e.target.files[0] : null)}
                                        className="ml-4 text-sm text-slate-500 file:mr-4 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                                    />
                                </div>
                            </div>
                            {error && <p className="text-red-500 text-sm">{error}</p>}
                            <div className="flex justify-end gap-3 pt-4">
                                <button type="button" onClick={() => setIsOpen(false)} className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200">
                                    Batal
                                </button>
                                <button type="submit" disabled={isSubmitting} className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-500 disabled:bg-slate-400">
                                    {isSubmitting ? 'Menyimpan...' : 'Simpan Perubahan'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}