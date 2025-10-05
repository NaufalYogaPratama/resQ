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

  if (!user || user.peran !== "Admin") {
    redirect("/login?error=Unauthorized");
  }

  const SIDEBAR_WIDTH = "260px"; 

  return (
    <div className="h-screen flex flex-col bg-white font-sans overflow-hidden">

      <header className="fixed top-0 left-0 w-full z-50 bg-white shadow-sm">
        <AdminHeader />
      </header>


      <aside
        className="fixed left-0 bg-[#0B162C] text-white h-full pt-[72px] overflow-hidden"
        style={{ width: SIDEBAR_WIDTH }}
      >
        <SidebarAdmin user={user} />
      </aside>

   
      <main
        className="flex-1 overflow-y-auto bg-slate-100 p-6 mt-[72px]"
        style={{ marginLeft: SIDEBAR_WIDTH }}
      >
        <EmergencyBanner />
        <div className="mt-4">{children}</div>
      </main>
    </div>
  );
}
