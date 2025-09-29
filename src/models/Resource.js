import mongoose from 'mongoose';

const ResourceSchema = new mongoose.Schema({
  namaSumberDaya: {
    type: String,
    required: [true, 'Nama sumber daya wajib diisi.'],
    trim: true,
  },
  tipe: {
    type: String,
    required: true,
    enum: ['Aset', 'Keahlian'],
  },
  deskripsi: {
    type: String,
    trim: true,
  },
  pemilik: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  ketersediaan: {
    type: String,
    enum: ['Tersedia', 'Sedang Digunakan', 'Tidak Tersedia'],
    default: 'Tersedia',
  },
}, {
  timestamps: true,
});

// Nama model tetap 'Resource'
export default mongoose.models.Resource || mongoose.model('Resource', ResourceSchema);