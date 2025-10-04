"use client";

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Map, List, Package, User, LogOut, LayoutDashboard, Menu, X } from 'lucide-react';

type UserData = {
  nama?: string | null;
  email?: string | null;
  role?: string | null;
};

export default function NavbarRelawan({ user }: { user: UserData }) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/');
      router.refresh();
    } catch (error) {
      console.error('Gagal logout:', error);
      alert('Gagal untuk logout. Coba lagi.');
    }
  };

  const navLinks = [
    { name: 'Beranda', href: '/relawan/dashboard', icon: LayoutDashboard },
    { name: 'Peta Respon', href: '/relawan/peta', icon: Map },
    { name: 'Daftar Laporan', href: '/relawan/laporan', icon: List },
    { name: 'Bank Sumber Daya', href: '/relawan/sumber-daya', icon: Package },
  ];

  return (
    <nav className="bg-teal-900 border-b border-teal-800 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          <div className="flex items-center space-x-6">
            <Link href="/relawan/dashboard" className="flex items-center gap-3 text-3xl font-bold text-white">
              ResQ
              <span className="text-xs font-bold bg-white text-teal-800 px-2 py-0.5 rounded-full">
                RELAWAN
              </span>
            </Link>
            
            <div className="hidden md:flex items-center space-x-1">
              {navLinks.map((link) => (
                <Link 
                  key={link.name} 
                  href={link.href} 
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    pathname.startsWith(link.href)
                    ? 'bg-teal-700 text-white' 
                    : 'text-teal-200 hover:bg-teal-800 hover:text-white'
                  }`}
                >
                  <link.icon className="w-4 h-4 mr-2" />
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
          
          <div className="hidden md:flex items-center">
            <div className="relative">
              <button 
                onClick={() => setIsProfileOpen(!isProfileOpen)} 
                className="flex items-center justify-center w-10 h-10 bg-teal-800 rounded-full text-teal-200 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-teal-900 focus:ring-amber-400"
              >
                <User className="w-5 h-5" />
              </button>
              {isProfileOpen && (
                <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg py-1 bg-teal-900 ring-1 ring-teal-700 z-50">
                  <div className="px-4 py-3 border-b border-teal-700">
                    <p className="text-sm font-semibold text-white truncate" title={user?.nama || ''}>{user?.nama}</p>
                    <p className="text-xs text-teal-300 truncate" title={user?.email || ''}>{user?.email}</p>
                  </div>
                  <Link 
                    href="/relawan/profil" 
                    onClick={() => setIsProfileOpen(false)} 
                    className="flex items-center w-full text-left px-4 py-2 text-sm text-teal-200 hover:bg-teal-800"
                  >
                    <User className="w-4 h-4 mr-2" /> Profil Saya
                  </Link>
                  <button 
                    onClick={handleLogout} 
                    className="flex items-center w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-500/10"
                  >
                    <LogOut className="w-4 h-4 mr-2" /> Keluar
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-teal-200 hover:text-white hover:bg-teal-800 focus:outline-none"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden px-2 pt-2 pb-3 space-y-1 sm:px-3">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className={`flex items-center px-3 py-2 rounded-md text-base font-medium transition-colors ${
                pathname.startsWith(link.href) ? 'bg-teal-700 text-white' : 'text-teal-200 hover:bg-teal-800 hover:text-white'
              }`}
            >
              <link.icon className="w-5 h-5 mr-3" />
              {link.name}
            </Link>
          ))}
          <div className="pt-4 mt-4 border-t border-teal-700">
            <div className="mt-3 space-y-1">
              <div className="px-3 py-2">
                <p className="font-medium text-white">{user?.nama}</p>
                 <p className="text-sm text-teal-300">{user?.email}</p>
              </div>
              <Link href="/relawan/profil" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center w-full px-3 py-2 text-base font-medium text-teal-200 hover:bg-teal-800 rounded-md">
                <User className="w-5 h-5 mr-3" /> Profil Saya
              </Link>
              <button onClick={handleLogout} className="flex items-center w-full px-3 py-2 text-base font-medium text-red-400 hover:bg-red-500/10 rounded-md">
                <LogOut className="w-5 h-5 mr-3" /> Keluar
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}