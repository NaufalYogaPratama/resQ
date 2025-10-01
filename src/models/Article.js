import mongoose from 'mongoose';

import '@/models/User';

const ArticleSchema = new mongoose.Schema({
  judul: { 
    type: String,
    required: [true, 'Judul artikel wajib diisi.'],
    trim: true,
    unique: true, 
  },
  isiKonten: { 
    type: String,
    required: [true, 'Konten artikel wajib diisi.'],
  },
  kategori: {
    type: String,
    required: [true, 'Kategori wajib diisi.'],
    enum: ['Banjir', 'Gempa Bumi', 'P3K', 'Kesiapsiagaan Umum', 'Lainnya'],
  },
  penulis: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  gambarUrl: {
    type: String,
    trim: true,
  },
}, {
  timestamps: true,
});

export default mongoose.models.Article || mongoose.model('Article', ArticleSchema);