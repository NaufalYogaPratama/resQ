import dbConnect from "@/lib/dbConnect";
import Report from "@/models/Report";
import { verifyAuth } from "@/lib/auth";
import { NextResponse } from "next/server";
import cloudinary from 'cloudinary';

cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});


export async function DELETE(request, { params }) {
  const user = verifyAuth();
  if (!user) {
    return NextResponse.json({ success: false, message: "Akses ditolak." }, { status: 401 });
  }

  await dbConnect();
  const { id } = params;

  try {
    const report = await Report.findById(id);

    if (!report) {
      return NextResponse.json({ success: false, message: "Laporan tidak ditemukan." }, { status: 404 });
    }

    if (report.pelapor.toString() !== user.id && user.peran !== 'Admin') {
      return NextResponse.json({ success: false, message: "Anda tidak punya izin untuk menghapus laporan ini." }, { status: 403 });
    }

    if (report.gambarPublicId) {
      await cloudinary.v2.uploader.destroy(report.gambarPublicId);
    }

    await Report.findByIdAndDelete(id);

    return NextResponse.json({ success: true, message: "Laporan berhasil dihapus." });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Server Error" }, { status: 500 });
  }
}
