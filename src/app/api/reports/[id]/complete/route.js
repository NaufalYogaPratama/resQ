import dbConnect from "@/lib/dbConnect";
import Report from "@/models/Report";
import User from "@/models/User";
import { verifyAuth } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function PUT(request, { params }) {
  // --- PERBAIKAN DI SINI ---
  const user = await verifyAuth();
  if (!user) {
    return NextResponse.json({ success: false, message: "Akses ditolak. Anda harus login." }, { status: 401 });
  }

  const { id } = params;
  await dbConnect();

  try {
    const report = await Report.findById(id);

    if (!report) {
      return NextResponse.json({ success: false, message: "Laporan tidak ditemukan." }, { status: 404 });
    }

    // Validasi ini sekarang akan berjalan dengan benar
    if (report.pelapor.toString() !== user.id) {
        return NextResponse.json({ success: false, message: "Hanya pelapor yang bisa menyelesaikan laporannya." }, { status: 403 });
    }

    if (report.status !== 'Ditangani') {
      return NextResponse.json({ success: false, message: "Laporan ini belum atau sudah selesai ditangani." }, { status: 400 });
    }

    report.status = 'Selesai';
    await report.save();

    if (report.penolong) {
      // Tambahkan 10 poin untuk setiap laporan yang diselesaikan
      await User.findByIdAndUpdate(report.penolong, { $inc: { poin: 10 } });
    }

    return NextResponse.json({ success: true, data: report });

  } catch (error) {
    return NextResponse.json({ success: false, message: "Terjadi kesalahan pada server.", error: error.message }, { status: 500 });
  }
}