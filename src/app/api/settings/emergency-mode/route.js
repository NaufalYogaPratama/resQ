import { NextResponse } from 'next/server';
import dbConnect from "@/lib/dbConnect";
import SystemSetting from "@/models/SystemSetting";
import { verifyAuth } from "@/lib/auth";

export const dynamic = 'force-dynamic';

export async function GET() {
  await dbConnect();
  try {
    const setting = await SystemSetting.findOne({});
    return NextResponse.json({ success: true, isEmergency: setting ? setting.modeDarurat : false });
  } catch (error) {
    console.error("Gagal mengambil status mode darurat:", error);
    return NextResponse.json({ success: false, message: "Server Error" }, { status: 500 });
  }
}

export async function POST() {
  const user = await verifyAuth();
  if (!user || user.peran !== 'Admin') {
    return NextResponse.json({ success: false, message: "Akses ditolak." }, { status: 403 });
  }
  await dbConnect();
  try {
    let setting = await SystemSetting.findOne({});
    if (!setting) {
        setting = await SystemSetting.create({ name: 'global', modeDarurat: true });
    } else {
        setting.modeDarurat = !setting.modeDarurat; 
        await setting.save();
    }
    return NextResponse.json({ success: true, isEmergency: setting.modeDarurat });
  } catch (error) {
    console.error("Gagal mengubah mode darurat:", error);
    return NextResponse.json({ success: false, message: error.message || "Gagal mengubah mode darurat." }, { status: 500 });
  }
}