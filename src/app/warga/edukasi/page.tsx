import Link from 'next/link';
import dbConnect from '@/lib/dbConnect';
import Article from '@/models/Article';

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
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Pusat Edukasi Kesiapsiagaan</h1>
        
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {articles.length > 0 ? (
            articles.map((article: ArticleType) => (
              <div key={article._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow flex flex-col">
                {article.gambarUrl && <img src={article.gambarUrl} alt={article.judul} className="w-full h-48 object-cover"/>}
                <div className="p-6 flex flex-col flex-grow">
                  <span className="text-sm bg-blue-100 text-blue-700 px-2 py-1 rounded-full self-start">{article.kategori}</span>
                  <h2 className="mt-4 text-xl font-bold text-gray-800 flex-grow">{article.judul}</h2>
                  
                  {/* --- INI BAGIAN YANG DIPERBAIKI --- */}
                  <div 
                    className="mt-2 text-gray-600 line-clamp-3 prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{ __html: article.isiKonten }}
                  />
                  
                  <div className="mt-4 pt-4 border-t">
                    <p className="text-xs text-gray-500">Penulis: {article.penulis.namaLengkap}</p>
                    <p className="text-xs text-gray-500">Diterbitkan: {new Date(article.createdAt).toLocaleDateString('id-ID')}</p>
                    <Link href={`/warga/edukasi/${article._id}`} className="text-blue-600 hover:underline mt-2 inline-block font-semibold">
                      Baca Selengkapnya →
                    </Link>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-600">Belum ada artikel edukasi yang tersedia.</p>
          )}
        </div>
      </div>
    </div>
  );
}