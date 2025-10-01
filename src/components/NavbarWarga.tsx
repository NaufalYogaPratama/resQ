"use client";

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation'; 
import { 
  LayoutDashboard, 
  Map, 
  Siren, 
  Package, 
  BookOpen, 
  User, 
  LogOut 
} from 'lucide-react';

type UserData = {
  nama?: string | null;
  email?: string | null;
};

export default function NavbarWarga({ user }: { user: UserData }) {
  const pathname = usePathname();
  const router = useRouter(); 
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/');
      router.refresh();
    } catch (error) {
      console.error('Gagal logout:', error);
    }
  };

  const navLinks = [
    { name: 'Beranda', href: '/warga/dashboard', icon: LayoutDashboard },
    { name: 'Peta Respon', href: '/warga/peta', icon: Map },
    { name: 'Sumber Daya', href: '/warga/sumber-daya', icon: Package },
    { name: 'Edukasi', href: '/warga/edukasi', icon: BookOpen },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-slate-900 border-b border-slate-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center space-x-4">
            <Link href="/warga/dashboard" className="text-3xl font-bold text-white">ResQ</Link>
            <div className="hidden md:flex md:space-x-2">
              {navLinks.map((link) => (
                <Link 
                  key={link.name} 
                  href={link.href} 
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    pathname === link.href 
                    ? 'bg-amber-500/10 text-amber-400' 
                    : 'text-slate-300 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <link.icon className="w-4 h-4 mr-2" />
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <Link href="/warga/lapor" className="flex items-center bg-amber-500 text-black px-4 py-2 rounded-md text-sm font-semibold hover:bg-amber-400 transition-colors shadow-sm">
              <Siren className="w-4 h-4 mr-2" />
              Lapor Darurat
            </Link>
            
            <div className="relative">
              <button onClick={() => setIsProfileOpen(!isProfileOpen)} className="flex items-center justify-center w-10 h-10 bg-white/10 rounded-full text-slate-300 hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-amber-500">
                <User className="w-5 h-5" />
              </button>
              
              {isProfileOpen && (
                <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg py-1 bg-slate-800 ring-1 ring-white/10 z-50">
                  <div className="px-4 py-3 border-b border-white/10">
                    <p className="text-sm font-semibold text-white truncate">{user?.nama}</p>
                    <p className="text-xs text-slate-400 truncate">{user?.email}</p>
                  </div>
                  <Link href="/warga/profil" onClick={() => setIsProfileOpen(false)} className="flex items-center w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-white/5">
                    <User className="w-4 h-4 mr-2" /> Profil Saya
                  </Link>
                  <button onClick={handleLogout} className="flex items-center w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-500/10">
                    <LogOut className="w-4 h-4 mr-2" /> Keluar
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

