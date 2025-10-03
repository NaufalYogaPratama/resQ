import { NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import Resource from '@/models/Resource';

export async function POST(request) {
    const user = await verifyAuth();
    if (!user) { /* ... */ }

    try {
        await dbConnect();
        const resourceCount = await Resource.countDocuments({ pemilik: user.id });

        if (resourceCount < 3) {
            return NextResponse.json({ success: false, message: 'Anda harus memiliki minimal 3 sumber daya terdaftar.' }, { status: 403 });
        }

        await User.findByIdAndUpdate(user.id, { statusRelawan: 'Diajukan' });
        return NextResponse.json({ success: true, message: 'Pengajuan berhasil dikirim.' });
    } catch (error) {
        return NextResponse.json({ success: false, message: 'Terjadi kesalahan server.' }, { status: 500 });
    }
}