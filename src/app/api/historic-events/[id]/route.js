import { NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth';
import dbConnect from '@/lib/dbConnect';
import HistoricEvent from '@/models/HistoricEvent';

export async function GET(request, { params }) {
  await dbConnect();
  try {
    const event = await HistoricEvent.findById(params.id);
    if (!event) {
      return NextResponse.json({ success: false, message: "Data tidak ditemukan." }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: event });
  } catch (error) {
   
    console.error("Gagal mengambil data histori by ID:", error);
    return NextResponse.json({ success: false, message: "Server Error" }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  const user = await verifyAuth();
  if (!user || user.peran !== 'Admin') {
    return NextResponse.json({ success: false, message: "Akses ditolak." }, { status: 403 });
  }
  await dbConnect();
  try {
    const body = await request.json();
    const updatedEvent = await HistoricEvent.findByIdAndUpdate(params.id, body, {
      new: true,
      runValidators: true,
    });
    if (!updatedEvent) {
      return NextResponse.json({ success: false, message: "Data tidak ditemukan." }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: updatedEvent });
  } catch (error) {
    console.error("Gagal memperbarui data histori:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 400 });
  }
}

export async function DELETE(request, { params }) {
    const user = await verifyAuth();
    if (!user || user.peran !== 'Admin') {
      return NextResponse.json({ success: false, message: "Akses ditolak." }, { status: 403 });
    }
  
    await dbConnect();
    try {
      const deletedEvent = await HistoricEvent.findByIdAndDelete(params.id);
      if (!deletedEvent) {
        return NextResponse.json({ success: false, message: "Data tidak ditemukan." }, { status: 404 });
      }
      return NextResponse.json({ success: true, data: {} });
    } catch (error) {
      console.error("Gagal menghapus data histori:", error);
      return NextResponse.json({ success: false, message: "Server Error" }, { status: 500 });
    }
}