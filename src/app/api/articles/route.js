import { NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth';
import dbConnect from '@/lib/dbConnect';
import Article from '@/models/Article';
import cloudinary from 'cloudinary';

// Konfigurasi Cloudinary (wajib ada)
cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Fungsi bantuan untuk mengubah file menjadi format yang bisa diupload
async function uploadImage(file) {
    const fileBuffer = await file.arrayBuffer();
    const mime = file.type;
    const encoding = 'base64';
    const base64Data = Buffer.from(fileBuffer).toString('base64');
    const fileUri = 'data:' + mime + ';' + encoding + ',' + base64Data;
    
    // Upload ke Cloudinary
    const result = await cloudinary.v2.uploader.upload(fileUri, {
        folder: 'resq_articles' // Simpan di dalam folder 'resq_articles'
    });
    return result;
}

// FUNGSI GET: Mengambil semua artikel
export async function GET(request) {
    await dbConnect();
    try {
        const articles = await Article.find({}).sort({ createdAt: -1 });
        return NextResponse.json({ success: true, data: articles });
    } catch (error) {
        return NextResponse.json({ success: false, message: "Server Error" }, { status: 500 });
    }
}

// FUNGSI POST: Membuat artikel baru
export async function POST(request) {
    const user = await verifyAuth();
    if (!user || user.peran !== 'Admin') {
        return NextResponse.json({ success: false, message: 'Akses ditolak.' }, { status: 403 });
    }

    await dbConnect();
    try {
        const formData = await request.formData();
        const judul = formData.get('judul');
        const isiKonten = formData.get('isiKonten');
        const kategori = formData.get('kategori');
        const gambar = formData.get('gambar');

        if (!judul || !isiKonten || !kategori) {
            return NextResponse.json({ success: false, message: "Judul, isi konten, dan kategori wajib diisi." }, { status: 400 });
        }
        
        const newArticleData = {
            judul,
            isiKonten,
            kategori,
            penulis: user.id,
        };

        if (gambar && gambar.size > 0) {
            const uploadResult = await uploadImage(gambar);
            newArticleData.gambarUrl = uploadResult.secure_url;
            newArticleData.gambarPublicId = uploadResult.public_id; // Simpan public_id untuk bisa menghapus
        }
        
        const newArticle = await Article.create(newArticleData);
        return NextResponse.json({ success: true, data: newArticle }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message || "Terjadi kesalahan pada server." }, { status: 500 });
    }
}