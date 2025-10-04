// File: src/app/admin/edukasi/page.tsx (Dengan Tata Letak Horizontal)

"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Trash2, Edit, BookOpen, PlusCircle } from "lucide-react";
import Link from "next/link";

const TiptapEditor = dynamic(() => import("@/components/TiptapEditor"), { ssr: false });

interface ArticleType {
  _id: string;
  judul: string;
  kategori: string;
  createdAt: string;
  gambarUrl?: string;
}

export default function EdukasiPage() {
    const [articles, setArticles] = useState<ArticleType[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [judul, setJudul] = useState("");
    const [isiKonten, setIsiKonten] = useState("");
    const [kategori, setKategori] = useState("Kesiapsiagaan Umum");
    const [gambar, setGambar] = useState<File | null>(null);
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fetchArticles = async () => {
        setIsLoading(true);
        try {
            const res = await fetch("/api/articles");
            const data = await res.json();
            if (data.success) {
                setArticles(data.data);
            } else {
                throw new Error(data.message || "Gagal mengambil data");
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchArticles();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError("");
        try {
            if (isiKonten === "<p></p>" || !isiKonten) {
                throw new Error("Isi konten tidak boleh kosong.");
            }
            const formData = new FormData();
            formData.append("judul", judul);
            formData.append("isiKonten", isiKonten);
            formData.append("kategori", kategori);
            if (gambar) formData.append("gambar", gambar);

            const res = await fetch("/api/articles", { method: "POST", body: formData });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message);

            setArticles(prevArticles => [data.data, ...prevArticles]);
            
            setJudul("");
            setIsiKonten("<p></p>");
            setKategori("Kesiapsiagaan Umum");
            setGambar(null);
            const fileInput = document.getElementById('gambar') as HTMLInputElement;
            if (fileInput) fileInput.value = "";

        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm("Apakah Anda yakin ingin menghapus artikel ini?")) {
            try {
                const res = await fetch(`/api/articles/${id}`, { method: "DELETE" });
                const data = await res.json();
                if (!res.ok) throw new Error(data.message || "Gagal menghapus artikel");
                
                setArticles(prevArticles => prevArticles.filter(article => article._id !== id));
                alert("Artikel berhasil dihapus!");
            } catch (err: any) {
                alert("Gagal menghapus artikel: " + err.message);
            }
        }
    };

    return (
        <div className="space-y-8">
            <div data-aos="fade-down">
                <h1 className="text-4xl font-extrabold text-slate-900 flex items-center">
                    <BookOpen className="w-10 h-10 mr-4 text-indigo-600"/>
                    Manajemen Konten Edukasi
                </h1>
                <p className="mt-2 text-lg text-slate-600">Buat, edit, dan kelola semua artikel edukasi untuk warga.</p>
            </div>

            {/* --- Kunci Tata Letak Horizontal ada di baris ini --- */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                
                {/* Kolom Form (mengambil 2 dari 5 kolom di layar besar) */}
                <div data-aos="fade-right" className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl shadow-md p-6 sm:p-8 h-fit">
                    <h2 className="text-2xl font-bold mb-6 text-slate-900 flex items-center">
                        <PlusCircle className="w-7 h-7 mr-3 text-indigo-600"/>
                        Tambah Artikel
                    </h2>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="judul" className="block text-sm font-semibold text-slate-700 mb-2">Judul Artikel</label>
                            <input id="judul" type="text" value={judul} onChange={(e) => setJudul(e.target.value)} required 
                                className="w-full py-3 px-4 bg-white border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                        </div>

                        <div className="grid md:grid-cols-1 gap-6">
                            <div>
                                <label htmlFor="kategori" className="block text-sm font-semibold text-slate-700 mb-2">Kategori</label>
                                <select id="kategori" value={kategori} onChange={(e) => setKategori(e.target.value)}
                                    className="w-full py-3 px-4 bg-white border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                                    <option>Kesiapsiagaan Umum</option>
                                    <option>Banjir</option>
                                    <option>Gempa Bumi</option>
                                    <option>P3K</option>
                                    <option>Lainnya</option>
                                </select>
                            </div>
                            <div>
                                <label htmlFor="gambar" className="block text-sm font-semibold text-slate-700 mb-2">Unggah Foto Utama</label>
                                <input id="gambar" type="file" accept="image/*" onChange={(e) => setGambar(e.target.files ? e.target.files[0] : null)}
                                    className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer"/>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Isi Konten</label>
                            <div className="tiptap border border-slate-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-indigo-500">
                                <TiptapEditor content={isiKonten} onChange={setIsiKonten} />
                            </div>
                        </div>

                        {error && <p className="text-red-500 text-sm">{error}</p>}

                        <button type="submit" disabled={isSubmitting}
                            className="w-full bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 disabled:bg-slate-400 transition-all shadow-md">
                            {isSubmitting ? "Menyimpan..." : "Simpan Artikel"}
                        </button>
                    </form>
                </div>

                {/* Kolom Tabel (mengambil 3 dari 5 kolom di layar besar) */}
                <div data-aos="fade-left" data-aos-delay="100" className="lg:col-span-3 bg-white border border-slate-200 rounded-2xl shadow-md h-fit">
                    <div className="p-6 border-b">
                        <h2 className="text-2xl font-bold text-slate-900">Daftar Artikel ({articles.length})</h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-slate-200">
                            <thead className="bg-slate-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-slate-600 uppercase">Judul</th>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-slate-600 uppercase">Kategori</th>
                                    <th className="px-6 py-3 text-right text-xs font-bold text-slate-600 uppercase">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-slate-200">
                                {isLoading ? (
                                    <tr><td colSpan={3} className="p-6 text-center text-slate-500">Memuat data...</td></tr>
                                ) : articles.length === 0 ? (
                                    <tr><td colSpan={3} className="p-6 text-center text-slate-500">Belum ada artikel.</td></tr>
                                ) : (
                                    articles.map((article) => (
                                        <tr key={article._id} className="hover:bg-slate-50">
                                            <td className="px-6 py-4 text-sm font-medium text-slate-900">
                                                <div className="font-semibold">{article.judul}</div>
                                                <div className="text-xs text-slate-500 mt-1">{new Date(article.createdAt).toLocaleDateString("id-ID", { year: 'numeric', month: 'long', day: 'numeric' })}</div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-slate-500">{article.kategori}</td>
                                            <td className="px-6 py-4 text-right text-sm font-medium space-x-2">
                                                <Link href={`/admin/edukasi/${article._id}`} className="text-indigo-600 hover:text-indigo-900 p-2 inline-block" title="Edit">
                                                    <Edit className="w-4 h-4" />
                                                </Link>
                                                <button onClick={() => handleDelete(article._id)} className="text-red-600 hover:text-red-900 p-2" title="Hapus">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}