import { verifyAuth } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import dbConnect from "@/lib/dbConnect";
import Resource from "@/models/Resource";
import User from "@/models/User";
import Link from "next/link";
import { ArrowLeft, Package, Wrench } from "lucide-react";
import EditResourceModal from "@/components/EditResourceModal"; // Kita gunakan kembali modal yang sudah ada

// Fungsi ini berjalan di server untuk mengambil data
async function getResourceForAdmin(id: string) {
    await dbConnect();
    try {
        // Admin bisa lihat resource siapa saja, jadi tidak perlu cek 'pemilik'
        const resource = await Resource.findById(id).populate('pemilik', 'namaLengkap');
        if (!resource) notFound();
        return JSON.parse(JSON.stringify(resource));
    } catch (error) {
        notFound();
    }
}

export default async function ResourceDetailPageAdmin({ params }: { params: { id: string } }) {
    const user = await verifyAuth();
    if (!user || user.peran !== 'Admin') redirect("/login");

    const resource = await getResourceForAdmin(params.id);

    return (
        <div className="bg-slate-50 min-h-screen p-4 sm:p-8 font-sans">
            <div className="max-w-4xl mx-auto">
                <div className="mb-6">
                    <Link href="/admin/sumber-daya" className="inline-flex items-center gap-2 text-slate-600 hover:text-indigo-600 font-semibold">
                        <ArrowLeft className="w-4 h-4" />
                        Kembali ke Manajemen Sumber Daya
                    </Link>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl shadow-lg overflow-hidden">
                    {resource.gambarUrl ? (
                        <img src={resource.gambarUrl} alt={resource.namaSumberDaya} className="w-full h-80 object-cover" />
                    ) : (
                        <div className="w-full h-80 bg-indigo-50 flex items-center justify-center">
                            {resource.tipe === "Aset" ? <Package className="w-24 h-24 text-indigo-200"/> : <Wrench className="w-24 h-24 text-indigo-200"/>}
                        </div>
                    )}
                    <div className="p-8">
                        <div className="flex justify-between items-start">
                            <div>
                                <span className="inline-block bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm font-semibold">{resource.tipe}</span>
                                <h1 className="text-4xl font-extrabold text-slate-900 mt-4">{resource.namaSumberDaya}</h1>
                                <p className="mt-2 text-sm text-slate-500">Pemilik: <strong>{resource.pemilik.namaLengkap}</strong></p>
                                {resource.deskripsi && <p className="mt-4 text-lg text-slate-600">{resource.deskripsi}</p>}
                            </div>
        
                            <EditResourceModal resource={resource} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}