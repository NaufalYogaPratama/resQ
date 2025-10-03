import { NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';

// FUNGSI GET: Mengambil daftar semua pengguna (hanya Admin)
export async function GET(request) {
    const user = await verifyAuth();
    if (!user || user.peran !== 'Admin') {
        return NextResponse.json({ success: false, message: 'Akses ditolak. Hanya Admin yang diizinkan.' }, { status: 403 });
    }

    try {
        await dbConnect();
        // Ambil semua user, jangan tampilkan password, urutkan berdasarkan nama
        const users = await User.find({}).select('-kataSandi').sort({ namaLengkap: 1 });
        return NextResponse.json({ success: true, data: users });
    } catch (error) {
        return NextResponse.json({ success: false, message: 'Server Error' }, { status: 500 });
    }
}