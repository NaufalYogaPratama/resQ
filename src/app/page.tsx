// "use client"

// import Link from "next/link"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { ShieldCheck, Users, Map, BookOpen, HandHeart, MessageCircle } from "lucide-react"


// export default function HomePage() {
//   const features = [
//     {
//       icon: <MessageCircle className="w-8 h-8 text-amber-400" />,
//       title: "Lapor Cerdas (AI Chatbot)",
//       description: "Laporkan darurat via chat. Biarkan AI kami yang menyusun detailnya secara otomatis.",
//     },
//     {
//       icon: <Map className="w-8 h-8 text-amber-400" />,
//       title: "Peta Respons Real-Time",
//       description: "Visualisasikan semua laporan di peta interaktif dengan pin berkode warna sesuai status prioritas.",
//     },
//     {
//       icon: <Users className="w-8 h-8 text-amber-400" />,
//       title: "Bank Sumber Daya",
//       description: "Petakan aset dan keahlian warga untuk mobilisasi cepat saat dibutuhkan.",
//     },
//     {
//       icon: <BookOpen className="w-8 h-8 text-amber-400" />,
//       title: "Pusat Edukasi",
//       description: "Tingkatkan kesiapan Anda dan komunitas melalui panduan terkurasi.",
//     },
//   ]

//   return (
//     <div className="bg-[#0b0f14] text-slate-100 font-sans">
//       {/* --- Navbar --- */}
//       <nav className="sticky top-0 z-50 bg-white/5 backdrop-blur supports-[backdrop-filter]:bg-white/5 border-b border-white/10">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex justify-between items-center h-20">
//             <div className="flex items-center gap-3">
//               <Link href="/" className="text-3xl font-bold text-white">
//                 ResQ
//               </Link>
              
//             </div>
//             <div className="hidden md:block">
//               <div className="ml-10 flex items-baseline space-x-4">
//                 <Link
//                   href="#fitur"
//                   className="text-slate-300 hover:text-amber-400 px-3 py-2 rounded-md text-sm font-medium"
//                 >
//                   Fitur
//                 </Link>
//                 <Link
//                   href="#tentang"
//                   className="text-slate-300 hover:text-amber-400 px-3 py-2 rounded-md text-sm font-medium"
//                 >
//                   Tentang
//                 </Link>
//                 <Link
//                   href="#cara-kerja"
//                   className="text-slate-300 hover:text-amber-400 px-3 py-2 rounded-md text-sm font-medium"
//                 >
//                   Cara Kerja
//                 </Link>
//               </div>
//             </div>
//             <div className="hidden md:flex items-center space-x-2">
//               <Link
//                 href="/login"
//                 className="bg-amber-500 text-black px-4 py-2 rounded-md text-sm font-semibold hover:bg-amber-400"
//               >
//                 Masuk
//               </Link>
//               <Link
//                 href="/register"
//                 className="border border-amber-400/60 text-amber-300 px-4 py-2 rounded-md text-sm font-semibold hover:bg-amber-400/10"
//               >
//                 Gabung Komunitas
//               </Link>
              
//             </div>
//           </div>
//         </div>
//       </nav>

//       <main>
//         {/* --- Hero Section --- */}
//         <section className="relative h-[80vh] flex items-center justify-center text-white">
//           <div
//             className="absolute inset-0 bg-cover bg-center"
//             style={{
//               backgroundImage:
//                 "url('https://assetd.kompas.id/VQAgRiFNZnYN3pgBflrJB6AhiJw=/fit-in/1280x844/filters:format(webp):quality(80):watermark(https://cdn-content.kompas.id/umum/kompas_main_logo.png,-16p,-13p,0)/https://asset.kgnewsroom.com/photo/pre/2024/03/14/dfcc906e-a291-4d73-bdbe-209743e38389_jpg.jpg')",
//             }}
//           ></div>
//           <div className="absolute inset-0 bg-black/70"></div>
//           <div className="relative z-10 text-center px-4">
//             <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
//               {"Teknologi Menghubungkan "}
//               <span className="text-amber-300">{"Warga Menggerakkan"}</span>
//               {"."}
//             </h1>
//             <p className="mt-4 max-w-2xl mx-auto text-lg md:text-xl text-slate-300">
//               {
//                 "Saat bencana, waktu adalah segalanya. ResQ mengubah niat baik menjadi aksi bersama—cepat, terarah, dan berdampak."
//               }
//             </p>
//             <div className="mt-8 flex justify-center gap-4">
       
       
       
       
       
       
       
//               <Link
//                 href="/register"
//                 className="bg-amber-500 text-black px-8 py-3 rounded-md text-lg font-semibold hover:bg-amber-400 transition-transform hover:scale-105"
//               >
//                 Bergabung Jadi Relawan
//               </Link>
//               <Link
//                 href="#fitur"
//                 className="border-2 border-white/60 text-white px-8 py-3 rounded-md text-lg font-semibold hover:bg-white hover:text-black transition-colors"
//               >
//                 Lihat Fitur
//               </Link>
//             </div>

            

//             {/* stat chips */}
//             <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3 max-w-3xl mx-auto">
//               <div className="px-3 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-slate-300 text-center">
//                 3 Peran Inti
//               </div>
//               <div className="px-3 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-slate-300 text-center">
//                 10+ Fitur
//               </div>
//               <div className="px-3 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-slate-300 text-center">
//                 100% Komunitas
//               </div>
//               <div className="px-3 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-slate-300 text-center">
//                 Siaga 24/7
//               </div>
//             </div>
//           </div>
//         </section>
//         {/* --- Features Section --- */}
//         <section id="fitur" className="py-20">
//           <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//             <div className="text-center mb-16">
//               <p className="uppercase tracking-wide text-amber-300 font-semibold text-sm">Ekosistem Sigap</p>
//               <h2 className="text-3xl font-extrabold text-white tracking-tight sm:text-4xl">
//                 Bukan Sekadar Aplikasi, Ini Ekosistem
//               </h2>
//               <p className="mt-4 max-w-2xl mx-auto text-xl text-slate-300">
//                 Fitur yang memberdayakan gotong royong dari pelaporan hingga koordinasi lapangan.
//               </p>
//             </div>
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
//               {features.map((feature) => (
//                 <Card
//                   key={feature.title}
//                   className="bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all duration-300 hover:-translate-y-1"
//                 >
//                   <CardHeader>
//                     <div className="bg-amber-400/10 p-4 rounded-lg w-fit group-hover:bg-amber-400/20 transition-colors">
//                       {feature.icon}
//                     </div>
//                     <CardTitle className="mt-4 text-white">{feature.title}</CardTitle>
//                   </CardHeader>
//                   <CardContent>
//                     <p className="text-slate-300">{feature.description}</p>
//                   </CardContent>
//                 </Card>
//               ))}
//             </div>
//           </div>
//         </section>

//         {/* --- About Section --- */}
//         <section id="tentang" className="py-20">
//           <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
//               <div>
//                 <p className="text-amber-300 font-semibold uppercase">Tentang ResQ</p>
//                 <h2 className="mt-2 text-3xl md:text-4xl font-extrabold text-white">
//                   Mengubah Potensi Menjadi Aksi Nyata
//                 </h2>
//                 <p className="mt-4 text-slate-300 text-lg">
//                   ResQ lahir dari keyakinan bahwa kekuatan terbesar dalam menghadapi krisis adalah komunitas itu
//                   sendiri. Kami memecahkan "Paradoks Komunikasi Modern" di mana grup chat justru menciptakan
//                   kebingungan. Dengan ResQ, setiap warga diberdayakan untuk menjadi bagian dari solusi.
//                 </p>
//                 <ul className="mt-6 space-y-2">
//                   <li className="flex items-center">
//                     <HandHeart className="w-5 h-5 text-amber-400 mr-2" />
//                     <span>
//                       <span className="font-semibold">Warga</span>: Melaporkan & menawarkan bantuan.
//                     </span>
//                   </li>
//                   <li className="flex items-center">
//                     <ShieldCheck className="w-5 h-5 text-amber-400 mr-2" />
//                     <span>
//                       <span className="font-semibold">Relawan</span>: Merespons & berkoordinasi di lapangan.
//                     </span>
//                   </li>
//                   <li className="flex items-center">
//                     <Users className="w-5 h-5 text-amber-400 mr-2" />
//                     <span>
//                       <span className="font-semibold">Admin</span>: Mengelola & memverifikasi sistem.
//                     </span>
//                   </li>
//                 </ul>
//               </div>
//               <div className="grid grid-cols-2 gap-4">
//                 <img
//                   src="https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?q=80&w=1887&auto=format&fit=crop"
//                   alt="Kerja sama komunitas mengangkat logistik"
//                   className="rounded-lg shadow-lg w-full object-cover"
//                 />
//                 <img
//                   src="https://images.unsplash.com/photo-1626252346592-748059c40333?q=80&w=2070&auto=format&fit=crop"
//                   alt="Relawan membantu korban bencana"
//                   className="rounded-lg shadow-lg w-full object-cover mt-8"
//                 />
//               </div>
//             </div>
//           </div>
//         </section>

//         {/* --- How It Works Section --- */}
//         <section id="cara-kerja" className="py-20">
//           <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//             <div className="text-center mb-12">
//               <h2 className="text-3xl font-extrabold text-white">Cara Kerja Gotong Royong</h2>
//               <p className="mt-3 text-slate-300 max-w-2xl mx-auto">
//                 {
//                   "Dari laporan hingga penanganan—semua terstruktur agar bantuan tepat sasaran dan tidak tumpang tindih."
//                 }
//               </p>
//             </div>
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//               <div className="p-6 rounded-xl bg-white/5 border border-white/10">
//                 <div className="flex items-center gap-3">
//                   <MessageCircle className="w-6 h-6 text-amber-300" />
//                   <h3 className="font-semibold text-white">1. Lapor & Kumpulkan Info</h3>
//                 </div>
//                 <p className="mt-3 text-slate-300">
//                   {"Warga melapor via AI Chatbot. Detail otomatis disusun agar mudah dipahami semua pihak."}
//                 </p>
//               </div>
//               <div className="p-6 rounded-xl bg-white/5 border border-white/10">
//                 <div className="flex items-center gap-3">
//                   <Map className="w-6 h-6 text-amber-300" />
//                   <h3 className="font-semibold text-white">2. Pemetaan & Prioritas</h3>
//                 </div>
//                 <p className="mt-3 text-slate-300">
//                   {"Laporan muncul di peta real-time dengan prioritas. Tim fokus ke titik paling kritis."}
//                 </p>
//               </div>
//               <div className="p-6 rounded-xl bg-white/5 border border-white/10">
//                 <div className="flex items-center gap-3">
//                   <ShieldCheck className="w-6 h-6 text-amber-300" />
//                   <h3 className="font-semibold text-white">3. Mobilisasi Bantuan</h3>
//                 </div>
//                 <p className="mt-3 text-slate-300">
//                   {"Relawan & sumber daya warga diaktifkan, koordinasi lapangan tercatat rapi hingga selesai."}
//                 </p>
//               </div>
//             </div>
//           </div>
//         </section>

//         {/* --- Real Stories Section --- */}
//         <section className="py-20">
//           <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//             <div className="text-center mb-12">
//               <h2 className="text-3xl font-extrabold text-white">Kisah Nyata dari Lapangan</h2>
//               <p className="mt-3 text-slate-300 max-w-2xl mx-auto">
//                 {"Cerita singkat bagaimana gotong royong mempercepat penanganan bencana."}
//               </p>
//             </div>
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//               <blockquote className="p-6 rounded-xl bg-white/5 border border-white/10">
//                 <p className="text-slate-200">
//                   {
//                     '"Dalam 30 menit setelah banjir, semua kebutuhan prioritas sudah terpetakan. Bantuan datang tepat sasaran."'
//                   }{" "}
//                 </p>
//                 <footer className="mt-3 text-sm text-slate-400">— Koordinator RW</footer>
//               </blockquote>
//               <blockquote className="p-6 rounded-xl bg-white/5 border border-white/10">
//                 <p className="text-slate-200">
//                   {
//                     '"Saya hanya chat singkat, tapi tim langsung tahu lokasi dan kondisi ayah saya. Terima kasih, ResQ."'
//                   }{" "}
//                 </p>
//                 <footer className="mt-3 text-sm text-slate-400">— Keluarga Korban</footer>
//               </blockquote>
//               <blockquote className="p-6 rounded-xl bg-white/5 border border-white/10">
//                 <p className="text-slate-200">
//                   {'"Relawan tidak menumpuk di satu titik lagi. Semua terkoordinasi lewat peta status."'}{" "}
//                 </p>
//                 <footer className="mt-3 text-sm text-slate-400">— Relawan Lapangan</footer>
//               </blockquote>
//             </div>
//           </div>
//         </section>

//         {/* --- Community Actions Gallery --- */}
//         <section className="py-20">
//           <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//             <div className="text-center mb-10">
//               <h2 className="text-3xl font-extrabold text-white">Aksi Komunitas</h2>
//               <p className="mt-3 text-slate-300">
//                 {"Tiap tangan berarti. Inilah potret gotong royong yang terjadi setiap hari."}
//               </p>
//             </div>
//             <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//               <img
//                 src="https://images.unsplash.com/photo-1617953141968-c1b22d1f9b4b?q=80&w=1200&auto=format&fit=crop"
//                 alt="Distribusi logistik"
//                 className="w-full h-40 object-cover rounded-lg ring-1 ring-white/10"
//               />
//               <img
//                 src="https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1200&auto=format&fit=crop"
//                 alt="Koordinasi tim"
//                 className="w-full h-40 object-cover rounded-lg ring-1 ring-white/10"
//               />
//               <img
//                 src="https://images.unsplash.com/photo-1542623024-a797a755b8ee?q=80&w=1200&auto=format&fit=crop"
//                 alt="Evakuasi warga"
//                 className="w-full h-40 object-cover rounded-lg ring-1 ring-white/10"
//               />
//               <img
//                 src="https://images.unsplash.com/photo-1515165562835-c3b8c8c58d12?q=80&w=1200&auto=format&fit=crop"
//                 alt="Dapur umum"
//                 className="w-full h-40 object-cover rounded-lg ring-1 ring-white/10"
//               />
//             </div>
//           </div>
//         </section>

//         {/* --- Footer CTA Section --- */}
//         <section className="py-20 text-center bg-white/5">
//           <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
//             <h2 className="text-3xl md:text-4xl font-extrabold text-white">
//               {"Ambil Peran Anda dalam Membangun Komunitas Tangguh"}
//             </h2>
//             <p className="mt-4 text-lg text-slate-300">
//               {"Setiap kontribusi berarti. Jadi pelapor, relawan, atau donatur—semua punya peran."}
//             </p>
//             <div className="mt-8 flex items-center justify-center gap-3">
//               <Link
//                 href="/register"
//                 className="inline-block bg-amber-500 text-black px-8 py-3 rounded-md text-lg font-semibold hover:bg-amber-400"
//               >
//                 Daftar Sekarang, Gratis!
//               </Link>
//               <Link
//                 href="#cara-kerja"
//                 className="inline-block border-2 border-white/20 px-8 py-3 rounded-md text-lg font-semibold hover:bg-white hover:text-black"
//               >
//                 Lihat Cara Kerja
//               </Link>
//             </div>
//           </div>
//         </section>
//       </main>

//       {/* --- Footer --- */}
//       <footer className="bg-[#0a0d12] text-slate-400 border-t border-white/10">
//         <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
//           <div className="text-center">
//             <p>&copy; {new Date().getFullYear()} ResQ. Dibuat dengan semangat gotong royong.</p>
//           </div>
//         </div>
//       </footer>
//     </div>
//   )
// }



"use client"

import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ShieldCheck, Users, Map, BookOpen, HandHeart, MessageCircle } from "lucide-react"

export default function HomePage() {
  const features = [
    {
      icon: <MessageCircle className="w-8 h-8 text-amber-400" />,
      title: "Lapor Cerdas (AI Chatbot)",
      description: "Laporkan darurat via chat. Biarkan AI kami yang menyusun detailnya secara otomatis.",
    },
    {
      icon: <Map className="w-8 h-8 text-amber-400" />,
      title: "Peta Respons Real-Time",
      description: "Visualisasikan semua laporan di peta interaktif dengan pin berkode warna sesuai status prioritas.",
    },
    {
      icon: <Users className="w-8 h-8 text-amber-400" />,
      title: "Bank Sumber Daya",
      description: "Petakan aset dan keahlian warga untuk mobilisasi cepat saat dibutuhkan.",
    },
    {
      icon: <BookOpen className="w-8 h-8 text-amber-400" />,
      title: "Pusat Edukasi",
      description: "Tingkatkan kesiapan Anda dan komunitas melalui panduan terkurasi.",
    },
  ]

  return (
    <div className="bg-white text-slate-900 font-sans">
      {/* --- Navbar --- */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/80 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-3">
              <Link href="/" className="text-3xl font-bold text-slate-900">
                ResQ
              </Link>
             
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <Link
                  href="#fitur"
                  className="text-slate-600 hover:text-amber-600 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Fitur
                </Link>
                <Link
                  href="#tentang"
                  className="text-slate-600 hover:text-amber-600 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Tentang
                </Link>
                <Link
                  href="#cara-kerja"
                  className="text-slate-600 hover:text-amber-600 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Cara Kerja
                </Link>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-2">
              <Link
                href="/login"
                className="bg-amber-500 text-black px-4 py-2 rounded-md text-sm font-semibold hover:bg-amber-400"
              >
                Masuk
              </Link>
              <Link
                href="/register"
                className="border border-amber-300 text-amber-700 px-4 py-2 rounded-md text-sm font-semibold hover:bg-amber-50"
              >
                Gabung Komunitas
              </Link>
             
            </div>
          </div>
        </div>
      </nav>

      <main>
        {/* --- Hero Section --- */}
        <section className="relative h-[80vh] flex items-center justify-center text-slate-900">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage:
                "url('https://assetd.kompas.id/VQAgRiFNZnYN3pgBflrJB6AhiJw=/fit-in/1280x844/filters:format(webp):quality(80):watermark(https://cdn-content.kompas.id/umum/kompas_main_logo.png,-16p,-13p,0)/https://asset.kgnewsroom.com/photo/pre/2024/03/14/dfcc906e-a291-4d73-bdbe-209743e38389_jpg.jpg')",
            }}
          ></div>
          <div className="absolute inset-0 bg-slate-50/70"></div>
          <div className="relative z-10 text-center px-4">
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
              {"Teknologi Menghubungkan. Komunitas "}
              <span className="text-amber-600">{"Bergotong Royong"}</span>
              {"."}
            </h1>
            <p className="mt-4 max-w-2xl mx-auto text-lg md:text-xl text-slate-600">
              {
                "Saat bencana, waktu adalah segalanya. ResQ mengubah niat baik menjadi aksi bersama—cepat, terarah, dan berdampak."
              }
            </p>
            <div className="mt-8 flex justify-center gap-4">
              <Link
                href="/register"
                className="bg-amber-500 text-black px-8 py-3 rounded-md text-lg font-semibold hover:bg-amber-400 transition-transform hover:scale-105"
              >
                Bergabung Jadi Relawan
              </Link>
              <Link
                href="#fitur"
                className="border-2 border-white/60 text-white px-8 py-3 rounded-md text-lg font-semibold hover:bg-white hover:text-black transition-colors"
              >
                Lihat Fitur
              </Link>
            </div>

            

            {/* stat chips */}
            <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3 max-w-3xl mx-auto">
              <div className="px-3 py-2 rounded-full bg-slate-50 border border-slate-200 text-sm text-slate-600 text-center">
                3 Peran Inti
              </div>
              <div className="px-3 py-2 rounded-full bg-slate-50 border border-slate-200 text-sm text-slate-600 text-center">
                10+ Fitur
              </div>
              <div className="px-3 py-2 rounded-full bg-slate-50 border border-slate-200 text-sm text-slate-600 text-center">
                100% Komunitas
              </div>
              <div className="px-3 py-2 rounded-full bg-slate-50 border border-slate-200 text-sm text-slate-600 text-center">
                Siaga 24/7
              </div>
            </div>
          </div>
        </section>

        {/* --- Features Section --- */}
        <section id="fitur" className="py-20 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <p className="uppercase tracking-wide text-amber-600 font-semibold text-sm">Ekosistem Sigap</p>
              <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight sm:text-4xl mt-2">
                Bukan Sekadar Aplikasi, Ini Ekosistem
              </h2>
              <p className="mt-4 max-w-2xl mx-auto text-xl text-slate-600">
                Fitur yang memberdayakan gotong royong dari pelaporan hingga koordinasi lapangan.
              </p>
            </div>
            {/* PERBAIKAN: Menggunakan grid 4 kolom yang rapi */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature) => (
                <Card key={feature.title} className="bg-white border border-slate-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <CardHeader>
                    <div className="bg-amber-100 p-4 rounded-lg w-fit transition-colors">{feature.icon}</div>
                    <CardTitle className="mt-4 text-slate-900">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-600">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* --- About Section --- */}
        <section id="tentang" className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <p className="text-amber-600 font-semibold uppercase">Tentang ResQ</p>
                <h2 className="mt-2 text-3xl md:text-4xl font-extrabold text-slate-900">
                  Mengubah Potensi Menjadi Aksi Nyata
                </h2>
                <p className="mt-4 text-slate-600 text-lg">
                  ResQ lahir dari keyakinan bahwa kekuatan terbesar dalam menghadapi krisis adalah komunitas itu
                  sendiri. Kami memecahkan "Paradoks Komunikasi Modern" di mana grup chat justru menciptakan
                  kebingungan. Dengan ResQ, setiap warga diberdayakan untuk menjadi bagian dari solusi.
                </p>
                <ul className="mt-6 space-y-2">
                  <li className="flex items-center">
                    <HandHeart className="w-5 h-5 text-amber-400 mr-2" />
                    <span>
                      <span className="font-semibold">Warga</span>: Melaporkan & menawarkan bantuan.
                    </span>
                  </li>
                  <li className="flex items-center">
                    <ShieldCheck className="w-5 h-5 text-amber-400 mr-2" />
                    <span>
                      <span className="font-semibold">Relawan</span>: Merespons & berkoordinasi di lapangan.
                    </span>
                  </li>
                  <li className="flex items-center">
                    <Users className="w-5 h-5 text-amber-400 mr-2" />
                    <span>
                      <span className="font-semibold">Admin</span>: Mengelola & memverifikasi sistem.
                    </span>
                  </li>
                </ul>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <img
                  src="https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?q=80&w=1887&auto=format&fit=crop"
                  alt="Kerja sama komunitas mengangkat logistik"
                  className="rounded-lg shadow-lg w-full object-cover"
                />
                <img
                  src="https://images.unsplash.com/photo-1626252346592-748059c40333?q=80&w=2070&auto=format&fit=crop"
                  alt="Relawan membantu korban bencana"
                  className="rounded-lg shadow-lg w-full object-cover mt-8"
                />
              </div>
            </div>
          </div>
        </section>

        {/* --- Statistics Strip --- */}
        <section className="py-14">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="rounded-xl bg-slate-50 border border-slate-200 p-5 text-center">
                <p className="text-4xl font-bold text-amber-600">3</p>
                <p className="mt-1 text-slate-600">Peran Utama</p>
              </div>
              <div className="rounded-xl bg-slate-50 border border-slate-200 p-5 text-center">
                <p className="text-4xl font-bold text-amber-600">10+</p>
                <p className="mt-1 text-slate-600">Fitur Inti</p>
              </div>
              <div className="rounded-xl bg-slate-50 border border-slate-200 p-5 text-center">
                <p className="text-4xl font-bold text-amber-600">100%</p>
                <p className="mt-1 text-slate-600">Berbasis Komunitas</p>
              </div>
              <div className="rounded-xl bg-slate-50 border border-slate-200 p-5 text-center">
                <p className="text-4xl font-bold text-amber-600">24/7</p>
                <p className="mt-1 text-slate-600">Kesiapsiagaan</p>
              </div>
            </div>
          </div>
        </section>

        {/* --- Community Actions Gallery --- */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-extrabold text-slate-900">Aksi Komunitas</h2>
              <p className="mt-3 text-slate-600">
                {"Tiap tangan berarti. Inilah potret gotong royong yang terjadi setiap hari."}
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="group relative overflow-hidden rounded-lg ring-1 ring-slate-200">
                <img
                  src="https://images.unsplash.com/photo-1617953141968-c1b22d1f9b4b?q=80&w=1200&auto=format&fit=crop"
                  alt="Distribusi logistik"
                  className="w-full h-40 object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="pointer-events-none absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors"></div>
                <div className="absolute bottom-2 left-2 px-2 py-1 rounded bg-white/90 text-slate-900 text-xs border border-slate-200">
                  Distribusi logistik
                </div>
              </div>
              <div className="group relative overflow-hidden rounded-lg ring-1 ring-slate-200">
                <img
                  src="https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1200&auto=format&fit=crop"
                  alt="Koordinasi tim"
                  className="w-full h-40 object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="pointer-events-none absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors"></div>
                <div className="absolute bottom-2 left-2 px-2 py-1 rounded bg-white/90 text-slate-900 text-xs border border-slate-200">
                  Koordinasi tim
                </div>
              </div>
              <div className="group relative overflow-hidden rounded-lg ring-1 ring-slate-200">
                <img
                  src="https://images.unsplash.com/photo-1542623024-a797a755b8ee?q=80&w=1200&auto=format&fit=crop"
                  alt="Evakuasi warga"
                  className="w-full h-40 object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="pointer-events-none absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors"></div>
                <div className="absolute bottom-2 left-2 px-2 py-1 rounded bg-white/90 text-slate-900 text-xs border border-slate-200">
                  Evakuasi warga
                </div>
              </div>
              <div className="group relative overflow-hidden rounded-lg ring-1 ring-slate-200">
                <img
                  src="https://images.unsplash.com/photo-1515165562835-c3b8c8c58d12?q=80&w=1200&auto=format&fit=crop"
                  alt="Dapur umum"
                  className="w-full h-40 object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="pointer-events-none absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors"></div>
                <div className="absolute bottom-2 left-2 px-2 py-1 rounded bg-white/90 text-slate-900 text-xs border border-slate-200">
                  Dapur umum
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* --- Footer CTA Section --- */}
        <section className="py-20 text-center bg-slate-50">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900">
              {"Ambil Peran Anda dalam Membangun Komunitas Tangguh"}
            </h2>
            <p className="mt-4 text-lg text-slate-600">
              {"Setiap kontribusi berarti. Jadi pelapor, relawan, atau donatur—semua punya peran."}
            </p>
            <div className="mt-8 flex items-center justify-center gap-3">
              <Link
                href="/register"
                className="bg-amber-500 text-black px-8 py-3 rounded-md text-lg font-semibold hover:bg-amber-400"
              >
                Daftar Sekarang, Gratis!
              </Link>
              <Link
                href="#cara-kerja"
                className="inline-block border border-slate-300 text-slate-700 px-8 py-3 rounded-md text-lg font-semibold hover:bg-slate-100"
              >
                Lihat Cara Kerja
              </Link>
             
            </div>
          </div>
        </section>
      </main>

      {/* --- Footer --- */}
      <footer className="bg-white text-slate-600 border-t border-slate-200">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p>&copy; {new Date().getFullYear()} ResQ. Dibuat dengan semangat gotong royong.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
