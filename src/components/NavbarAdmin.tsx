"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { BarChart2, Users, BookOpen, ToggleRight, LogOut, User as UserIcon } from 'lucide-react';

type UserData = {
  name?: string | null;
  email?: string | null;
};

export default function NavbarAdmin({ user }: { user: UserData }) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isEmergency, setIsEmergency] = useState(false);
  const router = useRouter();

  // Cek status mode darurat saat komponen dimuat
  useEffect(() => {
    const fetchEmergencyStatus = async () => {
      try {
        const res = await fetch('/api/settings/emergency-mode');
        const data = await res.json();
        if (data.success) {
          setIsEmergency(data.isEmergency);
        }
      } catch (error) {
        console.error("Gagal mengambil status mode darurat:", error);
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
    try {
      const res = await fetch('/api/settings/emergency-mode', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setIsEmergency(data.isEmergency);
        alert(`Mode Darurat sekarang: ${data.isEmergency ? 'AKTIF' : 'NONAKTIF'}`);
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error('Gagal mengubah mode darurat:', error);
      alert('Gagal mengubah mode darurat. Pastikan Anda adalah Admin.');
    }
  };

  return (
    <nav className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-6">
            <Link href="/admin/dashboard" className="text-2xl font-bold">resQ (Admin)</Link>
            <div className="hidden md:flex md:space-x-4">
              <Link href="/admin/analitik" className="flex items-center px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700"><BarChart2 className="w-4 h-4 mr-2" />Analitik</Link>
              <Link href="/admin/users" className="flex items-center px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700"><Users className="w-4 h-4 mr-2" />Manajemen User</Link>
              <Link href="/admin/edukasi" className="flex items-center px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700"><BookOpen className="w-4 h-4 mr-2" />Manajemen Konten</Link>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button 
              onClick={handleToggleEmergency}
              className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${isEmergency ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-600 hover:bg-gray-700'}`}
            >
              <ToggleRight className="w-4 h-4 mr-2"/> Mode Darurat: {isEmergency ? 'ON' : 'OFF'}
            </button>
            <div className="relative">
              <button onClick={() => setIsProfileOpen(!isProfileOpen)} className="p-2 rounded-full hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
                <UserIcon className="w-5 h-5"/>
              </button>
              {isProfileOpen && (
                 <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 z-50 text-gray-800">
                    <div className="px-4 py-3 border-b">
                      <p className="text-sm font-semibold truncate" title={user?.name || ''}>{user?.name}</p>
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