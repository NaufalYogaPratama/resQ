"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  BarChart3,
  Users,
  BookOpen,
  LogOut,
  ChevronDown,
  PieChart,
  ListChecks,
  Package,
  Map,
  Clock,
} from "lucide-react";
import { useState } from "react";

interface UserData {
  nama: string;
  peran: string;
}

export default function SidebarAdmin({ user }: { user: UserData }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/");
    } catch (error) {
      console.error("Gagal logout:", error);
    }
  };

  const navLinks = [
    { name: "Dashboard", href: "/admin/dashboard", icon: BarChart3 },
    { name: "Analitik", href: "/admin/analitik", icon: PieChart },
    { name: "Manajemen Laporan", href: "/admin/laporan", icon: ListChecks },
    { name: "Manajemen Sumber Daya", href: "/admin/sumber-daya", icon: Package },
    { name: "Manajemen User", href: "/admin/users", icon: Users },
    { name: "Manajemen Konten", href: "/admin/edukasi", icon: BookOpen },
    { name: "Manajemen Histori", href: "/admin/histori", icon: Clock },
    { name: "Peta Respons", href: "/admin/peta", icon: Map },
  ];

  return (
    <aside className="w-64 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white flex flex-col shadow-lg rounded-tr-2xl overflow-hidden">
      <nav className="flex-1 px-4 py-6 space-y-1">
        {navLinks.map((link) => (
          <Link
            key={link.name}
            href={link.href}
            className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
              pathname.startsWith(link.href)
                ? "bg-gradient-to-r from-blue-600 to-cyan-400 text-white shadow-md shadow-cyan-400/30"
                : "text-slate-400 hover:text-white hover:bg-slate-700/40"
            }`}
          >
            <link.icon className="w-5 h-5" />
            <span>{link.name}</span>
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-700 bg-slate-900/60">
        <div className="relative">
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-slate-800/70 transition-all duration-200"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-tr from-blue-600 to-cyan-400 rounded-full flex items-center justify-center font-bold shadow-md shadow-blue-500/30">
                {user.nama?.charAt(0).toUpperCase()}
              </div>
              <div className="text-left">
                <p className="text-sm font-semibold text-white leading-tight">
                  {user.nama}
                </p>
                <p className="text-xs text-slate-400">{user.peran}</p>
              </div>
            </div>
            <ChevronDown
              className={`w-5 h-5 text-slate-400 transition-transform duration-200 ${
                isProfileOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {isProfileOpen && (
            <div className="absolute bottom-full left-0 right-0 mb-2 w-full bg-slate-800 rounded-xl shadow-lg overflow-hidden border border-slate-700 backdrop-blur-sm">
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 w-full px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 transition-colors duration-200"
              >
                <LogOut className="w-5 h-5" />
                <span>Keluar</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
