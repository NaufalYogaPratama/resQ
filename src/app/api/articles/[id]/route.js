import dbConnect from "@/lib/dbConnect";
import Article from "@/models/Article";
import { verifyAuth } from "@/lib/auth";
import { NextResponse } from "next/server";

// MENGAMBIL SATU ARTIKEL BERDASARKAN ID
export async function GET(request, { params }) {
  await dbConnect();
  try {
    const article = await Article.findById(params.id).populate('author', 'namaLengkap');
    if (!article) {
      return NextResponse.json({ success: false, message: "Artikel tidak ditemukan." }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: article });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Server Error" }, { status: 500 });
  }
}

// MENGUPDATE ARTIKEL (HANYA ADMIN)
export async function PUT(request, { params }) {
  const user = verifyAuth();
  if (!user || user.peran !== 'Admin') {
    return NextResponse.json({ success: false, message: "Akses ditolak." }, { status: 403 });
  }

  await dbConnect();
  try {
    const body = await request.json();
    const updatedArticle = await Article.findByIdAndUpdate(params.id, body, {
      new: true,
      runValidators: true,
    });
    if (!updatedArticle) {
      return NextResponse.json({ success: false, message: "Artikel tidak ditemukan." }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: updatedArticle });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 400 });
  }
}

// MENGHAPUS ARTIKEL (HANYA ADMIN)
export async function DELETE(request, { params }) {
    const user = verifyAuth();
    if (!user || user.peran !== 'Admin') {
      return NextResponse.json({ success: false, message: "Akses ditolak." }, { status: 403 });
    }
  
    await dbConnect();
    try {
      const deletedArticle = await Article.findByIdAndDelete(params.id);
      if (!deletedArticle) {
        return NextResponse.json({ success: false, message: "Artikel tidak ditemukan." }, { status: 404 });
      }
      return NextResponse.json({ success: true, data: {} });
    } catch (error) {
      return NextResponse.json({ success: false, message: "Server Error" }, { status: 500 });
    }
}