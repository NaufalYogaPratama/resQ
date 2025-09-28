import { redirect } from "next/navigation";
import NavbarWarga from "@/components/NavbarWarga";
import { verifyAuth } from "@/lib/auth";

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
      <NavbarWarga user={userForNavbar} />
      <main>
        {children}
      </main>
    </div>
  );
}