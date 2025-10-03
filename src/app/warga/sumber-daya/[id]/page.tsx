import { verifyAuth } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import dbConnect from "@/lib/dbConnect";
import Resource from "@/models/Resource";
import { Package, Wrench, ArrowLeft } from "lucide-react";
import Link from "next/link";
import EditResourceModal from "@/components/EditResourceModal";


async function getResource(id: string, userId: string) {
    await dbConnect();
    try {
        const resource = await Resource.findById(id);
        if (!resource || resource.pemilik.toString() !== userId) {
            notFound(); 
        }
        return JSON.parse(JSON.stringify(resource));
    } catch (error) {
        notFound(); 
    }
}

export default async function ResourceDetailPage({ params }: { params: { id: string } }) {
    const user = await verifyAuth();
    if (!user) redirect("/login");

    const resource = await getResource(params.id, user.id);

    return (
        <div className="bg-gradient-to-br from-slate-50 via-white to-indigo-50 min-h-screen p-4 sm:p-8 font-sans">
            <div className="max-w-4xl mx-auto">
                <div className="mb-6" data-aos="fade-down">
                    <Link href="/warga/sumber-daya" className="inline-flex items-center gap-2 text-slate-600 hover:text-indigo-600 font-semibold">
                        <ArrowLeft className="w-4 h-4" />
                        Kembali ke Bank Sumber Daya
                    </Link>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl shadow-lg overflow-hidden" data-aos="fade-up">
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
                                {resource.deskripsi && <p className="mt-4 text-lg text-slate-600">{resource.deskripsi}</p>}
                            </div>
                            {/* Tombol Edit memanggil Client Component Modal */}
                            <EditResourceModal resource={resource} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}