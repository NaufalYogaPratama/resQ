import { NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth';
import dbConnect from '@/lib/dbConnect';
import Resource from '@/models/Resource';
import User from '@/models/User';

// FUNGSI GET: Mengambil SEMUA sumber daya (hanya Admin)
export async function GET(request) {
    const user = await verifyAuth();
    if (!user || user.peran !== 'Admin') {
        return NextResponse.json({ success: false, message: 'Akses ditolak.' }, { status: 403 });
    }

    try {
        await dbConnect();
        const resources = await Resource.find({})
            .populate('pemilik', 'namaLengkap')
            .sort({ createdAt: -1 });
            
        return NextResponse.json({ success: true, data: resources });
    } catch (error) {
        return NextResponse.json({ success: false, message: 'Server Error' }, { status: 500 });
    }
}