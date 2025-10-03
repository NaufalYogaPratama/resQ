import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import { verifyAuth } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function PUT(request) {
  const user = verifyAuth();
  if (!user) {
    return NextResponse.json({ success: false, message: "Akses ditolak." }, { status: 401 });
  }

  await dbConnect();
  try {
    const { namaLengkap, noWa } = await request.json();

    if (!namaLengkap || !noWa) {
      return NextResponse.json({ success: false, message: "Nama lengkap dan nomor WhatsApp wajib diisi." }, { status: 400 });
    }

    const updatedUser = await User.findByIdAndUpdate(
      user.id,
      { namaLengkap, noWa },
      { new: true, runValidators: true, select: '-kataSandi' }
    );

    if (!updatedUser) {
      return NextResponse.json({ success: false, message: "Pengguna tidak ditemukan." }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updatedUser });

  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}