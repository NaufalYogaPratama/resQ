import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-center p-4">
      <div className="max-w-2xl">
        
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-800 mb-4">
          Selamat Datang di <span className="text-blue-600">resQ</span>
        </h1>
        
        <p className="text-lg text-gray-600 mb-8">
          Platform Kesiapsiagaan dan Respons Bencana Berbasis Komunitas. Bersama kita lebih tangguh menghadapi krisis.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            href="/login"
            className="bg-blue-600 text-white font-semibold py-3 px-8 rounded-lg shadow-md hover:bg-blue-700 transition-all duration-300"
          >
            Masuk (Login)
          </Link>
          <Link 
            href="/register"
            className="bg-white text-blue-600 border border-blue-600 font-semibold py-3 px-8 rounded-lg shadow-md hover:bg-gray-100 transition-all duration-300"
          >
            Daftar (Register)
          </Link>
        </div>
        
      </div>
    </main>
  );
}