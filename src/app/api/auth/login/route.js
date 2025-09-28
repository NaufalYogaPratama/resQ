import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

export async function POST(request) {
  await dbConnect();

  try {
    const { email, kataSandi } = await request.json();

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { message: "Email atau kata sandi salah." },
        { status: 401 }
      );
    }

    const isMatch = await bcrypt.compare(kataSandi, user.kataSandi);
    if (!isMatch) {
      return NextResponse.json(
        { message: "Email atau kata sandi salah." },
        { status: 401 }
      );
    }

    const payload = {
      id: user._id,
      nama: user.namaLengkap,
      peran: user.peran,
    };

    // 4. Buat dan tandatangani token JWT
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    const response = NextResponse.json({
        message: "Login berhasil.",
        user: payload
    });

    response.cookies.set('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development',
        maxAge: 60 * 60 * 24,
        path: '/',
    });
    
    return response;

  } catch (error) {
    return NextResponse.json(
      { message: "Terjadi kesalahan pada server.", error: error.message },
      { status: 500 }
    );
  }
}