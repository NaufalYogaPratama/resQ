<div align="center">
<img src="public/ResQLogoPutih.png" alt="ResQ" width="600"/>



<h1>ResQ: Teknologi Menghubungkan Warga Menggerakan</h1>
<p>
<strong>Sebuah platform gotong royong digital untuk manajemen bencana yang menghubungkan warga, relawan, dan admin dalam satu ekosistem responsif.</strong>
</p>



<a href="https://res-q-neon-six.vercel.app/"><strong>Live Demo »</strong></a>

</div>

# 🚀 Demo & Akun Pengujian

Akses aplikasi yang sudah di-deploy untuk melihat semua fitur secara langsung. Gunakan akun di bawah ini untuk menguji setiap peran.

Link Demo: https://res-q-neon-six.vercel.app/

## Alur Pengujian Utama: Dari Warga Menjadi Relawan

Skenario ini menunjukkan alur inti dari aplikasi ResQ
- Registrasi sebagai Warga: Buat akun baru melalui halaman registrasi. Anda akan masuk ke Dashboard Warga.
- Kontribusi Aset: Untuk bisa menjadi relawan, Anda harus berkontribusi terlebih dahulu. Masuk ke menu Sumber Daya dan tambahkan minimal 3 aset (contoh: tenda, genset, dll).
- Pengajuan Diri: Setelah 3 aset ditambahkan, tombol pengajuan akan aktif di halaman Profil. Klik untuk mengajukan diri.
- Verifikasi oleh Admin: Login sebagai Admin menggunakan akun demo email: resq@gmail.com pw: resq123. Temukan pengguna di menu Users dan setujui pengajuannya.
- Selamat! Anda adalah Relawan: Login kembali dengan akun pertama. Anda sekarang akan masuk Dashboard Relawan.

# ✨ Fitur Utama

<table width="100%">
  <tr>
    <td width="50%" valign="top">
      <h3>🚨 Pelaporan Real-Time</h3>
      <p>Warga dapat membuat laporan darurat dengan cepat, baik melalui form manual maupun asisten AI Chatbot (WARA).</p>
    </td>
    <td width="50%" valign="top">
      <h3>👥 Sistem Tiga Peran</h3>
      <p>Hak akses yang jelas untuk <b>Warga</b>, <b>Relawan</b>, dan <b>Admin</b> guna menjaga alur kerja tetap terstruktur dan aman.</p>
    </td>
  </tr>
  <tr>
    <td width="50%" valign="top">
      <h3>🗺️ Peta Respons Interaktif</h3>
      <p>Visualisasi geografis dari semua laporan dan sumber daya untuk koordinasi yang efektif oleh tim di lapangan.</p>
    </td>
    <td width="50%" valign="top">
      <h3>🏆 Gamifikasi & Reputasi</h3>
      <p>Sistem poin dan lencana untuk memberikan apresiasi dan motivasi atas kontribusi para relawan yang aktif.</p>
    </td>
  </tr>
  <tr>
    <td width="50%" valign="top">
      <h3>📦 Manajemen Sumber Daya</h3>
      <p>Bank data aset dan keahlian milik komunitas yang siap dimobilisasi saat dibutuhkan, dari kendaraan hingga keahlian medis.</p>
    </td>
    <td width="50%" valign="top">
      <h3>📚 Konten Edukasi</h3>
      <p>Pusat informasi berisi artikel dan panduan kesiapsiagaan bencana untuk meningkatkan literasi dan kewaspadaan warga.</p>
    </td>
  </tr>
</table>

# 🛠️ Panduan Instalasi Lokal

Ikuti langkah-langkah di bawah ini untuk menjalankan proyek ResQ di komputer lokal Anda.

## Prasyarat
- Node.js: Versi 18.x atau yang lebih baru.
- Git: Untuk melakukan clone repositori.
- MongoDB: Anda memerlukan URL koneksi ke database MongoDB.

##  Instalasi & Konfigurasi
### Clone repositori:
```bash
git clone https://github.com/NaufalYogaPratama/resQ.git
cd resQ
```
### Install dependency:
```bash
git clone npm install
```
### Setup Environment Variables:
Salin file .env
### PENTING: 
Buka file .env dan isi nilainya. Karena alasan keamanan, nilai untuk variabel env tidak disertakan. Silakan hubungi pemilik repositori untuk mendapatkan nilai yang diperlukan.

### Jalankan Aplikasi:
```bash
npm run dev
```
Aplikasi akan berjalan di http://localhost:3000.





