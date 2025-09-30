"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Map, List, Package, User, LogOut } from 'lucide-react';

// Definisikan tipe data untuk user props agar TypeScript tidak error
type UserData = {
  name?: string | null;
  email?: string | null;
  role?: string | null;
};

export default function NavbarRelawan({ user }: { user: UserData }) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const router = useRouter();

  // Implementasi fungsi logout manual
  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      // Arahkan ke homepage setelah logout berhasil
      router.push('/');
      router.refresh();
    } catch (error) {
      console.error('Gagal logout:', error);
      alert('Gagal untuk logout. Coba lagi.');
    }
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            <Link href="/relawan/dashboard" className="text-2xl font-bold text-green-600">resQ (Relawan)</Link>
            <div className="hidden md:flex md:space-x-2">
              <Link href="/relawan/peta" className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:bg-gray-100">
                <Map className="w-4 h-4 mr-2" />Peta Respon
              </Link>
              <Link href="/relawan/laporan" className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:bg-gray-100">
                <List className="w-4 h-4 mr-2" />Daftar Laporan
              </Link>
              <Link href="/relawan/sumber-daya" className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:bg-gray-100">
                <Package className="w-4 h-4 mr-2" />Bank Sumber Daya
              </Link>
            </div>
          </div>
          
          {/* Menu Profil dan Logout yang sudah diimplementasikan */}
          <div className="flex items-center">
            <div className="relative">
              <button 
                onClick={() => setIsProfileOpen(!isProfileOpen)} 
                className="flex items-center justify-center w-10 h-10 bg-gray-200 rounded-full text-gray-600 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                <User className="w-5 h-5" />
              </button>
              
              {isProfileOpen && (
                <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 z-50">
                  <div className="px-4 py-3 border-b">
                    <p className="text-sm font-semibold text-gray-800 truncate" title={user?.name || ''}>{user?.name}</p>
                    <p className="text-xs text-gray-500 truncate" title={user?.email || ''}>{user?.email}</p>
                  </div>
                  <Link 
                    href="/profil" 
                    onClick={() => setIsProfileOpen(false)} 
                    className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <User className="w-4 h-4 mr-2" /> Profil Saya
                  </Link>
                  <button 
                    onClick={handleLogout} 
                    className="flex items-center w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
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