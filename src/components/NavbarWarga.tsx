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
  name?: string | null;
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
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            <Link href="/warga/dashboard" className="text-2xl font-bold text-blue-600">resQ</Link>
            <div className="hidden md:flex md:space-x-2">
              {navLinks.map((link) => (
                <Link key={link.name} href={link.href} className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${pathname === link.href ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'}`}>
                  <link.icon className="w-4 h-4 mr-2" />
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Link href="/warga/lapor" className="flex items-center bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-red-700 transition-all shadow-sm">
              <Siren className="w-4 h-4 mr-2" />
              Lapor!
            </Link>
            
            <div className="relative">
              <button onClick={() => setIsProfileOpen(!isProfileOpen)} className="flex items-center justify-center w-10 h-10 bg-gray-200 rounded-full text-gray-600 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                <User className="w-5 h-5" />
              </button>
              
              {isProfileOpen && (
                <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 z-50">
                  <div className="px-4 py-2 border-b">
                    <p className="text-sm font-semibold text-gray-800 truncate">{user?.name}</p>
                    <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                  </div>
                  <Link href="/profil" onClick={() => setIsProfileOpen(false)} className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    <User className="w-4 h-4 mr-2" /> Profil Saya
                  </Link>
                  <button onClick={handleLogout} className="flex items-center w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50">
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