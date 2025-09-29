import Link from 'next/link';
import dbConnect from '@/lib/dbConnect';
import Article from '@/models/Article';
import { notFound } from 'next/navigation';
import { ArrowLeft, User, Calendar } from 'lucide-react';

// Definisikan tipe data untuk sebuah artikel agar TypeScript senang
interface ArticleType {
  _id: string;
  judul: string;
  isiKonten: string;
  kategori: string;
  penulis: {
    _id: string;
    namaLengkap: string;
  };
  gambarUrl?: string;
  createdAt: string;
}

// Fungsi untuk mengambil SATU artikel spesifik berdasarkan ID-nya
async function getArticleById(id: string): Promise<ArticleType | null> {
  await dbConnect();
  // Gunakan try-catch untuk menangani ID yang formatnya tidak valid
  try {
    const article = await Article.findById(id).populate('penulis', 'namaLengkap');
    if (!article) {
      return null; 
    }
    return JSON.parse(JSON.stringify(article));
  } catch (error) {
    console.error("Gagal mencari artikel:", error);
    return null; 
  }
}

// Ini adalah komponen utama halaman
export default async function ArticleDetailPage({ params }: { params: { id: string } }) {
  const article = await getArticleById(params.id);

  if (!article) {
    notFound();
  }

  return (
    <div className="bg-white py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Tombol Kembali */}
        <div className="mb-8">
          <Link href="/warga/edukasi" className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors group">
            <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
            Kembali ke Semua Artikel
          </Link>
        </div>
        
        <article>
          {/* Header Artikel */}
          <header className="mb-8">
            <span className="text-sm font-semibold bg-blue-100 text-blue-700 px-3 py-1 rounded-full">{article.kategori}</span>
            <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 mt-4 leading-tight">
              {article.judul}
            </h1>
            <div className="flex flex-wrap items-center text-sm text-gray-500 mt-6 space-x-4">
              <div className="flex items-center">
                <User className="w-4 h-4 mr-2" />
                <span>Oleh: <strong>{article.penulis.namaLengkap}</strong></span>
              </div>
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                <span>Diterbitkan: {new Date(article.createdAt).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
              </div>
            </div>
          </header>
          

          {article.gambarUrl && (
            <figure className="mb-8">
              <img 
                src={article.gambarUrl} 
                alt={`Gambar untuk ${article.judul}`} 
                className="w-full h-auto max-h-[500px] object-cover rounded-xl shadow-lg"
              />
            </figure>
          )}

          <div 
            className="prose prose-lg max-w-none prose-p:text-gray-700 prose-headings:text-gray-900"
            dangerouslySetInnerHTML={{ __html: article.isiKonten.replace(/\n/g, '<br />') }} 
          />
        </article>
        
      </div>
    </div>
  );
}