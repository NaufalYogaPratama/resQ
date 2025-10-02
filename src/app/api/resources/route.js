import dbConnect from "@/lib/dbConnect";
import Resource from "@/models/Resource";
import SystemSetting from "@/models/SystemSetting";
import { verifyAuth } from "@/lib/auth";
import { NextResponse } from "next/server";
// import cloudinary from 'cloudinary'; // Dinonaktifkan sementara

// --- SEMUA KODE CLOUDINARY DINONAKTIFKAN SEMENTARA ---
/*
// Konfigurasi Cloudinary
cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Helper untuk upload gambar
async function uploadImage(file) {
    const fileBuffer = await file.arrayBuffer();
    const mime = file.type;
    const encoding = 'base64';
    const base64Data = Buffer.from(fileBuffer).toString('base64');
    const fileUri = 'data:' + mime + ';' + encoding + ',' + base64Data;
    const result = await cloudinary.v2.uploader.upload(fileUri, { folder: 'resq_resources' });
    return result;
}
*/

// FUNGSI GET: MENGAMBIL DAFTAR SUMBER DAYA (Fungsi ini tidak berubah dan akan berjalan)
export async function GET() {
  const user = verifyAuth();
  if (!user) {
    return NextResponse.json({ success: false, message: "Akses ditolak." }, { status: 401 });
  }

  await dbConnect();
  try {
    const settings = await SystemSetting.findOne({ name: 'global' });
    const isEmergency = settings ? settings.modeDarurat : false;

    if (isEmergency && ['Admin', 'Relawan'].includes(user.peran)) {
      const allResources = await Resource.find({}).populate('pemilik', 'namaLengkap noWa');
      return NextResponse.json({ success: true, data: allResources, isEmergency: isEmergency });
    }
    
    const userResources = await Resource.find({ pemilik: user.id });
    return NextResponse.json({ success: true, data: userResources, isEmergency: isEmergency });

  } catch (error) {
    return NextResponse.json({ success: false, message: "Server Error" }, { status: 500 });
  }
}


// FUNGSI POST: MEMBUAT SUMBER DAYA BARU (Diset ulang untuk menangani teks saja)
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
      gambarUrl: null,
      gambarPublicId: null,
    });
    return NextResponse.json({ success: true, data: newResource }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 400 });
  }
}