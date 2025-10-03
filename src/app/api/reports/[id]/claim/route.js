import dbConnect from "@/lib/dbConnect";
import Report from "@/models/Report";
import ChatRoom from "@/models/ChatRoom";
import { verifyAuth } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function PUT(request, { params }) {
  // --- PERBAIKAN DI SINI ---
  const user = await verifyAuth();
  if (!user) {
    return NextResponse.json({ success: false, message: "Akses ditolak. Anda harus login." }, { status: 401 });
  }
  if (user.peran !== 'Relawan') {
    return NextResponse.json({ success: false, message: "Hanya relawan yang dapat mengklaim laporan." }, { status: 403 });
  }

  const { id } = params;

  await dbConnect();
  try {
    const report = await Report.findById(id);

    if (!report) {
      return NextResponse.json({ success: false, message: "Laporan tidak ditemukan." }, { status: 404 });
    }

    if (report.status !== 'Menunggu') {
      return NextResponse.json({ success: false, message: "Laporan ini sudah ditangani atau selesai." }, { status: 400 });
    }

    report.status = 'Ditangani';
    report.penolong = user.id;
    await report.save();

    // Otomatis buat chat room jika belum ada
    const existingChatRoom = await ChatRoom.findOne({ reportId: report._id });
    if (!existingChatRoom) {
      await ChatRoom.create({
        reportId: report._id,
        participants: [report.pelapor, user.id], // pelapor dan penolong
      });
    }

    return NextResponse.json({ success: true, data: report });

  } catch (error) {
    return NextResponse.json({ success: false, message: "Terjadi kesalahan pada server.", error: error.message }, { status: 500 });
  }
}