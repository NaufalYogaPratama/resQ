import { NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth';
import dbConnect from '@/lib/dbConnect';
import Report from '@/models/Report';
import User from '@/models/User';

// FUNGSI GET: Mengambil SEMUA laporan (hanya Admin)
export async function GET(request) {
    const user = await verifyAuth();
    if (!user || user.peran !== 'Admin') {
        return NextResponse.json({ success: false, message: 'Akses ditolak.' }, { status: 403 });
    }

    try {
        await dbConnect();
        const reports = await Report.find({})
            .populate('pelapor', 'namaLengkap')
            .populate('penolong', 'namaLengkap')
            .sort({ createdAt: -1 });
            
        return NextResponse.json({ success: true, data: reports });
    } catch (error) {
        return NextResponse.json({ success: false, message: 'Server Error' }, { status: 500 });
    }
}