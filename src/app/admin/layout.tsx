import { redirect } from "next/navigation";
import NavbarAdmin from "@/components/NavbarAdmin";
import { verifyAuth } from "@/lib/auth";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = verifyAuth();

  // Hanya user dengan peran 'Admin' yang diizinkan masuk
  if (!user || user.peran !== 'Admin') {
    redirect("/login?error=Unauthorized");
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <NavbarAdmin user={user} />
      <main>{children}</main>
    </div>
  );
}