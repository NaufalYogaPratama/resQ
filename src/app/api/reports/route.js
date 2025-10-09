import { NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth';
import dbConnect from '@/lib/dbConnect';
import Report from '@/models/Report';
import cloudinary from 'cloudinary';

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function uploadImage(file) {
  const fileBuffer = await file.arrayBuffer();
  const mime = file.type;
  const base64Data = Buffer.from(fileBuffer).toString("base64");
  const fileUri = `data:${mime};base64,${base64Data}`;

  try {
    const result = await cloudinary.v2.uploader.upload(fileUri, {
      folder: "resq_reports",
    });
    return result;
  } catch (error) {
    console.error("Cloudinary Upload Error:", error);
    throw new Error("Gagal mengunggah gambar ke server.");
  }
}


export async function GET() {
  try {
    const user = await verifyAuth();
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Akses ditolak. Silakan login." },
        { status: 401 }
      );
    }

    await dbConnect();

    const activeReports = await Report.find({
      status: { $in: ["Menunggu", "Ditangani"] },
    })
      .populate("pelapor", "namaLengkap _id")
      // --- PERBAIKAN DI SINI ---
      .populate("penolong", "namaLengkap") // Tambahkan baris ini untuk mengambil data penolong
      .sort({ createdAt: -1 });

    return NextResponse.json({ success: true, data: activeReports });
  } catch (error) {
    console.error("GET Reports Error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Terjadi kesalahan pada server.",
        error: error.message,
      },
      { status: 500 }
    );
  }
}


export async function POST(request) {
  try {
    await dbConnect();

    const formData = await request.formData();
    const kategori = formData.get("kategori");
    const deskripsi = formData.get("deskripsi");
    const lokasiRaw = formData.get("lokasi");
    const gambar = formData.get("gambar");
    const namaPelapor = formData.get("namaPelapor"); // Field baru untuk nama
    const noWaPelapor = formData.get("noWaPelapor"); // Field baru untuk No WA
    const user = await verifyAuth(); // Coba verifikasi, tapi jangan blokir

    if (!kategori || !deskripsi || !lokasiRaw) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Data tidak lengkap. Pastikan kategori, deskripsi, dan lokasi terisi.",
        },
        { status: 400 }
      );
    }

    let lokasi;
    try {
      const parsed = JSON.parse(lokasiRaw);
      lokasi = {
        type: "Point",
        coordinates: parsed.coordinates,
        alamat: parsed.alamat || "",
      };
    } catch (e) {

      console.error("Gagal parsing data lokasi:", e);
      return NextResponse.json(
        { success: false, message: "Format data lokasi tidak valid." },
        { status: 400 }
      );
    }

    const reportData = {
      kategori,
      deskripsi,
      lokasi,
      // Jika login, pakai nama user. Jika tidak, pakai dari form.
      namaPelapor: user ? user.nama : namaPelapor, 
      noWaPelapor: user ? user.noWa : noWaPelapor,
    };

    if (user) {
      reportData.pelapor = user.id; // Hanya isi jika user login
    }

    if (gambar && gambar.size > 0) {
      const uploadResult = await uploadImage(gambar);
      reportData.gambarUrl = uploadResult.secure_url;
      reportData.gambarPublicId = uploadResult.public_id;
    }

    const newReport = await Report.create(reportData);

    return NextResponse.json(
      { success: true, data: newReport },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST Report Error:", error);

    return NextResponse.json(
      {
        success: false,
        message:
          error.message ||
          "Terjadi kesalahan pada server saat membuat laporan.",
      },
      { status: 500 }
    );
  }
}