import { NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';


export async function PUT(request) {
    const user = await verifyAuth();
    if (!user) {
        return NextResponse.json({ success: false, message: 'Akses ditolak.' }, { status: 401 });
    }

    try {
        const body = await request.json();
        const { namaLengkap, noWa } = body;

        if (!namaLengkap || !noWa) {
            return NextResponse.json({ success: false, message: 'Nama dan Nomor WhatsApp wajib diisi.' }, { status: 400 });
        }
        
        await dbConnect();

        const updatedUser = await User.findByIdAndUpdate(
            user.id,
            { namaLengkap, noWa },
            { new: true, runValidators: true }
        ).select('-kataSandi'); 

        if (!updatedUser) {
            return NextResponse.json({ success: false, message: 'Pengguna tidak ditemukan.' }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: updatedUser });

    } catch (error) {
    
        console.error("Gagal update profil pengguna:", error);
        return NextResponse.json({ success: false, message: 'Terjadi kesalahan pada server.' }, { status: 500 });
    }
}