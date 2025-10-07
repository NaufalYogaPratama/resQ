
import Link from 'next/link';
import dbConnect from '@/lib/dbConnect';
import Article from '@/models/Article';
import { notFound } from 'next/navigation';
import { ArrowLeft, User, Calendar } from 'lucide-react';
import Image from 'next/image';


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


async function getArticleById(id: string): Promise<ArticleType | null> {
  await dbConnect();
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

export default async function ArticleDetailPage({ params }: { params: { id: string } }) {
  const article = await getArticleById(params.id);

  if (!article) {
    notFound();
  }

  return (
    <div className="bg-gradient-to-br from-indigo-50 via-white to-purple-50 min-h-screen text-slate-800 font-sans">
      <div className="max-w-4xl mx-auto py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
        
        <div className="mb-8" data-aos="fade-in">
          <Link href="/warga/edukasi" className="inline-flex items-center text-indigo-600 hover:text-indigo-500 transition-colors group font-semibold">
            <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
            Kembali ke Semua Artikel
          </Link>
        </div>
        
        <article>
          <header className="mb-8" data-aos="fade-up">
            <span className="text-sm font-semibold bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full">{article.kategori}</span>
            <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 mt-4 leading-tight">
              {article.judul}
            </h1>
            <div className="flex flex-wrap items-center text-sm text-slate-600 mt-6 space-x-4">
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
            <figure className="mb-8" data-aos="fade-up" data-aos-delay="100">
              <Image
                src={article.gambarUrl} 
                alt={`Gambar untuk ${article.judul}`} 
                className="w-full h-auto max-h-[500px] object-cover rounded-xl shadow-md border border-slate-200"
              />
            </figure>
          )}

      
          <div 
            data-aos="fade-up" data-aos-delay="200"
            className="prose prose-lg max-w-none prose-p:text-slate-700 prose-headings:text-slate-900 prose-strong:text-indigo-700 prose-a:text-indigo-600"
            dangerouslySetInnerHTML={{ __html: article.isiKonten }} 
          />
        </article>
        
      </div>
    </div>
  );
}
