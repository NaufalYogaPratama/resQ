import dbConnect from "@/lib/dbConnect";
import Resource from "@/models/Resource";
import SystemSetting from "@/models/SystemSetting";
import { verifyAuth } from "@/lib/auth";
import { NextResponse } from "next/server";
import cloudinary from 'cloudinary';

// 1. --- KONFIGURASI CLOUDINARY DIAKTIFKAN KEMBALI ---
// Pastikan variabel environment di file .env.local Anda sudah benar.
cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// 2. --- FUNGSI HELPER UNTUK UPLOAD GAMBAR ---
async function uploadImage(file) {
    const fileBuffer = await file.arrayBuffer();
    const mime = file.type;
    const encoding = 'base64';
    const base64Data = Buffer.from(fileBuffer).toString('base64');
    const fileUri = 'data:' + mime + ';' + encoding + ',' + base64Data;

    try {
        const result = await cloudinary.v2.uploader.upload(fileUri, { 
            folder: 'resq_resources' 
        });
        return result;
    } catch (error) {
        console.error("Cloudinary Upload Error:", error);
        throw new Error("Gagal mengunggah gambar ke Cloudinary.");
    }
}

// FUNGSI GET: TIDAK BERUBAH
export async function GET() {
  const user = await verifyAuth();
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


// 3. --- FUNGSI POST DIPERBARUI UNTUK MENGELOLA GAMBAR ---
export async function POST(request) {
  const user = await verifyAuth();
  if (!user) {
    return NextResponse.json({ success: false, message: "Akses ditolak." }, { status: 401 });
  }

  await dbConnect();
  try {
    const formData = await request.formData();

    const namaSumberDaya = formData.get('namaSumberDaya');
    const tipe = formData.get('tipe');
    const deskripsi = formData.get('deskripsi');
    const gambar = formData.get('gambar'); 

    if (!namaSumberDaya || !tipe) {
        return NextResponse.json({ success: false, message: "Nama dan tipe sumber daya wajib diisi." }, { status: 400 });
    }
    
    const newResourceData = {
      namaSumberDaya,
      tipe,
      deskripsi,
      pemilik: user.id,
    };

    // Logika untuk upload gambar jika ada
    if (gambar && gambar.size > 0) {
        const uploadResult = await uploadImage(gambar);
        newResourceData.gambarUrl = uploadResult.secure_url;
        newResourceData.gambarPublicId = uploadResult.public_id;
    }
    
    const newResource = await Resource.create(newResourceData);

    return NextResponse.json({ success: true, data: newResource }, { status: 201 });
  } catch (error) {
    console.error("POST Resource Error:", error);
    return NextResponse.json({ success: false, message: error.message || "Terjadi kesalahan pada server." }, { status: 500 });
  }
}