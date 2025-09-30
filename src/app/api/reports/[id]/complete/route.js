// src/app/api/reports/[id]/complete/route.js

import dbConnect from "@/lib/dbConnect";
import Report from "@/models/Report";
import User from "@/models/User"; // Impor model User untuk update poin
import { verifyAuth } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function PUT(request, { params }) {
  // 1. Verifikasi sesi pengguna
  const user = verifyAuth();
  if (!user) {
    return NextResponse.json({ success: false, message: "Akses ditolak. Anda harus login." }, { status: 401 });
  }

  const { id } = params;
  await dbConnect();

  try {
    const report = await Report.findById(id);

    // Validasi 1: Pastikan laporan ada
    if (!report) {
      return NextResponse.json({ success: false, message: "Laporan tidak ditemukan." }, { status: 404 });
    }

    // Validasi 2: Pastikan yang menyelesaikan adalah pelapor asli
    if (report.pelapor.toString() !== user.id) {
        return NextResponse.json({ success: false, message: "Hanya pelapor yang bisa menyelesaikan laporannya." }, { status: 403 });
    }

    // Validasi 3: Pastikan laporan sudah ditangani
    if (report.status !== 'Ditangani') {
      return NextResponse.json({ success: false, message: "Laporan ini belum atau sudah selesai ditangani." }, { status: 400 });
    }

    // 2. Update status laporan
    report.status = 'Selesai';
    await report.save();

    // 3. Tambahkan poin untuk relawan (Fitur Gamifikasi)
    if (report.penolong) {
      // Tambahkan 10 poin untuk setiap laporan yang diselesaikan
      await User.findByIdAndUpdate(report.penolong, { $inc: { poin: 10 } });
    }

    return NextResponse.json({ success: true, data: report });

  } catch (error) {
    return NextResponse.json({ success: false, message: "Terjadi kesalahan pada server.", error: error.message }, { status: 500 });
  }
}