import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(request) {
  await dbConnect();

  try {
    const { namaLengkap, email, kataSandi, noWa } = await request.json();

    const userExists = await User.findOne({ email });
    if (userExists) {
      return NextResponse.json(
        { message: "Email sudah terdaftar." },
        { status: 400 }
      );
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(kataSandi, salt);

    const newUser = new User({
      namaLengkap,
      email,
      kataSandi: hashedPassword,
      noWa,
    });

    await newUser.save();

    return NextResponse.json(
      { message: "Pengguna berhasil dibuat." },
      { status: 201 }
    );

  } catch (error) {
    return NextResponse.json(
      { message: "Terjadi kesalahan pada server.", error: error.message },
      { status: 500 }
    );
  }
}