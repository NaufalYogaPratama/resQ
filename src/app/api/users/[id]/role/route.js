import { NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';

export async function PUT(request, { params }) {
    const user = await verifyAuth();
    if (!user || user.peran !== 'Admin') {
        return NextResponse.json({ success: false, message: 'Akses ditolak.' }, { status: 403 });
    }

    try {
        const { id } = params;
        const { peran } = await request.json();

        if (!peran || !['Warga', 'Relawan', 'Admin'].includes(peran)) {
            return NextResponse.json({ success: false, message: 'Peran tidak valid.' }, { status: 400 });
        }
        
        await dbConnect();

        const updateData = { peran };

        if (peran === 'Relawan') {
            updateData.statusRelawan = 'Diterima';
        }

  
        if (peran === 'Warga') {
            updateData.statusRelawan = 'None';
        }

        const updatedUser = await User.findByIdAndUpdate(id, { $set: updateData }, { new: true }).select('-kataSandi');

        if (!updatedUser) {
            return NextResponse.json({ success: false, message: 'Pengguna tidak ditemukan.' }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: updatedUser });

    } catch (error) {
        console.error("Gagal mengubah peran pengguna:", error);
        return NextResponse.json({ success: false, message: 'Server Error' }, { status: 500 });
    }
}