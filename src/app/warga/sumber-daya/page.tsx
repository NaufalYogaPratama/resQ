"use client";

import { useState, useEffect } from "react";
import { Package, Wrench, Trash2 } from "lucide-react";

interface ResourceType {
  _id: string;
  namaSumberDaya: string;
  tipe: "Aset" | "Keahlian";
  deskripsi?: string;
}

export default function SumberDayaPage() {
  const [myResources, setMyResources] = useState<ResourceType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [namaSumberDaya, setNamaSumberDaya] = useState("");
  const [tipe, setTipe] = useState("Aset");
  const [deskripsi, setDeskripsi] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchMyResources = async () => {
    try {
      const res = await fetch("/api/resources");
      const data = await res.json();
      if (data.success) {
        setMyResources(data.data);
      }
    } catch (error) {
      console.error("Gagal mengambil data sumber daya:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMyResources();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/resources", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ namaSumberDaya, tipe, deskripsi }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Gagal menambahkan sumber daya.");
      }

      fetchMyResources();
      setNamaSumberDaya("");
      setTipe("Aset");
      setDeskripsi("");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus sumber daya ini?")) {
      try {
        const res = await fetch(`/api/resources/${id}`, { method: "DELETE" });
        if (!res.ok) {
          throw new Error("Gagal menghapus sumber daya.");
        }
        fetchMyResources();
      } catch (err: any) {
        setError(err.message);
      }
    }
  };

  return (
    <div className="bg-gradient-to-br from-indigo-50 via-white to-purple-50 min-h-screen text-slate-800 p-4 sm:p-8 font-sans">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div data-aos="fade-down" className="mb-10 text-center">
          <h1 className="text-4xl font-extrabold text-slate-900">
            Bank Sumber Daya Komunitas
          </h1>
          <p className="mt-2 text-lg text-slate-600">
            Daftarkan aset atau keahlian yang dapat Anda kontribusikan saat
            darurat.
          </p>
        </div>

        {/* Form Input */}
        <form
          onSubmit={handleSubmit}
          className="bg-white border border-slate-200 rounded-2xl shadow-md hover:shadow-lg transition-shadow p-6"
          data-aos="fade-up"
        >
          <h2 className="text-2xl font-bold mb-6 text-slate-900">
            Daftarkan Sumber Daya Baru
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="nama-sumber"
                className="block text-sm font-medium text-slate-600 mb-2"
              >
                Nama Aset/Keahlian
              </label>
              <input
                id="nama-sumber"
                type="text"
                value={namaSumberDaya}
                onChange={(e) => setNamaSumberDaya(e.target.value)}
                required
                className="w-full p-3 bg-white border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label
                htmlFor="tipe-sumber"
                className="block text-sm font-medium text-slate-600 mb-2"
              >
                Tipe
              </label>
              <select
                id="tipe-sumber"
                value={tipe}
                onChange={(e) => setTipe(e.target.value)}
                className="w-full p-3 bg-white border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="Aset">Aset</option>
                <option value="Keahlian">Keahlian</option>
              </select>
            </div>
          </div>
          <div className="mt-6">
            <label
              htmlFor="deskripsi-sumber"
              className="block text-sm font-medium text-slate-600 mb-2"
            >
              Deskripsi Singkat (Opsional)
            </label>
            <textarea
              id="deskripsi-sumber"
              value={deskripsi}
              onChange={(e) => setDeskripsi(e.target.value)}
              rows={3}
              className="w-full p-3 bg-white border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            ></textarea>
          </div>
          {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-6 w-full md:w-auto bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-500 disabled:bg-slate-400 transition-colors"
          >
            {isSubmitting ? "Menambahkan..." : "Tambahkan Sumber Daya"}
          </button>
        </form>

        {/* Daftar Resource */}
        <div
          className="mt-12"
          data-aos="fade-up"
          data-aos-delay="200"
        >
          <h2 className="text-2xl font-bold mb-6 text-slate-900">
            Sumber Daya Milik Anda
          </h2>
          {isLoading ? (
            <p className="text-slate-500">Memuat data...</p>
          ) : (
            <ul className="space-y-4">
              {myResources.length > 0 ? (
                myResources.map((res: ResourceType) => (
                  <li
                    key={res._id}
                    className="bg-white border border-slate-200 rounded-xl p-4 flex justify-between items-center shadow hover:shadow-md transition"
                  >
                    <div className="flex items-center">
                      {res.tipe === "Aset" ? (
                        <Package className="w-8 h-8 mr-4 text-indigo-600" />
                      ) : (
                        <Wrench className="w-8 h-8 mr-4 text-indigo-600" />
                      )}
                      <div>
                        <p className="font-bold text-lg text-slate-900">
                          {res.namaSumberDaya}
                        </p>
                        <p className="text-sm text-slate-500">{res.tipe}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDelete(res._id)}
                      className="text-red-500 hover:text-red-400 p-2 rounded-full hover:bg-red-100 transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </li>
                ))
              ) : (
                <div className="text-center py-10 border-2 border-dashed border-slate-300 rounded-xl bg-slate-50">
                  <p className="text-slate-500">
                    Anda belum mendaftarkan sumber daya apapun.
                  </p>
                </div>
              )}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
