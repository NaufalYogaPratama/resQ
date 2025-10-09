import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import crypto from 'crypto';
import sendEmail from '@/lib/sendEmail';

export async function POST(request) {
  await dbConnect();

  try {
    const { email } = await request.json();
    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json({ success: false, message: 'Pengguna dengan email tersebut tidak ditemukan.' }, { status: 404 });
    }

    const resetToken = crypto.randomBytes(20).toString('hex');

    user.resetPasswordToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');
    
    user.resetPasswordExpire = Date.now() + 60 * 60 * 1000; 

    await user.save();

    const resetUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/reset-password/${resetToken}`;

    const htmlMessage = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <div style="max-width: 600px; margin: 20px auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
          <h2 style="color: #4B5EAA; text-align: center;">Reset Kata Sandi Akun ResQ</h2>
          <p>Halo ${user.namaLengkap},</p>
          <p>Anda menerima email ini karena ada permintaan untuk mereset kata sandi akun Anda. Silakan klik tombol di bawah ini untuk melanjutkan.</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" style="background-color: #4B5EAA; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;">Reset Kata Sandi</a>
          </div>
          <p>Link ini akan kedaluwarsa dalam 1 jam.</p>
          <p>Jika Anda tidak merasa meminta reset kata sandi, Anda bisa mengabaikan email ini.</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
          <p style="font-size: 0.9em; color: #777;">Terima kasih,<br />Tim ResQ</p>
        </div>
      </div>
    `;
    
    const textMessage = `Anda menerima email ini karena Anda (atau orang lain) meminta reset kata sandi untuk akun Anda.\n\nSalin dan tempel URL berikut ke browser Anda untuk melanjutkan:\n\n${resetUrl}\n\nJika Anda tidak merasa meminta ini, abaikan saja email ini.\n`;

    try {
      await sendEmail({
        email: user.email,
        subject: 'Reset Kata Sandi Akun ResQ',
        message: textMessage,
        html: htmlMessage, // Kirim konten HTML
      });

      return NextResponse.json({ success: true, message: 'Email terkirim!' });
    } catch (error) {
      console.error("Email Error:", error);
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save();
      return NextResponse.json({ success: false, message: 'Gagal mengirim email.' }, { status: 500 });
    }
  } catch (error) {
    console.error("Forgot Password Error:", error);
    return NextResponse.json({ success: false, message: 'Terjadi kesalahan pada server.' }, { status: 500 });
  }
}