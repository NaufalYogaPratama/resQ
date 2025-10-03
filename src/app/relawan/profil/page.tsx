import { verifyAuth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import { User as UserIcon, Mail, Phone, Award } from 'lucide-react';
import Badges from '@/components/Badges';


async function getUserDetails(userId: string) {
  await dbConnect();
  const user = await User.findById(userId).select('-kataSandi'); 
  if (!user) return null;
  return JSON.parse(JSON.stringify(user));
}

export default async function ProfilRelawanPage() {
  const session = await verifyAuth();
  if (!session) {
    redirect('/login');
  }

  const user = await getUserDetails(session.id);


  if (user.peran !== 'Relawan') {
    redirect('/warga/profil');
  }

  return (
    <div className="bg-slate-50 min-h-screen p-4 sm:p-8 font-sans">
      <div className="max-w-4xl mx-auto space-y-8">
        <div data-aos="fade-down">
            <h1 className="text-4xl font-extrabold text-slate-900">Profil Saya</h1>
            <p className="mt-1 text-lg text-slate-600">Reputasi dan kontribusi Anda sebagai Garda Tangguh.</p>
        </div>
        
        {/* Kartu Profil Utama */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-md border border-slate-200" data-aos="fade-up">
          <div className="flex flex-col sm:flex-row items-center gap-6 mb-6 pb-6 border-b border-slate-200">
            <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center ring-4 ring-slate-200">
              <UserIcon className="w-12 h-12 text-slate-500" />
            </div>
            <div className="text-center sm:text-left">
              <h2 className="text-3xl font-bold text-slate-900">{user.namaLengkap}</h2>
              <p className="text-md font-semibold text-green-600">{user.peran}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="flex items-center">
              <Mail className="w-5 h-5 text-slate-400 mr-3 flex-shrink-0" />
              <span className="text-slate-700 break-all">{user.email}</span>
            </div>
            <div className="flex items-center">
              <Phone className="w-5 h-5 text-slate-400 mr-3 flex-shrink-0" />
              <span className="text-slate-700">{user.noWa}</span>
            </div>
            <div className="flex items-center sm:col-span-2 pt-4 border-t mt-4">
              <Award className="w-6 h-6 text-yellow-500 mr-3 flex-shrink-0" />
              <div>
                <span className="text-slate-800 text-lg font-bold">{user.poin || 0}</span>
                <span className="text-slate-500 ml-2">Poin Garda Tangguh</span>
              </div>
            </div>
          </div>
        </div>
        
        <div data-aos="fade-up" data-aos-delay="100">
            <Badges points={user.poin || 0} />
        </div>

      </div>
    </div>
  );
}