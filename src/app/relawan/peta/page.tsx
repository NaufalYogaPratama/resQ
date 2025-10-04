import { verifyAuth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import MapLoader from '@/components/MapLoader';

export default async function PetaWargaPage() {
  const user = await verifyAuth();

  if (!user) {
    redirect("/login");
  }

  return (

    <div className="h-[calc(100vh-5rem)] w-full">
      <MapLoader 
        userId={user.id} 
        userRole={user.peran as 'Warga' | 'Relawan' | 'Admin'} 
      />
    </div>
  );
}