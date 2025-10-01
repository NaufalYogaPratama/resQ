import { verifyAuth } from '@/lib/auth';
import MapLoader from '@/components/MapLoader'; 
import { redirect } from 'next/navigation';

export default function PetaWargaPage() {
  const user = verifyAuth();

  // Pengaman tambahan jika user mencoba akses langsung
  if (!user) {
    redirect('/login');
  }

  return (
    <div>
      {/* Meneruskan ID dan Peran pengguna ke komponen peta */}
      <MapLoader userId={user?.id} userRole={user?.peran} />
    </div>
  );
}