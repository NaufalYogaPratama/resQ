import { NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';

// FUNGSI PUT: Mengubah peran seorang pengguna (hanya Admin)
export async function PUT(request, { params }) {
    const user = await verifyAuth();
    if (!user || user.peran !== 'Admin') {
        return NextResponse.json({ success: false, message: 'Akses ditolak.' }, { status: 403 });
    }

    try {
        const { id } = params;
        const { peran } = await request.json();

        // Validasi input peran
        if (!peran || !['Warga', 'Relawan', 'Admin'].includes(peran)) {
            return NextResponse.json({ success: false, message: 'Peran yang dimasukkan tidak valid.' }, { status: 400 });
        }
        
        await dbConnect();

        const updatedUser = await User.findByIdAndUpdate(id, { peran }, { new: true }).select('-kataSandi');

        if (!updatedUser) {
            return NextResponse.json({ success: false, message: 'Pengguna tidak ditemukan.' }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: updatedUser });

    } catch (error) {
        return NextResponse.json({ success: false, message: 'Server Error' }, { status: 500 });
    }
}