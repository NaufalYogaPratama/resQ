import Link from 'next/link';
import dbConnect from '@/lib/dbConnect';
import Article from '@/models/Article';
import User from '@/models/User';
import { ClipboardList, BookOpen, Clock } from 'lucide-react';

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

async function getArticles(): Promise<ArticleType[]> {
  await dbConnect();
  const articles = await Article.find({}).sort({ createdAt: -1 }).populate('penulis', 'namaLengkap');
  return JSON.parse(JSON.stringify(articles));
}

export default async function EdukasiPage() {
  const articles: ArticleType[] = await getArticles();

  return (
    <div className="bg-gradient-to-br from-slate-50 via-white to-indigo-50 min-h-screen text-slate-800 p-4 sm:p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        <div data-aos="fade-down">
          <h1 className="text-4xl font-bold flex items-center text-slate-900">
            <BookOpen className="w-10 h-10 mr-4 text-indigo-600"/>
            Pusat Edukasi Kesiapsiagaan
          </h1>
          <p className="mt-2 text-lg text-slate-600">Tingkatkan pengetahuan Anda untuk membangun komunitas yang lebih tangguh.</p>
        </div>

        <div className="mt-12" data-aos="fade-up">
            <Link href="/warga/edukasi/histori" className="block bg-indigo-700 text-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
                <div className="flex items-center gap-4">
                    <Clock className="w-12 h-12" />
                    <div>
                        <h2 className="text-2xl font-bold">Modul Interaktif: Belajar dari Krisis Lalu</h2>
                        <p className="mt-1 text-indigo-200">Lihat visualisasi timeline dan peta dampak bencana historis di Semarang.</p>
                    </div>
                </div>
            </Link>
        </div>
        
        <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          
          {articles.length > 0 ? (
            articles.map((article: ArticleType, index: number) => (
              <div key={article._id} data-aos="fade-up" data-aos-delay={index * 100}>
                <Link href={`/warga/edukasi/${article._id}`} className="block bg-white border border-slate-200 rounded-2xl shadow-md overflow-hidden h-full group transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                  {article.gambarUrl && <img src={article.gambarUrl} alt={article.judul} className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"/>}
                  <div className="p-6">
                    <span className="text-sm bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full font-semibold">{article.kategori}</span>
                    <h2 className="mt-4 text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{article.judul}</h2>
                    <div 
                      className="mt-2 text-slate-600 line-clamp-3 text-sm prose prose-sm max-w-none"
                      dangerouslySetInnerHTML={{ __html: article.isiKonten }}
                    />
                    <div className="mt-4 pt-4 border-t border-slate-200 text-xs text-slate-500">
                      <span>Oleh {article.penulis.namaLengkap}</span>
                      <span className="mx-2">•</span>
                      <span>{new Date(article.createdAt).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                    </div>
                  </div>
                </Link>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-20 bg-white border border-dashed border-slate-200 rounded-xl">
              <p className="text-slate-600">Belum ada artikel edukasi yang tersedia.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}