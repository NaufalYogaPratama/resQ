"use client";

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Trash2, Edit } from 'lucide-react';

// DIUBAH: Import TiptapEditor, bukan RichTextEditor
const TiptapEditor = dynamic(() => import('@/components/TiptapEditor'), { ssr: false });

interface ArticleType {
  _id: string;
  judul: string;
  kategori: string;
  createdAt: string;
}

export default function ManageEdukasiPage() {
  const [articles, setArticles] = useState<ArticleType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [judul, setJudul] = useState('');
  const [isiKonten, setIsiKonten] = useState('');
  const [kategori, setKategori] = useState('Kesiapsiagaan Umum');
  const [gambarUrl, setGambarUrl] = useState('');
  
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchArticles = async () => {
    try {
      const res = await fetch('/api/articles');
      const data = await res.json();
      if (data.success) {
        setArticles(data.data);
      }
    } catch (err) {
      console.error("Gagal mengambil artikel:", err);
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
    setError('');
    try {
      if (isiKonten === '<p></p>' || !isiKonten) {
        throw new Error("Isi konten tidak boleh kosong.");
      }
      const res = await fetch('/api/articles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ judul, isiKonten, kategori, gambarUrl }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      
      fetchArticles();
      setJudul('');
      setIsiKonten('');
      setGambarUrl('');
      setKategori('Kesiapsiagaan Umum');

    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus artikel ini?')) {
      await fetch(`/api/articles/${id}`, { method: 'DELETE' });
      fetchArticles();
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Manajemen Konten Edukasi</h1>
      
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Tambah Artikel Baru</h2> {/* Tambah text-gray-800 */}
        
        <div className="mb-4">
            <label htmlFor="judul" className="block text-sm font-medium text-gray-700">Judul Artikel</label>
            {/* Tambahkan text-gray-900 */}
            <input id="judul" type="text" value={judul} onChange={e => setJudul(e.target.value)} required className="w-full mt-1 p-2 border border-gray-300 rounded-md text-gray-900"/>
        </div>
        
        <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div>
                <label htmlFor="kategori" className="block text-sm font-medium text-gray-700">Kategori</label>
                {/* Tambahkan text-gray-900 */}
                <select id="kategori" value={kategori} onChange={e => setKategori(e.target.value)} className="w-full mt-1 p-2 border border-gray-300 rounded-md bg-white text-gray-900">
                    <option className="text-gray-900">Kesiapsiagaan Umum</option>
                    <option className="text-gray-900">Banjir</option>
                    <option className="text-gray-900">Gempa Bumi</option>
                    <option className="text-gray-900">P3K</option>
                    <option className="text-gray-900">Lainnya</option>
                </select>
            </div>
            <div>
                <label htmlFor="gambarUrl" className="block text-sm font-medium text-gray-700">URL Gambar Utama</label>
                {/* Tambahkan text-gray-900 */}
                <input id="gambarUrl" type="text" value={gambarUrl} onChange={e => setGambarUrl(e.target.value)} placeholder="https://..." className="w-full mt-1 p-2 border border-gray-300 rounded-md text-gray-900"/>
            </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Isi Konten</label>
          <div className="tiptap">
            <TiptapEditor content={isiKonten} onChange={setIsiKonten} />
          </div>
        </div>


        {error && <p className="text-red-500 text-sm">{error}</p>}
        
        <button type="submit" disabled={isSubmitting} className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400">
          {isSubmitting ? 'Menyimpan...' : 'Simpan Artikel'}
        </button>
      </form>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Daftar Artikel</h2>
        {isLoading ? <p>Memuat artikel...</p> : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Judul</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kategori</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tanggal</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Aksi</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {articles.map(article => (
                  <tr key={article._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{article.judul}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{article.kategori}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(article.createdAt).toLocaleDateString('id-ID')}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                      <button className="text-indigo-600 hover:text-indigo-900 p-1"><Edit className="w-4 h-4"/></button>
                      <button onClick={() => handleDelete(article._id)} className="text-red-600 hover:text-red-900 p-1"><Trash2 className="w-4 h-4"/></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}