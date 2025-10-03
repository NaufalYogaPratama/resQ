import dbConnect from "@/lib/dbConnect";
import Resource from "@/models/Resource";
import SystemSetting from "@/models/SystemSetting";
import User from "@/models/User";
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
        return NextResponse.json({ success: false, message: "Nama dan tipe wajib diisi." }, { status: 400 });
    }
    
    const newResourceData = {
      namaSumberDaya,
      tipe,
      deskripsi,
      pemilik: user.id,
    };

    if (gambar && gambar.size > 0) {
        const uploadResult = await uploadImage(gambar);
        newResourceData.gambarUrl = uploadResult.secure_url;
        newResourceData.gambarPublicId = uploadResult.public_id;
    }
    
    const newResource = await Resource.create(newResourceData);

    let rewardAwarded = false;
    let rewardName = '';
    const resourceCount = await Resource.countDocuments({ pemilik: user.id });

    if (resourceCount >= 3) {
      const currentUser = await User.findById(user.id);
      const alreadyHasBadge = currentUser.lencana && currentUser.lencana.includes("Kontributor Aktif");

      if (!alreadyHasBadge) {
        await User.findByIdAndUpdate(user.id, {
          $inc: { poin: 50 }, 
          $addToSet: { lencana: "Kontributor Aktif" } 
        });
        rewardAwarded = true;
        rewardName = "Lencana Kontributor Aktif (+50 Poin)";
      }
    }
    
    return NextResponse.json({ 
        success: true, 
        data: newResource,
        rewardAwarded,
        rewardName
    }, { status: 201 });

  } catch (error) {
    console.error("POST Resource Error:", error);
    return NextResponse.json({ success: false, message: error.message || "Terjadi kesalahan." }, { status: 500 });
  }
}