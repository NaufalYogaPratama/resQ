import { NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth';
import dbConnect from '@/lib/dbConnect';
import Checklist from '@/models/Checklist';

const checklistItems = [
    { id: 'doc-ktp-kk', category: 'Dokumen Penting', text: 'Fotokopi/Scan KTP, KK, Akta Lahir, Ijazah' },
    { id: 'doc-surat', category: 'Dokumen Penting', text: 'Fotokopi/Scan Surat Penting (Sertifikat, BPKB)' },
    { id: 'food-air', category: 'Makanan & Minuman', text: 'Air Minum (min. 3 liter/orang)' },
    { id: 'food-tahan-lama', category: 'Makanan & Minuman', text: 'Makanan Tahan Lama (Biskuit, mi instan, kalengan)' },
    { id: 'p3k-standar', category: 'P3K & Obat-obatan', text: 'Kotak P3K (plester, perban, antiseptik)' },
    { id: 'p3k-pribadi', category: 'P3K & Obat-obatan', text: 'Obat-obatan pribadi' },
    { id: 'pakaian-ganti', category: 'Pakaian & Perlengkapan Tidur', text: 'Pakaian ganti untuk 3 hari' },
    { id: 'pakaian-jaket', category: 'Pakaian & Perlengkapan Tidur', text: 'Jaket atau selimut' },
    { id: 'pakaian-hujan', category: 'Pakaian & Perlengkapan Tidur', text: 'Jas Hujan / Ponco' },
    { id: 'alat-senter', category: 'Penerangan & Komunikasi', text: 'Senter dan baterai cadangan' },
    { id: 'alat-powerbank', category: 'Penerangan & Komunikasi', text: 'Power bank' },
    { id: 'alat-radio', category: 'Penerangan & Komunikasi', text: 'Radio portabel (bertenaga baterai)' },
    { id: 'lain-peluit', category: 'Peralatan Lainnya', text: 'Peluit' },
    { id: 'lain-masker', category: 'Peralatan Lainnya', text: 'Masker N95/kain' },
    { id: 'lain-uang', category: 'Peralatan Lainnya', text: 'Uang tunai secukupnya' },
    { id: 'pribadi-mandi', category: 'Kebutuhan Pribadi', text: 'Perlengkapan mandi' },
];

export async function GET() {
    const user = await verifyAuth();
    if (!user) {
        return NextResponse.json({ success: false, message: 'Akses ditolak.' }, { status: 401 });
    }

    await dbConnect();
    const userChecklist = await Checklist.findOne({ user: user.id });

    return NextResponse.json({
        success: true,
        data: {
            items: checklistItems,
            checkedItems: userChecklist ? userChecklist.checkedItems : [],
        },
    });
}

export async function POST(request) {
    const user = await verifyAuth();
    if (!user) {
        return NextResponse.json({ success: false, message: 'Akses ditolak.' }, { status: 401 });
    }

    try {
        const { checkedItems } = await request.json();
        await dbConnect();

        await Checklist.findOneAndUpdate(
            { user: user.id },
            { user: user.id, checkedItems },
            { upsert: true, new: true }
        );

        return NextResponse.json({ success: true, message: 'Progres disimpan.' });
    } catch (error) {
        return NextResponse.json({ success: false, message: 'Gagal menyimpan progres.' }, { status: 500 });
    }
}