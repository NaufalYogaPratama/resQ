import Link from 'next/link';
import dbConnect from '@/lib/dbConnect';
import Article from '@/models/Article';
import { BookOpen } from 'lucide-react';

// Definisikan tipe data untuk sebuah artikel
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

// Fungsi untuk mengambil data langsung di server
async function getArticles(): Promise<ArticleType[]> {
  await dbConnect();
  const articles = await Article.find({}).sort({ createdAt: -1 }).populate('penulis', 'namaLengkap');
  return JSON.parse(JSON.stringify(articles));
}

export default async function EdukasiPage() {
  const articles: ArticleType[] = await getArticles();

  return (
    <div className="bg-slate-900 min-h-screen text-white p-4 sm:p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        <div data-aos="fade-down">
          <h1 className="text-4xl font-bold flex items-center">
            <BookOpen className="w-10 h-10 mr-4 text-amber-400"/>
            Pusat Edukasi Kesiapsiagaan
          </h1>
          <p className="mt-2 text-lg text-slate-400">Tingkatkan pengetahuan Anda untuk membangun komunitas yang lebih tangguh.</p>
        </div>
        
        <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {articles.length > 0 ? (
            articles.map((article: ArticleType, index: number) => (
              <div key={article._id} data-aos="fade-up" data-aos-delay={index * 100}>
                <Link href={`/warga/edukasi/${article._id}`} className="block bg-white/5 border border-white/10 rounded-2xl shadow-lg backdrop-blur-lg overflow-hidden h-full group transition-all duration-300 hover:border-amber-400/50">
                  {article.gambarUrl && <img src={article.gambarUrl} alt={article.judul} className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"/>}
                  <div className="p-6">
                    <span className="text-sm bg-amber-500/10 text-amber-300 px-3 py-1 rounded-full font-semibold">{article.kategori}</span>
                    <h2 className="mt-4 text-xl font-bold text-white group-hover:text-amber-400 transition-colors">{article.judul}</h2>
                    <div 
                      className="mt-2 text-slate-400 line-clamp-3 text-sm prose prose-sm prose-invert max-w-none"
                      dangerouslySetInnerHTML={{ __html: article.isiKonten }}
                    />
                    <div className="mt-4 pt-4 border-t border-white/10 text-xs text-slate-500">
                      <span>Oleh {article.penulis.namaLengkap}</span>
                      <span className="mx-2">•</span>
                      <span>{new Date(article.createdAt).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                    </div>
                  </div>
                </Link>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-20 bg-white/5 border border-dashed border-white/20 rounded-xl">
              <p className="text-slate-400">Belum ada artikel edukasi yang tersedia.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}