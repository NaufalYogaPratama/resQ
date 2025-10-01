"use client";

import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { GeoSearchControl, OpenStreetMapProvider } from 'leaflet-geosearch';
import 'leaflet-geosearch/dist/geosearch.css';

// FIX untuk ikon default Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

interface LocationPickerProps {
  onLocationSelect: (lat: number, lng: number) => void;
}

// Komponen untuk menangani kontrol pencarian
const SearchControl = ({ onLocationSelect }: LocationPickerProps) => {
  const map = useMap();

  useEffect(() => {
    const provider = new OpenStreetMapProvider();

    const searchControl = new (GeoSearchControl as any)({
      provider: provider,
      style: 'bar',
      showMarker: false, 
      showPopup: false,
      autoClose: true,
      keepResult: true,
    });

    map.addControl(searchControl);

    const onLocationFound = (e: any) => {
      onLocationSelect(e.location.y, e.location.x);
    };
    map.on('geosearch/showlocation', onLocationFound);

    return () => {
        map.removeControl(searchControl);
        map.off('geosearch/showlocation', onLocationFound);
    };
  }, [map, onLocationSelect]);

  return null;
};

// --- KOMPONEN BARU UNTUK MENANGANI KLIK ---
const MapClickHandler = ({ onLocationSelect }: LocationPickerProps) => {
  const map = useMapEvents({
    click(e) {
      // Panggil fungsi onLocationSelect saat peta diklik
      onLocationSelect(e.latlng.lat, e.latlng.lng);
      // Pindahkan peta ke lokasi yang diklik
      map.flyTo(e.latlng, map.getZoom());
    },
  });
  return null;
};
// --- AKHIR KOMPONEN BARU ---


export default function LocationPicker({ onLocationSelect }: LocationPickerProps) {
  const [position, setPosition] = useState<L.LatLngExpression>([-6.9929, 110.4232]);

  const handleLocationSelect = (lat: number, lng: number) => {
    const newPos: L.LatLngExpression = [lat, lng];
    setPosition(newPos);
    onLocationSelect(lat, lng);
  };
  
  return (
    <div className="h-80 rounded-lg overflow-hidden z-0 border border-white/20 relative">
      <MapContainer center={position} zoom={15} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        />
        <Marker position={position} />
        <SearchControl onLocationSelect={handleLocationSelect} />
        {/* Tambahkan komponen MapClickHandler di sini */}
        <MapClickHandler onLocationSelect={handleLocationSelect} />
      </MapContainer>
      
      {/* CSS Diperbarui Total untuk Tema Gelap */}
      <style jsx global>{`
        .leaflet-control-geosearch .bar {
          background-color: #1e293b !important; /* bg-slate-800 */
          border: 1px solid rgba(255, 255, 255, 0.2) !important;
          border-radius: 8px;
        }
        .leaflet-control-geosearch .bar form input {
          background-color: transparent !important;
          color: white !important; /* PENTING: Warna teks input jadi putih */
          border: none !important;
          padding: 0 12px !important;
          height: 40px !important;
        }
        .leaflet-control-geosearch .bar form input::placeholder {
          color: #94a3b8 !important; /* text-slate-400 */
        }
        .leaflet-control-geosearch a.glass {
            border-left: 1px solid rgba(255, 255, 255, 0.2) !important;
            border-radius: 0 8px 8px 0;
            height: 40px !important;
        }
        .leaflet-control-geosearch a.glass:hover {
            background: #334155 !important; /* bg-slate-700 */
        }
        .leaflet-control-geosearch .results {
            background-color: #1e293b;
            border: 1px solid rgba(255, 255, 255, 0.2);
        }
        .leaflet-control-geosearch .results > * {
            color: #e2e8f0;
        }
        .leaflet-control-geosearch .results > *:hover {
            background-color: #fbbf24;
            color: black;
        }
      `}</style>
    </div>
  );
}

