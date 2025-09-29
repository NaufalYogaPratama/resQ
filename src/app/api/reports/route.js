import dbConnect from "@/lib/dbConnect";
import Report from "@/models/Report";
import { verifyAuth } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET() {
  const user = verifyAuth();
  if (!user) {
    return NextResponse.json({ success: false, message: "Akses ditolak. Silakan login." }, { status: 401 });
  }

  await dbConnect();
  try {
    const activeReports = await Report.find({ status: { $in: ['Menunggu', 'Ditangani'] } })
      .populate('pelapor', 'namaLengkap')
      .sort({ createdAt: -1 });

    return NextResponse.json({ success: true, data: activeReports });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Server Error" }, { status: 500 });
  }
}


export async function POST(request) {
  const user = verifyAuth();
  if (!user) {
    return NextResponse.json({ success: false, message: "Akses ditolak. Silakan login." }, { status: 401 });
  }

  await dbConnect();
  try {
    const body = await request.json();

    if (!body.kategori || !body.deskripsi || !body.lokasi) {
       return NextResponse.json({ success: false, message: "Data tidak lengkap." }, { status: 400 });
    }

    const newReport = await Report.create({
      ...body,
      pelapor: user.id,
    });

    return NextResponse.json({ success: true, data: newReport }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 400 });
  }
}