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

async function uploadImage(file) {
    const fileBuffer = await file.arrayBuffer();
    const mime = file.type;
    const base64Data = Buffer.from(fileBuffer).toString('base64');
    const fileUri = `data:${mime};base64,${base64Data}`;
    
    const result = await cloudinary.v2.uploader.upload(fileUri, {
        folder: 'resq_reports'
    });
    return result;
}

export async function GET() {
  const user = verifyAuth();
  if (!user) {
    return NextResponse.json({ success: false, message: "Akses ditolak. Silakan login." }, { status: 401 });
  }

  await dbConnect();
  try {
    const activeReports = await Report.find({ status: { $in: ['Menunggu', 'Ditangani'] } })
      .populate('pelapor', 'namaLengkap _id')
      .sort({ createdAt: -1 });

    return NextResponse.json({ success: true, data: activeReports });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Server Error" }, { status: 500 });
  }
}


export async function POST(request) {
  const user = verifyAuth();
  if (!user) {
    return NextResponse.json({ success: false, message: "Akses ditolak." }, { status: 401 });
  }

  await dbConnect();

  try {
    const formData = await request.formData();
    const kategori = formData.get('kategori');
    const deskripsi = formData.get('deskripsi');
    const lokasi = JSON.parse(formData.get('lokasi'));
    const gambar = formData.get('gambar');

    if (!kategori || !deskripsi || !lokasi) {
       return NextResponse.json({ success: false, message: "Data tidak lengkap." }, { status: 400 });
    }

    let reportData = {
        pelapor: user.id,
        kategori,
        deskripsi,
        lokasi,
    };

    if (gambar && gambar.size > 0) {
        const uploadResult = await uploadImage(gambar);
        reportData.gambarUrl = uploadResult.secure_url;
        reportData.gambarPublicId = uploadResult.public_id;
    }

    const newReport = await Report.create(reportData);

    return NextResponse.json({ success: true, data: newReport }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 400 });
  }
}