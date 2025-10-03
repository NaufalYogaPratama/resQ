import { verifyAuth } from '@/lib/auth';
import MapLoader from '@/components/MapLoader'; 
import { redirect } from 'next/navigation';

export default async function PetaAdminPage() {
  const user = await verifyAuth();
  if (!user || user.peran !== 'Admin') {
    redirect('/login');
  }

  return (
    <div style={{ height: 'calc(100vh - 5rem - 2.25rem)' }}> 
      <MapLoader userId={user?.id} userRole={user?.peran} />
    </div>
  );
}