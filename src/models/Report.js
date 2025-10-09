import mongoose from 'mongoose';

const ReportSchema = new mongoose.Schema({
  pelapor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },

  namaPelapor: {
    type: String,
    trim: true,
  },
  
  noWaPelapor: {
    type: String,
    trim: true,
  },
  
  kategori: {
    type: String,
    required: [true, 'Kategori laporan wajib diisi.'],
    enum: ['Medis', 'Evakuasi', 'Kerusakan Properti', 'Lainnya'],
  },

  deskripsi: {
    type: String,
    required: [true, 'Deskripsi singkat wajib diisi.'],
    trim: true,
  },

  lokasi: {
    type: {
      type: String,
      enum: ['Point'],
      required: true,
      default: 'Point',
    },
    coordinates: {
      type: [Number], // Format: [longitude, latitude]
      required: true,
    },
    alamat: {
      type: String,
      trim: true,
    }
  },

  status: {
    type: String,
    enum: ['Menunggu', 'Ditangani', 'Selesai'],
    default: 'Menunggu',
  },

  penolong: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  
  gambarUrl: {
    type: String,
    trim: true,
  },
  
  gambarPublicId: {
    type: String,
  },

}, {
  timestamps: true,
});

ReportSchema.index({ lokasi: '2dsphere' });

export default mongoose.models.Report || mongoose.model('Report', ReportSchema);