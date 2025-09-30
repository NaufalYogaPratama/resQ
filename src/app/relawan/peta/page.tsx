import { verifyAuth } from '@/lib/auth';
import MapLoader from '@/components/MapLoader';

export default function PetaWargaPage() {
  const user = verifyAuth();

  return (
    <MapLoader userRole={user?.peran} />
  );
}