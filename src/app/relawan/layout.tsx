import { redirect } from "next/navigation";
import NavbarRelawan from "@/components/NavbarRelawan";
import { verifyAuth } from "@/lib/auth";
import EmergencyBanner from "@/components/EmergencyBanner";


export default async function RelawanLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const user = await verifyAuth();

  if (!user || user.peran !== 'Relawan') {
    redirect("/login?error=Unauthorized");
  }


  const userForNavbar = {
    nama: user.nama,
    email: user.email,
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-[1100]">
        <EmergencyBanner />
        <NavbarRelawan user={userForNavbar} />
      </header>
      <main>{children}</main>
    </div>
  );
}