import dbConnect from "@/lib/dbConnect";
import SystemSetting from "@/models/SystemSetting";
import { verifyAuth } from "@/lib/auth";
import { NextResponse } from "next/server";

const getSettings = async () => {
  return await SystemSetting.findOneAndUpdate(
    { name: 'global' },
    { $setOnInsert: { name: 'global', modeDarurat: false } },
  );
};

export async function GET() {
  await dbConnect();
  try {
    const setting = await getSettings();
    return NextResponse.json({ success: true, isEmergency: setting.modeDarurat });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Server Error" }, { status: 500 });
  }
}

export async function POST(request) {
  const user = verifyAuth();
  if (!user || user.peran !== 'Admin') {
    return NextResponse.json({ success: false, message: "Akses ditolak." }, { status: 403 });
  }

  await dbConnect();
  try {
    const currentSettings = await getSettings();
    
    currentSettings.modeDarurat = !currentSettings.modeDarurat;
    await currentSettings.save();

    return NextResponse.json({ success: true, isEmergency: currentSettings.modeDarurat });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 400 });
  }
}