import { NextResponse } from 'next/server';
import dbConnect from "@/lib/dbConnect";
import Resource from "@/models/Resource";
import { verifyAuth } from "@/lib/auth";
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
    return await cloudinary.v2.uploader.upload(fileUri, { folder: 'resq_resources' });
}


export async function GET(request, { params }) {
  const user = await verifyAuth();
  if (!user) {
    return NextResponse.json({ success: false, message: "Akses ditolak." }, { status: 401 });
  }
  await dbConnect();
  try {
    const resource = await Resource.findById(params.id);

    if (!resource || (resource.pemilik.toString() !== user.id && user.peran !== 'Admin')) {
      return NextResponse.json({ success: false, message: "Sumber daya tidak ditemukan atau akses ditolak." }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: resource });
  } catch (error) {

    console.error("Gagal mengambil sumber daya by ID:", error);
    return NextResponse.json({ success: false, message: "Server Error" }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
    const user = await verifyAuth();
    if (!user) {
        return NextResponse.json({ success: false, message: "Akses ditolak." }, { status: 401 });
    }

    await dbConnect();
    try {
        const resource = await Resource.findById(params.id);
        if (!resource || (resource.pemilik.toString() !== user.id && user.peran !== 'Admin')) {
            return NextResponse.json({ success: false, message: "Anda tidak diizinkan mengedit ini." }, { status: 403 });
        }

        const formData = await request.formData();
        const updateData = {};
        
        if (formData.get('namaSumberDaya')) updateData.namaSumberDaya = formData.get('namaSumberDaya');
        if (formData.get('tipe')) updateData.tipe = formData.get('tipe');
        if (formData.get('deskripsi') !== null) updateData.deskripsi = formData.get('deskripsi');

        const gambar = formData.get('gambar');
        if (gambar) {
            if (resource.gambarPublicId) {
                await cloudinary.v2.uploader.destroy(resource.gambarPublicId);
            }
            const uploadResult = await uploadImage(gambar);
            updateData.gambarUrl = uploadResult.secure_url;
            updateData.gambarPublicId = uploadResult.public_id;
        }

        const updatedResource = await Resource.findByIdAndUpdate(params.id, updateData, { new: true });
        return NextResponse.json({ success: true, data: updatedResource });

    } catch (error) {
        console.error("Gagal update sumber daya:", error);
        return NextResponse.json({ success: false, message: error.message || "Terjadi kesalahan server." }, { status: 500 });
    }
}

export async function DELETE(request, { params }) {
  const user = await verifyAuth();
  if (!user) return NextResponse.json({ success: false, message: "Akses ditolak." }, { status: 401 });
  
  await dbConnect();
  try {
    const resource = await Resource.findById(params.id);
    if (!resource || (resource.pemilik.toString() !== user.id && user.peran !== 'Admin')) {
        return NextResponse.json({ success: false, message: "Tidak diizinkan." }, { status: 403 });
    }
    if (resource.gambarPublicId) {
        await cloudinary.v2.uploader.destroy(resource.gambarPublicId);
    }
    await Resource.findByIdAndDelete(params.id);
    return NextResponse.json({ success: true, data: {} });
  } catch (error) {
    console.error("Gagal menghapus sumber daya:", error);
    return NextResponse.json({ success: false, message: "Server Error" }, { status: 500 });
  }
}