import dbConnect from "@/lib/dbConnect";
import Resource from "@/models/Resource";
import { verifyAuth } from "@/lib/auth";
import { NextResponse } from "next/server";
import cloudinary from 'cloudinary';

// (Salin konfigurasi Cloudinary dan helper uploadImage dari file sebelumnya jika perlu)
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
    return await cloudinary.v2.uploader.upload(fileUri, { folder: 'resq_resources' });
}

// FUNGSI GET: Mengambil satu sumber daya
export async function GET(request, { params }) {
  const user = verifyAuth();
  if (!user) {
    return NextResponse.json({ success: false, message: "Akses ditolak." }, { status: 401 });
  }
  await dbConnect();
  try {
    const resource = await Resource.findById(params.id);
    if (!resource || resource.pemilik.toString() !== user.id) {
      return NextResponse.json({ success: false, message: "Sumber daya tidak ditemukan." }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: resource });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Server Error" }, { status: 500 });
  }
}

// FUNGSI PUT: Mengupdate satu sumber daya
export async function PUT(request, { params }) {
    const user = verifyAuth();
    if (!user) {
        return NextResponse.json({ success: false, message: "Akses ditolak." }, { status: 401 });
    }

    await dbConnect();
    try {
        const resource = await Resource.findById(params.id);
        if (!resource || resource.pemilik.toString() !== user.id) {
            return NextResponse.json({ success: false, message: "Anda tidak diizinkan mengedit ini." }, { status: 403 });
        }

        const formData = await request.formData();
        const updateData = {};
        
        if (formData.get('namaSumberDaya')) updateData.namaSumberDaya = formData.get('namaSumberDaya');
        if (formData.get('tipe')) updateData.tipe = formData.get('tipe');
        if (formData.get('deskripsi')) updateData.deskripsi = formData.get('deskripsi');

        if (formData.get('gambar')) {
            if (resource.gambarPublicId) {
                await cloudinary.v2.uploader.destroy(resource.gambarPublicId);
            }
            const gambar = formData.get('gambar');
            const uploadResult = await uploadImage(gambar);
            updateData.gambarUrl = uploadResult.secure_url;
            updateData.gambarPublicId = uploadResult.public_id;
        }

        const updatedResource = await Resource.findByIdAndUpdate(params.id, updateData, { new: true });
        return NextResponse.json({ success: true, data: updatedResource });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 400 });
    }
}

// FUNGSI DELETE: Menghapus satu sumber daya
export async function DELETE(request, { params }) {
  const user = verifyAuth();
  if (!user) return NextResponse.json({ success: false, message: "Akses ditolak." }, { status: 401 });
  
  await dbConnect();
  try {
    const resource = await Resource.findById(params.id);
    if (!resource || resource.pemilik.toString() !== user.id) {
        return NextResponse.json({ success: false, message: "Tidak diizinkan." }, { status: 403 });
    }
    if (resource.gambarPublicId) {
        await cloudinary.v2.uploader.destroy(resource.gambarPublicId);
    }
    await Resource.findByIdAndDelete(params.id);
    return NextResponse.json({ success: true, data: {} });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Server Error" }, { status: 500 });
  }
}