import dbConnect from "@/lib/dbConnect";
import SystemSetting from "@/models/SystemSetting";
import { verifyAuth } from "@/lib/auth";
import { NextResponse } from "next/server";


export const dynamic = 'force-dynamic';


export async function GET() {
  await dbConnect();
  try {
    const setting = await SystemSetting.findOne({});
    return NextResponse.json({ success: true, isEmergency: setting ? setting.modeDarurat : false });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Server Error" }, { status: 500 });
  }
}

export async function POST(request) {
  const user = await verifyAuth();
  if (!user || user.peran !== 'Admin') {
    return NextResponse.json({ success: false, message: "Akses ditolak." }, { status: 403 });
  }
  await dbConnect();
  try {
    let setting = await SystemSetting.findOne({});
    if (!setting) {
        setting = await SystemSetting.create({ modeDarurat: true });
    } else {
        setting.modeDarurat = !setting.modeDarurat; 
        await setting.save();
    }
    return NextResponse.json({ success: true, isEmergency: setting.modeDarurat });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}