import { redirect } from "next/navigation";
import NavbarWarga from "@/components/NavbarWarga";
import { verifyAuth } from "@/lib/auth";
import EmergencyBanner from "@/components/EmergencyBanner";

export default async function WargaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = verifyAuth();

  if (!user || user.peran !== 'Warga') {
    redirect("/login?error=Unauthorized");
  }

  const userForNavbar = {
    name: user.nama,
    email: user.email,
    role: user.peran,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="sticky top-0 z-[1100]">
        <EmergencyBanner />
        <NavbarWarga user={userForNavbar} />
      </header>
      <main>
        {children}
      </main>
    </div>
  );
}