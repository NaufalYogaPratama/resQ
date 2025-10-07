"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
    BarChart3, Users, BookOpen, ToggleRight, 
    LogOut, User as UserIcon, Loader2, ListChecks 
} from 'lucide-react';

type UserData = {
  nama?: string | null;
  email?: string | null;
};

export default function NavbarAdmin({ user }: { user: UserData }) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isEmergency, setIsEmergency] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  const navLinks = [
      { name: "Dashboard", href: "/admin/dashboard", icon: BarChart3 },
      { name: "Laporan", href: "/admin/laporan", icon: ListChecks },
      { name: "Pengguna", href: "/admin/users", icon: Users },
      { name: "Edukasi", href: "/admin/edukasi", icon: BookOpen },
  ];

  useEffect(() => {
    const fetchEmergencyStatus = async () => {
      try {
        const res = await fetch('/api/settings/emergency-mode', { cache: 'no-store' });
        const data = await res.json();
        if (data.success) {
          setIsEmergency(data.isEmergency);
        }
      } catch (error) {
        console.error("Gagal mengambil status mode darurat:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchEmergencyStatus();
  }, []);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/');
      router.refresh();
    } catch (error) {
      console.error('Gagal logout:', error);
    }
  };

  const handleToggleEmergency = async () => {
    if (!confirm(`Anda yakin ingin mengubah Mode Darurat menjadi ${isEmergency ? 'NONAKTIF' : 'AKTIF'}?`)) {
      return;
    }
    
    setIsLoading(true); 
    try {
      const res = await fetch('/api/settings/emergency-mode', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setIsEmergency(data.isEmergency);
        alert(`Mode Darurat sekarang: ${data.isEmergency ? 'AKTIF' : 'NONAKTIF'}`);
        router.refresh();
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
        if (error instanceof Error) {
            alert(`Gagal mengubah mode darurat: ${error.message}`);
        } else {
            alert("Gagal mengubah mode darurat karena kesalahan tidak dikenal.");
        }
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <nav className="bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center space-x-6">
            <Link href="/admin/dashboard" className="flex items-center gap-2 text-2xl font-bold text-slate-900">
                ResQ
                <span className="text-xs font-semibold bg-indigo-600 text-white px-2 py-0.5 rounded-md">Admin</span>
            </Link>
            <div className="hidden md:flex md:space-x-2">
              {navLinks.map(link => (
                  <Link key={link.name} href={link.href} className={`flex items-center px-3 py-2 rounded-md text-sm font-semibold transition-colors ${
                      pathname.startsWith(link.href) ? 'bg-indigo-100 text-indigo-700' : 'text-slate-600 hover:bg-slate-100'
                  }`}>
                      <link.icon className="w-4 h-4 mr-2" />{link.name}
                  </Link>
              ))}
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={handleToggleEmergency}
              disabled={isLoading}
              className={`flex items-center px-4 py-2 rounded-lg text-sm font-semibold transition-colors shadow-sm disabled:opacity-70 ${isEmergency ? 'bg-red-600 hover:bg-red-700 text-white' : 'bg-slate-200 hover:bg-slate-300 text-slate-800'}`}
            >
              {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin"/> : <ToggleRight className={`w-4 h-4 mr-2 transition-transform ${isEmergency ? '' : '-scale-x-100'}`}/>} 
              Mode Darurat: {isEmergency ? 'ON' : 'OFF'}
            </button>
            <div className="relative">
              <button onClick={() => setIsProfileOpen(!isProfileOpen)} className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 text-slate-700">
                <UserIcon className="w-5 h-5"/>
              </button>
              {isProfileOpen && (
                   <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 z-50 text-slate-800">
                     <div className="px-4 py-3 border-b">
                       <p className="text-sm font-semibold truncate" title={user?.nama || ''}>{user?.nama}</p>
                     </div>
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
