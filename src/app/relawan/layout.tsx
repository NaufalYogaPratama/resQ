import { redirect } from "next/navigation";
import NavbarRelawan from "@/components/NavbarRelawan";
import { verifyAuth } from "@/lib/auth";

export default async function RelawanLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = verifyAuth();

  if (!user || user.peran !== 'Relawan') {
    redirect("/login?error=Unauthorized");
  }

  const userForNavbar = {
    name: user.nama,
    email: user.email,
    role: user.peran,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <NavbarRelawan user={userForNavbar} />
      <main>{children}</main>
    </div>
  );
}