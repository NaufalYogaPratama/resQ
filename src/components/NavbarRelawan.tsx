"use client";

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Map, List, Package, User, LogOut,
  LayoutDashboard, Menu, X
} from 'lucide-react';

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
  <nav className="backdrop-blur-xl bg-gradient-to-r from-[#1E1E3A]/90 via-[#2A3B7A]/90 to-[#1B2C5E]/90 border-b border-white/10 shadow-[0_0_20px_rgba(59,130,246,0.3)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">

          {/* Logo */}
          <div className="flex items-center space-x-6">
            <Link
              href="/relawan/dashboard"
              className="flex items-center gap-3 text-3xl font-bold text-white tracking-wide"
            >
              <span className="drop-shadow-[0_0_8px_rgba(56,189,248,0.6)]">
                ResQ
              </span>
              <span className="text-xs font-bold bg-gradient-to-r from-cyan-400 to-violet-500 px-2 py-0.5 rounded-full text-white shadow-md">
                RELAWAN
              </span>
            </Link>

            {/* Menu Desktop */}
            <div className="hidden md:flex items-center space-x-1">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    pathname.startsWith(link.href)
                      ? 'bg-gradient-to-r from-indigo-500/80 to-cyan-500/80 text-white shadow-[0_0_10px_rgba(56,189,248,0.4)]'
                      : 'text-slate-200 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <link.icon className="w-4 h-4 mr-2" />
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Profile Desktop */}
          <div className="hidden md:flex items-center">
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-indigo-600 to-cyan-500 rounded-full text-white hover:scale-105 shadow-md hover:shadow-[0_0_15px_rgba(56,189,248,0.5)] transition-all"
              >
                <User className="w-5 h-5" />
              </button>
              {isProfileOpen && (
                <div className="origin-top-right absolute right-0 mt-3 w-60 rounded-xl shadow-xl bg-[#10172A]/95 border border-white/10 backdrop-blur-md z-50">
                  <div className="px-4 py-3 border-b border-white/10">
                    <p className="text-sm font-semibold text-white truncate">{user?.nama}</p>
                    <p className="text-xs text-slate-300 truncate">{user?.email}</p>
                  </div>
                  <Link
                    href="/relawan/profil"
                    onClick={() => setIsProfileOpen(false)}
                    className="flex items-center px-4 py-2 text-sm text-slate-200 hover:bg-white/10 transition-all"
                  >
                    <User className="w-4 h-4 mr-2" /> Profil Saya
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 transition-all"
                  >
                    <LogOut className="w-4 h-4 mr-2" /> Keluar
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-slate-200 hover:text-white hover:bg-white/10 focus:outline-none"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-[#0F172A]/95 border-t border-white/10 backdrop-blur-md px-2 pt-2 pb-4 space-y-1 sm:px-3">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className={`flex items-center px-4 py-3 rounded-md text-base font-medium transition-all ${
                pathname.startsWith(link.href)
                  ? 'bg-gradient-to-r from-indigo-500 to-cyan-500 text-white shadow-lg'
                  : 'text-slate-200 hover:bg-white/10 hover:text-white'
              }`}
            >
              <link.icon className="w-5 h-5 mr-3" />
              {link.name}
            </Link>
          ))}
          <div className="pt-4 mt-4 border-t border-white/10">
            <div className="px-3 py-2">
              <p className="font-medium text-white">{user?.nama}</p>
              <p className="text-sm text-slate-400">{user?.email}</p>
            </div>
            <Link
              href="/relawan/profil"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center px-3 py-2 text-base text-slate-200 hover:bg-white/10 rounded-md"
            >
              <User className="w-5 h-5 mr-3" /> Profil Saya
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center px-3 py-2 text-base text-red-400 hover:bg-red-500/10 rounded-md"
            >
              <LogOut className="w-5 h-5 mr-3" /> Keluar
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
