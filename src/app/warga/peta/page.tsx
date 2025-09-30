import { verifyAuth } from '@/lib/auth';
import MapLoader from '@/components/MapLoader'; 

export default function PetaWargaPage() {
  const user = verifyAuth();
  return (
    <div>
      {/* Cukup panggil MapLoader di sini */}
      <MapLoader userId={user?.id} userRole={user?.peran} />
    </div>
  );
}