"use client";

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { BarChart3, Users, BookOpen, LogOut, Shield, ChevronDown, PieChart, ListChecks, Package, Map, Clock } from 'lucide-react';
import { useState } from 'react';


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
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/');
    } catch (error) {
      console.error('Gagal logout:', error);
    }
  };
  
  const navLinks = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: BarChart3 },
    { name: 'Analitik', href: '/admin/analitik', icon: PieChart }, 
    { name: 'Manajemen Laporan', href: '/admin/laporan', icon: ListChecks },
    { name: 'Manajemen Sumber Daya', href: '/admin/sumber-daya', icon: Package },
    { name: 'Manajemen User', href: '/admin/users', icon: Users },
    { name: 'Manajemen Konten', href: '/admin/edukasi', icon: BookOpen },
    { name: 'Manajemen Histori', href: '/admin/histori', icon: Clock },
    { name: 'Peta Respons', href: '/admin/peta', icon: Map },
  ];

  return (
    <aside className="w-64 flex-shrink-0 bg-slate-900 text-white flex flex-col">
      <div className="h-20 flex items-center justify-center text-2xl font-bold border-b border-slate-700">
        <Link href="/admin/dashboard" className="flex items-center gap-2">
  
            ResQ <span className="font-normal text-slate-400 text-xl">Admin</span>
        </Link>
      </div>
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navLinks.map((link) => (
          <Link
            key={link.name}
            href={link.href}
            className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors text-sm font-medium ${
              pathname.startsWith(link.href)
                ? 'bg-indigo-600 text-white shadow-lg'
                : 'text-slate-400 hover:bg-slate-700 hover:text-white'
            }`}
          >
            <link.icon className="w-5 h-5" />
            <span>{link.name}</span>
          </Link>
        ))}
      </nav>
      
      <div className="p-4 border-t border-slate-700">
        <div className="relative">
            <button 
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-slate-700"
            >
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center font-bold">
                        {user.nama?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-left text-white">{user.nama}</p>
                        <p className="text-xs text-slate-400">{user.peran}</p>
                    </div>
                </div>
                <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
            </button>
            {isProfileOpen && (
                <div className="absolute bottom-full left-0 right-0 mb-2 w-full bg-slate-800 rounded-lg shadow-lg overflow-hidden ring-1 ring-slate-700">
                    <button 
                        onClick={handleLogout} 
                        className="flex items-center gap-3 w-full px-4 py-3 text-sm text-red-400 hover:bg-red-500/10"
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