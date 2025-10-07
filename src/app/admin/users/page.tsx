"use client";

import { useState, useEffect } from 'react';
import { Users as UsersIcon, Search, CheckCircle } from 'lucide-react';

interface UserType {
  _id: string;
  namaLengkap: string;
  email: string;
  peran: 'Warga' | 'Relawan' | 'Admin';
  statusRelawan?: 'None' | 'Diajukan' | 'Diterima'; 
}

export default function ManageUsersPage() {
    const [users, setUsers] = useState<UserType[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchUsers = async () => {
            setIsLoading(true);
            setError(''); 
            try {
                const res = await fetch('/api/users');
                const data = await res.json();
                if (data.success) {
                    const sortedUsers = data.data.sort((a: UserType, b: UserType) => {
                        if (a.statusRelawan === 'Diajukan' && b.statusRelawan !== 'Diajukan') return -1;
                        if (a.statusRelawan !== 'Diajukan' && b.statusRelawan === 'Diajukan') return 1;
                        return a.namaLengkap.localeCompare(b.namaLengkap);
                    });
                    setUsers(sortedUsers);
                } else {
                    throw new Error(data.message || "Gagal mengambil data pengguna.");
                }
            } catch (err) {
                if (err instanceof Error) {
                    setError(err.message); 
                } else {
                    setError("Terjadi kesalahan yang tidak diketahui.");
                }
            } finally {
                setIsLoading(false);
            }
        };
        fetchUsers();
    }, []);

    const handleRoleChange = async (userId: string, newRole: string) => {
        const action = newRole === 'Relawan' ? 'menyetujui pengajuan ini' : `mengubah peran menjadi ${newRole}`;
        if (!confirm(`Anda yakin ingin ${action}?`)) return;

        try {
            const res = await fetch(`/api/users/${userId}/role`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ peran: newRole }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message);

            setUsers(currentUsers => 
                currentUsers.map(u => 
                    u._id === userId ? { ...u, peran: data.data.peran, statusRelawan: data.data.statusRelawan } : u
                )
            );
            alert("Peran pengguna berhasil diperbarui.");
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message); 
            } else {
                setError("Terjadi kesalahan yang tidak diketahui.");
            }
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

            {error && (
                <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md" role="alert">
                    <p className="font-bold">Terjadi Kesalahan</p>
                    <p>{error}</p>
                </div>
            )}

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
                                <th className="px-6 py-3 text-left text-xs font-bold text-slate-600 uppercase">Nama Pengguna</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-slate-600 uppercase">Peran</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-slate-600 uppercase">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-slate-200">
                            {isLoading ? (
                                <tr><td colSpan={3} className="p-6 text-center text-slate-500">Memuat data pengguna...</td></tr>
                            ) : filteredUsers.map(user => (
                                <tr key={user._id} className={`transition-colors ${user.statusRelawan === 'Diajukan' ? 'bg-indigo-50 hover:bg-indigo-100' : 'hover:bg-slate-50'}`}>
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-slate-900">{user.namaLengkap}</div>
                                        <div className="text-sm text-slate-500">{user.email}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                                user.peran === 'Admin' ? 'bg-purple-100 text-purple-800' :
                                                user.peran === 'Relawan' ? 'bg-green-100 text-green-800' :
                                                'bg-slate-100 text-slate-800'
                                            }`}>{user.peran}</span>
                                            {user.statusRelawan === 'Diajukan' && (
                                                <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 animate-pulse">
                                                    Menunggu Persetujuan
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm font-medium">
                                        {user.peran === 'Warga' && user.statusRelawan === 'Diajukan' && (
                                            <button onClick={() => handleRoleChange(user._id, 'Relawan')} 
                                                className="inline-flex items-center gap-1.5 text-green-600 hover:text-green-800 font-semibold">
                                                <CheckCircle className="w-4 h-4"/> Setujui
                                            </button>
                                        )}
                                        {user.peran === 'Warga' && user.statusRelawan !== 'Diajukan' && (
                                             <button onClick={() => handleRoleChange(user._id, 'Relawan')} className="text-indigo-600 hover:text-indigo-800 font-semibold">Jadikan Relawan</button>
                                        )}
                                        {user.peran === 'Relawan' && (
                                            <button onClick={() => handleRoleChange(user._id, 'Warga')} className="text-slate-500 hover:text-slate-700 font-semibold">Turunkan jadi Warga</button>
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
