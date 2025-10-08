

"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Image from 'next/image';

const TiptapEditor = dynamic(() => import("@/components/TiptapEditor"), { ssr: false });

export default function EditEdukasiPage() {
    const router = useRouter();
    const params = useParams();
    const id = params.id as string;

    const [judul, setJudul] = useState("");
    const [isiKonten, setIsiKonten] = useState("");
    const [kategori, setKategori] = useState("Kesiapsiagaan Umum");
    const [gambar, setGambar] = useState<File | null>(null);
    const [gambarUrl, setGambarUrl] = useState<string | null>(null);

    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (id) {
            const fetchArticleData = async () => {
                try {
                    const res = await fetch(`/api/articles/${id}`);
                    const data = await res.json();
                    if (data.success) {
                        setJudul(data.data.judul);
                        setIsiKonten(data.data.isiKonten);
                        setKategori(data.data.kategori);
                        setGambarUrl(data.data.gambarUrl);
                    } else {
                        throw new Error(data.message);
                    }
                } catch (err) {
                  
                    if (err instanceof Error) {
                        setError(err.message); 
                    } else {
                        setError("Terjadi kesalahan yang tidak diketahui.");
                    }
                } finally {
                    setIsLoading(false);
                }
            };
            fetchArticleData();
        }
    }, [id]);
    
    const handleUpdate = async (e: React.FormEvent) => {
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
            if (gambar) {
                formData.append("gambar", gambar);
            }

            const res = await fetch(`/api/articles/${id}`, {
                method: "PUT",
                body: formData,
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message);
            
            alert("Artikel berhasil diperbarui!");
            router.push("/admin/edukasi");

        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("Gagal menyimpan artikel.");
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return <div className="max-w-4xl mx-auto py-8 px-4 text-center">Memuat data artikel...</div>;
    }

    return (
        <div className="max-w-4xl mx-auto py-8 px-4">
            <Link href="/admin/edukasi" className="inline-flex items-center gap-2 text-slate-600 hover:text-indigo-600 font-semibold mb-6">
                <ArrowLeft className="w-4 h-4" />
                Kembali ke Manajemen Konten
            </Link>
            
            <h1 className="text-3xl font-bold mb-8">Edit Artikel Edukasi</h1>

            <form onSubmit={handleUpdate} className="bg-white p-6 rounded-lg shadow-md">
                <div className="mb-4">
                    <label htmlFor="judul" className="block text-sm font-medium text-slate-700">Judul Artikel</label>
                    <input id="judul" type="text" value={judul} onChange={(e) => setJudul(e.target.value)} required
                        className="w-full mt-1 p-2 border border-slate-300 rounded-md text-slate-900 focus:ring-2 focus:ring-indigo-500"/>
                </div>

                <div className="grid md:grid-cols-2 gap-6 mb-4">
                    <div>
                        <label htmlFor="kategori" className="block text-sm font-medium text-slate-700">Kategori</label>
                        <select id="kategori" value={kategori} onChange={(e) => setKategori(e.target.value)}
                            className="w-full mt-1 p-2 border border-slate-300 rounded-md bg-white text-slate-900 focus:ring-2 focus:ring-indigo-500">
                            <option>Kesiapsiagaan Umum</option>
                            <option>Banjir</option>
                            <option>Gempa Bumi</option>
                            <option>P3K</option>
                            <option>Lainnya</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="gambar" className="block text-sm font-medium text-slate-700">Ganti Foto Utama (Opsional)</label>
                        <div className="mt-1 flex items-center border border-slate-300 rounded-md p-2">
                            <input id="gambar" type="file" accept="image/*" onChange={(e) => setGambar(e.target.files ? e.target.files[0] : null)}
                                className="text-sm text-slate-500 file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"/>
                        </div>
                        {gambar && <p className="text-xs text-green-600 mt-1">✓ Foto baru terpilih: {gambar.name}</p>}
                        {!gambar && gambarUrl && <Image src={gambarUrl} alt="Gambar saat ini" width={1000}  
                height={1000} className="w-32 h-auto mt-2 rounded-md"/>}
                    </div>
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium text-slate-700 mb-1">Isi Konten</label>
                    <div className="tiptap border border-slate-300 rounded-md overflow-hidden">
                       {isiKonten && <TiptapEditor content={isiKonten} onChange={setIsiKonten} />}
                    </div>
                </div>

                {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

                <button type="submit" disabled={isSubmitting}
                    className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-indigo-700 disabled:bg-slate-400 transition-all">
                    {isSubmitting ? "Menyimpan..." : "Simpan Perubahan"}
                </button>
            </form>
        </div>
    );
}