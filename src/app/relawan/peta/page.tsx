import { verifyAuth } from '@/lib/auth';
import MapLoader from '@/components/MapLoader';

export default async function PetaWargaPage() {
  const user = await verifyAuth();

  return (
    <MapLoader userId={user?.id} userRole={user?.peran} />
  );
}