"use client";

import { useState, useEffect } from 'react';
import { Users as UsersIcon, Shield, Search } from 'lucide-react';

// Tipe data untuk pengguna
interface UserType {
  _id: string;
  namaLengkap: string;
  email: string;
  peran: 'Warga' | 'Relawan' | 'Admin';
}

export default function ManageUsersPage() {
    const [users, setUsers] = useState<UserType[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    const fetchUsers = async () => {
        setIsLoading(true);
        try {
            const res = await fetch('/api/users');
            const data = await res.json();
            if (data.success) {
                setUsers(data.data);
            } else {
                throw new Error(data.message || 'Gagal mengambil data pengguna.');
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleRoleChange = async (userId: string, newRole: string) => {
        if (!confirm(`Anda yakin ingin mengubah peran pengguna ini menjadi ${newRole}?`)) return;

        try {
            const res = await fetch(`/api/users/${userId}/role`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ peran: newRole }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message);

    
            setUsers(currentUsers => 
                currentUsers.map(u => u._id === userId ? { ...u, peran: data.data.peran } : u)
            );
            alert("Peran pengguna berhasil diperbarui.");

        } catch (err: any) {
            alert(`Error: ${err.message}`);
        }
    };

    const filteredUsers = users.filter(user => 
        user.namaLengkap.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8">
            <div data-aos="fade-down">
                <h1 className="text-4xl font-extrabold text-slate-900 flex items-center">
                    <UsersIcon className="w-10 h-10 mr-4 text-indigo-600"/>
                    Manajemen Pengguna
                </h1>
                <p className="mt-2 text-lg text-slate-600">Verifikasi relawan dan kelola semua pengguna terdaftar.</p>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl shadow-md" data-aos="fade-up">
                <div className="p-6 border-b flex flex-col sm:flex-row justify-between items-center gap-4">
                    <h2 className="text-2xl font-bold text-slate-900">Daftar Pengguna ({filteredUsers.length})</h2>
                    <div className="relative w-full sm:w-auto">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input 
                            type="text" 
                            placeholder="Cari nama atau email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2 border border-slate-300 rounded-lg w-full sm:w-64"
                        />
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200">
                        <thead className="bg-slate-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-bold text-slate-600 uppercase">Nama Lengkap</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-slate-600 uppercase">Email</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-slate-600 uppercase">Peran</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-slate-600 uppercase">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-slate-200">
                            {isLoading ? (
                                <tr><td colSpan={4} className="p-6 text-center text-slate-500">Memuat data...</td></tr>
                            ) : filteredUsers.map(user => (
                                <tr key={user._id} className="hover:bg-slate-50">
                                    <td className="px-6 py-4 font-medium text-slate-900">{user.namaLengkap}</td>
                                    <td className="px-6 py-4 text-slate-500">{user.email}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                            user.peran === 'Admin' ? 'bg-purple-100 text-purple-800' :
                                            user.peran === 'Relawan' ? 'bg-green-100 text-green-800' :
                                            'bg-slate-100 text-slate-800'
                                        }`}>{user.peran}</span>
                                    </td>
                                    <td className="px-6 py-4 text-sm font-medium space-x-4">
                                        {user.peran === 'Warga' && (
                                            <button onClick={() => handleRoleChange(user._id, 'Relawan')} className="text-green-600 hover:text-green-800 font-semibold">Jadikan Relawan</button>
                                        )}
                                        {user.peran === 'Relawan' && (
                                            <button onClick={() => handleRoleChange(user._id, 'Warga')} className="text-slate-500 hover:text-slate-700 font-semibold">Jadikan Warga</button>
                                        )}
                                    
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}