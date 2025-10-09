import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';

export async function PUT(request, { params }) {
  try {
    const { token } = params;
    const { password } = await request.json();

    // 1. Hash token dari URL untuk dicocokkan dengan yang di DB
    const resetPasswordToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    await dbConnect();

    // 2. Cari user berdasarkan token yang valid dan belum kedaluwarsa
    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return NextResponse.json({ success: false, message: 'Token reset tidak valid atau sudah kedaluwarsa.' }, { status: 400 });
    }

    // 3. Hash kata sandi baru dan perbarui user
    const salt = await bcrypt.genSalt(10);
    user.kataSandi = await bcrypt.hash(password, salt);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    
    await user.save();

    return NextResponse.json({ success: true, message: 'Kata sandi berhasil diperbarui.' });

  } catch (error) {
    console.error("Reset Password Error:", error);
    return NextResponse.json({ success: false, message: 'Terjadi kesalahan pada server.' }, { status: 500 });
  }
}