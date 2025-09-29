import dbConnect from "@/lib/dbConnect";
import Resource from "@/models/Resource";
import SystemSetting from "@/models/SystemSetting";
import { verifyAuth } from "@/lib/auth";
import { NextResponse } from "next/server";

// MENGAMBIL DAFTAR SUMBER DAYA (DENGAN LOGIKA KEAMANAN)
export async function GET() {
  const user = verifyAuth();
  if (!user) {
    return NextResponse.json({ success: false, message: "Akses ditolak." }, { status: 401 });
  }

  await dbConnect();
  try {
    const settings = await SystemSetting.findOne({});
    const isEmergency = settings ? settings.modeDarurat : false;

    // JIKA MODE DARURAT & USER ADALAH ADMIN/RELAWAN, TAMPILKAN SEMUA
    if (isEmergency && ['Admin', 'Relawan'].includes(user.peran)) {
      const allResources = await Resource.find({}).populate('pemilik', 'namaLengkap noWa');
      return NextResponse.json({ success: true, data: allResources });
    }
    
    // JIKA TIDAK, SEMUA USER HANYA BISA MELIHAT MILIKNYA SENDIRI
    const userResources = await Resource.find({ pemilik: user.id });
    return NextResponse.json({ success: true, data: userResources });

  } catch (error) {
    return NextResponse.json({ success: false, message: "Server Error" }, { status: 500 });
  }
}

// MEMBUAT SUMBER DAYA BARU
export async function POST(request) {
  const user = verifyAuth();
  if (!user) {
    return NextResponse.json({ success: false, message: "Akses ditolak." }, { status: 401 });
  }

  await dbConnect();
  try {
    const body = await request.json();
    const newResource = await Resource.create({
      ...body,
      pemilik: user.id,
    });
    return NextResponse.json({ success: true, data: newResource }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 400 });
  }
}