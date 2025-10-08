"use client";

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation'; 
import { 
  LayoutDashboard, 
  Map, 
  Siren, 
  Package, 
  BookOpen, 
  User, 
  LogOut,
  Menu,
  X 
} from 'lucide-react';

type UserData = {
  nama?: string | null;
  email?: string | null;
};

export default function NavbarWarga({ user }: { user: UserData }) {
  const pathname = usePathname();
  const router = useRouter(); 
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
    <nav className="sticky top-0 z-[1100] bg-indigo-900 border-b border-indigo-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Navigasi Desktop */}
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-6">
              {/* Semua props (href, className) dimasukkan ke dalam tag Link */}
              <Link 
                href="/relawan/dashboard"
                className="flex items-center gap-3"
              >
                <Image
                  src="/ResQLogoPutih.png"
                  alt="ResQ Logo"
                  width={70}
                  height={70}
                  className="h-7 w-auto transition-transform duration-300"
                  priority
                />                
                <span className="text-xs font-bold bg-indigo-500 px-2 py-0.5 rounded-full text-white shadow-md">
                  WARGA
                </span>
              </Link>
            </div>
            <div className="hidden md:flex items-center space-x-1">
              {navLinks.map((link) => (
                <Link 
                  key={link.name} 
                  href={link.href} 
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    pathname.startsWith(link.href)
                    ? 'bg-indigo-500 text-white' 
                    : 'text-indigo-100 hover:bg-indigo-800 hover:text-white'
                  }`}
                >
                  <link.icon className="w-4 h-4 mr-2" />
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Aksi di Kanan (Desktop) */}
          <div className="hidden md:flex items-center space-x-4">
            <Link 
              href="/warga/laporan" 
              className="flex items-center bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-red-500 transition-colors shadow-sm"
            >
              <Siren className="w-4 h-4 mr-2" />
              Lapor Darurat
            </Link>
            <div className="relative">
              <button onClick={() => setIsProfileOpen(!isProfileOpen)} className="flex items-center justify-center w-10 h-10 bg-indigo-800 rounded-full text-indigo-100 hover:bg-indigo-700 focus:outline-none">
                <User className="w-5 h-5" />
              </button>
              {isProfileOpen && (
                <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg py-1 bg-indigo-900 ring-1 ring-indigo-700 z-50">
                  <div className="px-4 py-3 border-b border-indigo-700">
                    <p className="text-sm font-semibold text-white truncate">{user?.nama}</p>
                    <p className="text-xs text-indigo-300 truncate">{user?.email}</p>
                  </div>
                  <Link href="/warga/profil" onClick={() => setIsProfileOpen(false)} className="flex items-center w-full text-left px-4 py-2 text-sm text-indigo-100 hover:bg-indigo-800">
                    <User className="w-4 h-4 mr-2" /> Profil Saya
                  </Link>
                  <button onClick={handleLogout} className="flex items-center w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-500/10">
                    <LogOut className="w-4 h-4 mr-2" /> Keluar
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Tombol Hamburger (Mobile) */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-indigo-200 hover:text-white hover:bg-indigo-800 focus:outline-none"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Menu Mobile (Muncul saat hamburger diklik) */}
      {isMobileMenuOpen && (
        <div className="md:hidden px-2 pt-2 pb-3 space-y-1 sm:px-3">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className={`flex items-center px-3 py-2 rounded-md text-base font-medium transition-colors ${
                pathname.startsWith(link.href)
                ? 'bg-indigo-500 text-white'
                : 'text-indigo-100 hover:bg-indigo-800 hover:text-white'
              }`}
            >
              <link.icon className="w-5 h-5 mr-3" />
              {link.name}
            </Link>
          ))}
          <div className="pt-4 mt-4 border-t border-indigo-700 space-y-3">
             <Link href="/warga/laporan" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center justify-center bg-red-600 text-white px-4 py-3 rounded-lg text-base font-semibold hover:bg-red-500">
                <Siren className="w-5 h-5 mr-2" />
                Lapor Darurat
              </Link>
              <div className="pt-2 border-t border-indigo-700">
                <div className="px-4 py-3">
                  <p className="text-sm font-semibold text-white truncate">{user?.nama}</p>
                  <p className="text-xs text-indigo-300 truncate">{user?.email}</p>
                </div>
                 <Link href="/warga/profil" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center w-full text-left px-3 py-2 text-base font-medium text-indigo-100 hover:bg-indigo-800 rounded-md">
                  <User className="w-5 h-5 mr-3" /> Profil Saya
                </Link>
                <button onClick={handleLogout} className="flex items-center w-full text-left mt-1 px-3 py-2 text-base font-medium text-red-400 hover:bg-red-500/10 rounded-md">
                  <LogOut className="w-5 h-5 mr-3" /> Keluar
                </button>
              </div>
          </div>
        </div>
      )}
    </nav>
  );
}