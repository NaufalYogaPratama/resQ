import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

export async function POST(request) {
  try {
    const { message } = await request.json();

    if (!message) {
      return NextResponse.json({ success: false, message: 'Pesan tidak boleh kosong.' }, { status: 400 });
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `
      Anda adalah WARA, asisten chatbot untuk aplikasi pelaporan darurat ResQ.
      Tugas Anda adalah mengubah pesan dari pengguna menjadi laporan darurat yang terstruktur dalam format JSON.

      Anda HANYA boleh mengekstrak informasi berikut:
      1. "kategori": Pilih salah satu dari: "Medis", "Evakuasi", "Kerusakan Properti", atau "Lainnya".
      2. "deskripsi": Ringkasan singkat kejadian dalam satu kalimat yang jelas.

      PENTING: JANGAN mencoba mengekstrak "alamat". Tugas Anda bukan mencari lokasi.

      Aturan Ketat:
      - Jika ada informasi yang tidak bisa Anda temukan, isi nilainya dengan string kosong ("").
      - Respons Anda HARUS HANYA berupa JSON yang valid, tanpa teks tambahan, tanpa markdown (seperti \`\`\`json).

      Contoh Pesan Pengguna: "Tolong, ada kebakaran di rumah Pak Budi. Asapnya tebal sekali."
      Contoh Respons JSON Anda:
      {
        "kategori": "Kerusakan Properti",
        "deskripsi": "Kebakaran di sebuah rumah dengan asap tebal."
      }
      
      Contoh Pesan Pengguna: "Ada orang pingsan"
      Contoh Respons JSON Anda:
      {
        "kategori": "Medis",
        "deskripsi": "Seseorang ditemukan pingsan."
      }

      Sekarang, proses pesan pengguna berikut:
      Pesan: "${message}"
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = await response.text();

    const jsonResponse = text.replace(/```json/g, '').replace(/```/g, '').trim();

    try {
      const parsedJson = JSON.parse(jsonResponse);
      return NextResponse.json({ success: true, data: parsedJson });
    } catch (e) {
      console.error("Gagal mem-parsing JSON dari Gemini. Error:", e, "Respons Asli:", jsonResponse);
      throw new Error("Gagal memproses respons dari AI.");
    }

  } catch (error) {
    console.error('WARA API Error:', error);
    return NextResponse.json({ success: false, message: 'Terjadi kesalahan pada server AI.' }, { status: 500 });
  }
}
