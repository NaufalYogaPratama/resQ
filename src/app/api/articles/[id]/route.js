import { NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth';
import dbConnect from '@/lib/dbConnect';
import Article from '@/models/Article';
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
    
    const result = await cloudinary.v2.uploader.upload(fileUri, {
        folder: 'resq_articles'
    });
    return result;
}

export async function GET(request, { params }) {
    await dbConnect();
    try {
        const { id } = params;
        const article = await Article.findById(id);

        if (!article) {
            return NextResponse.json({ success: false, message: "Artikel tidak ditemukan." }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: article });
    } catch (error) {

        console.error("Gagal mengambil artikel by ID:", error);
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
        const { id } = params;
        const article = await Article.findById(id);

        if (!article) {
            return NextResponse.json({ success: false, message: "Artikel tidak ditemukan." }, { status: 404 });
        }

        const formData = await request.formData();
        const updatedData = {
            judul: formData.get('judul'),
            isiKonten: formData.get('isiKonten'),
            kategori: formData.get('kategori'),
        };

        const gambar = formData.get('gambar');

        if (gambar && gambar.size > 0) {
            if (article.gambarPublicId) {
                await cloudinary.v2.uploader.destroy(article.gambarPublicId);
            }
            const uploadResult = await uploadImage(gambar);
            updatedData.gambarUrl = uploadResult.secure_url;
            updatedData.gambarPublicId = uploadResult.public_id;
        }

        const updatedArticle = await Article.findByIdAndUpdate(id, updatedData, { new: true });
        return NextResponse.json({ success: true, data: updatedArticle });

    } catch (error) {
        console.error("Gagal update artikel:", error);
        return NextResponse.json({ success: false, message: error.message || "Server Error" }, { status: 500 });
    }
}


export async function DELETE(request, { params }) {
    const user = await verifyAuth();
    if (!user || user.peran !== 'Admin') {
        return NextResponse.json({ success: false, message: "Akses ditolak." }, { status: 403 });
    }
 
    await dbConnect();
    try {
        const { id } = params;
        const article = await Article.findById(id);

        if (!article) {
            return NextResponse.json({ success: false, message: "Artikel tidak ditemukan." }, { status: 404 });
        }

        if (article.gambarPublicId) {
            await cloudinary.v2.uploader.destroy(article.gambarPublicId);
        }

        await Article.findByIdAndDelete(id);
        return NextResponse.json({ success: true, message: "Artikel berhasil dihapus." });

    } catch (error) {
        console.error("Gagal hapus artikel:", error);
        return NextResponse.json({ success: false, message: error.message || "Server Error" }, { status: 500 });
    }
}