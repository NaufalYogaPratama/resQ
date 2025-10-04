import dbConnect from "@/lib/dbConnect";
import HistoricEvent from "@/models/HistoricEvent";
import { NextResponse } from "next/server";

export async function GET() {
  await dbConnect();
  try {
    const events = await HistoricEvent.find({}).sort({ date: -1 });
    return NextResponse.json({ success: true, data: events });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Server Error" }, { status: 500 });
  }
}