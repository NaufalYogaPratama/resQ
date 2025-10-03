import { redirect } from "next/navigation";
import { verifyAuth } from "@/lib/auth";
import SidebarAdmin from "@/components/SidebarAdmin";
import AdminHeader from "@/components/AdminHeader";
import EmergencyBanner from "@/components/EmergencyBanner"; 

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await verifyAuth();

  if (!user || user.peran !== 'Admin') {
    redirect("/login?error=Unauthorized");
  }

  return (
    <div className="flex h-screen bg-slate-100 font-sans">
      {/* Sidebar Statis di Kiri */}
      <SidebarAdmin user={user} />
    
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader />
      
        <main className="flex-1 overflow-x-hidden overflow-y-auto">
            <EmergencyBanner />
            <div className="p-4 sm:p-8">
              {children}
            </div>
        </main>
      </div>
    </div>
  );
}
