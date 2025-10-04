const mongoose = require('mongoose');
const HistoricEvent = require('../src/models/HistoricEvent').default; 
require('dotenv').config({ path: './.env' });

const MONGODB_URI = process.env.MONGODB_URI;

const eventsData = [
  {
    title: "Banjir Kanal Timur Semarang",
    description: "Banjir besar melanda wilayah Semarang Utara dan sekitarnya pada awal Februari 2021 akibat curah hujan ekstrem dan meluapnya Kanal Banjir Timur. Ribuan rumah terendam dan aktivitas warga lumpuh.",
    date: new Date("2021-02-06"),
    eventType: "Banjir",
    impactedAreas: {
      type: "MultiPoint",
      coordinates: [
        [110.4393, -6.9634],
        [110.4465, -6.9718],
        [110.4242, -6.9585],
      ],
    },
    source: "Berbagai sumber berita media lokal",
  },
  {
    title: "Tanah Longsor di Tembalang",
    description: "Curah hujan tinggi memicu beberapa titik longsor di area perbukitan Kecamatan Tembalang, merusak beberapa rumah warga dan menutup akses jalan.",
    date: new Date("2023-01-15"),
    eventType: "Tanah Longsor",
    impactedAreas: {
      type: "MultiPoint",
      coordinates: [
        [110.4410, -7.0541], 
        [110.4321, -7.0688], 
      ],
    },
    source: "Laporan BPBD Kota Semarang",
  },
];

async function seedDatabase() {
  if (!MONGODB_URI) {
    console.error("MONGODB_URI tidak ditemukan di .env.local");
    process.exit(1);
  }

  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Berhasil terhubung ke MongoDB.");

    await HistoricEvent.deleteMany({});
    console.log("Data histori lama berhasil dihapus.");

    await HistoricEvent.insertMany(eventsData);
    console.log("Data histori baru berhasil ditambahkan!");

  } catch (error) {
    console.error("Gagal menjalankan seed script:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Koneksi MongoDB ditutup.");
  }
}

seedDatabase();