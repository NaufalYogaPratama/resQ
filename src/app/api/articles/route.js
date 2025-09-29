import dbConnect from "@/lib/dbConnect";
import Article from "@/models/Article";
import { verifyAuth } from "@/lib/auth";
import { NextResponse } from "next/server";

// MENGAMBIL SEMUA ARTIKEL (UNTUK PUBLIK)
export async function GET() {
  await dbConnect();
  try {
    const articles = await Article.find({}).sort({ createdAt: -1 }).populate('penulis', 'namaLengkap');
    return NextResponse.json({ success: true, data: articles });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Server Error" }, { status: 500 });
  }
}

// MEMBUAT ARTIKEL BARU (HANYA ADMIN)
export async function POST(request) {
  const user = verifyAuth();
  if (!user || user.peran !== 'Admin') {
    return NextResponse.json({ success: false, message: "Akses ditolak." }, { status: 403 });
  }

  await dbConnect();
  try {
    const body = await request.json();
    const newArticle = await Article.create({
      ...body,
      penulis: user.id, // <-- PASTIKAN BARIS INI SUDAH BENAR
    });
    return NextResponse.json({ success: true, data: newArticle }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 400 });
  }
}