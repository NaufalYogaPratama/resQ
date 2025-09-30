import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  namaLengkap: {
    type: String,
    required: [true, 'Nama lengkap wajib diisi.'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Email wajib diisi.'],
    unique: true,
    match: [/.+\@.+\..+/, 'Silakan masukkan alamat email yang valid.'],
    trim: true,
    lowercase: true,
  },
  kataSandi: {
    type: String,
    required: [true, 'Kata sandi wajib diisi.'],
    minlength: [6, 'Kata sandi minimal harus 6 karakter.'],
  },
  noWa: {
    type: String,
    required: [true, 'Nomor WhatsApp wajib diisi.'],
    trim: true,
  },
  peran: {
    type: String,
    enum: ['Warga', 'Relawan', 'Admin'],
    default: 'Warga',
  },
  poin: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
});

export default mongoose.models.User || mongoose.model('User', UserSchema);