import { NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import Resource from '@/models/Resource';

export async function POST() {
    const user = await verifyAuth();
    if (!user) {
        return NextResponse.json({ success: false, message: "Akses ditolak." }, { status: 401 });
    }

    try {
        await dbConnect();
        const resourceCount = await Resource.countDocuments({ pemilik: user.id });

        if (resourceCount < 3) {
            return NextResponse.json({ success: false, message: 'Anda harus memiliki minimal 3 sumber daya terdaftar untuk mengajukan diri.' }, { status: 403 });
        }

        await User.findByIdAndUpdate(user.id, { statusRelawan: 'Diajukan' });
        return NextResponse.json({ success: true, message: 'Pengajuan berhasil dikirim. Admin akan segera meninjau.' });
    } catch (error) {
        console.error("Gagal mengajukan diri sebagai relawan:", error);
        return NextResponse.json({ success: false, message: 'Terjadi kesalahan server.' }, { status: 500 });
    }
}