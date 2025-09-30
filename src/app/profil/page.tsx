import { verifyAuth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import { User as UserIcon, Mail, Phone, Award } from 'lucide-react';

// Fungsi untuk mengambil data lengkap user dari database
async function getUserDetails(userId: string) {
  await dbConnect();
  const user = await User.findById(userId).select('-kataSandi'); // Ambil semua data kecuali kata sandi
  if (!user) return null;
  return JSON.parse(JSON.stringify(user));
}

export default async function ProfilPage() {
  const session = verifyAuth();
  if (!session) {
    redirect('/login');
  }

  const user = await getUserDetails(session.id);

  if (!user) {
    return <div className="text-center p-8">Gagal memuat data pengguna.</div>;
  }

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Profil Saya</h1>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center mb-6 pb-6 border-b">
          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mr-4">
            <UserIcon className="w-8 h-8 text-gray-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">{user.namaLengkap}</h2>
            <p className="text-gray-500">{user.peran}</p>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center">
            <Mail className="w-5 h-5 text-gray-500 mr-3" />
            <span className="text-gray-700">{user.email}</span>
          </div>
          <div className="flex items-center">
            <Phone className="w-5 h-5 text-gray-500 mr-3" />
            <span className="text-gray-700">{user.noWa}</span>
          </div>
          
          {/* Tampilkan poin hanya jika pengguna adalah Relawan */}
          {user.peran === 'Relawan' && (
            <div className="flex items-center pt-4 border-t mt-4">
              <Award className="w-5 h-5 text-yellow-500 mr-3" />
              <span className="text-gray-700 font-semibold">{user.poin || 0} Poin Garda Tangguh</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}