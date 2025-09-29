import dbConnect from "@/lib/dbConnect";
import Resource from "@/models/Resource";
import { verifyAuth } from "@/lib/auth";
import { NextResponse } from "next/server";

// MENGHAPUS SUMBER DAYA
export async function DELETE(request, { params }) {
  const user = verifyAuth();
  if (!user) {
    return NextResponse.json({ success: false, message: "Akses ditolak." }, { status: 401 });
  }

  await dbConnect();
  try {
    const resource = await Resource.findById(params.id);
    if (!resource) {
      return NextResponse.json({ success: false, message: "Sumber daya tidak ditemukan." }, { status: 404 });
    }

    // Keamanan: Pastikan user hanya bisa menghapus miliknya sendiri
    if (resource.pemilik.toString() !== user.id) {
        return NextResponse.json({ success: false, message: "Anda tidak punya izin untuk menghapus ini." }, { status: 403 });
    }

    await Resource.findByIdAndDelete(params.id);
    return NextResponse.json({ success: true, data: {} });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Server Error" }, { status: 500 });
  }
}