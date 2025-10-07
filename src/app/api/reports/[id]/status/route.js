import { NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth';
import dbConnect from '@/lib/dbConnect';
import Report from '@/models/Report';

export async function PUT(request, { params }) {
    const user = await verifyAuth();

    if (!user || user.peran !== 'Admin') {
        return NextResponse.json({ success: false, message: 'Akses ditolak. Hanya Admin yang diizinkan.' }, { status: 403 });
    }

    try {
        const { id } = params;
        const { status } = await request.json();


        if (!status || !['Menunggu', 'Ditangani', 'Selesai'].includes(status)) {
            return NextResponse.json({ success: false, message: 'Status yang dimasukkan tidak valid.' }, { status: 400 });
        }
        
        await dbConnect();

        const updatedReport = await Report.findByIdAndUpdate(
            id, 
            { status }, 
            { new: true, runValidators: true }
        );

        if (!updatedReport) {
            return NextResponse.json({ success: false, message: 'Laporan tidak ditemukan.' }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: updatedReport });

    } catch (error) {

        console.error("Gagal update status laporan:", error);
        return NextResponse.json({ success: false, message: 'Terjadi kesalahan pada server.' }, { status: 500 });
    }
}