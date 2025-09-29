import { redirect } from "next/navigation";
import NavbarRelawan from "@/components/NavbarRelawan";
import { verifyAuth } from "@/lib/auth";

export default async function RelawanLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = verifyAuth();

  // Hanya user dengan peran 'Relawan' yang diizinkan masuk
  if (!user || user.peran !== 'Relawan') {
    redirect("/login?error=Unauthorized");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <NavbarRelawan user={user} />
      <main>{children}</main>
    </div>
  );
}