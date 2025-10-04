// File: src/app/admin/peta/page.tsx

import { verifyAuth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import MapLoader from '@/components/MapLoader';

// Fungsi untuk mengambil daftar relawan
async function getVolunteers() {
  await dbConnect();
  const volunteers = await User.find({ peran: 'Relawan' }).select('_id namaLengkap').lean();
  return JSON.parse(JSON.stringify(volunteers));
}

export default async function PetaAdminPage() {
  const user = await verifyAuth();
  if (!user || user.peran !== 'Admin') {
    redirect('/login');
  }

  const volunteers = await getVolunteers();

  return (

    <div className="h-[calc(100vh-5rem)]"> 
      <MapLoader 
        userId={user.id} 
        userRole={user.peran as 'Admin'} 
        volunteers={volunteers} 
      />
    </div>
  );
}