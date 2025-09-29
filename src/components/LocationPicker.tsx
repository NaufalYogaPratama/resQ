"use client";

import { useState, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// FIX untuk ikon default Leaflet agar tidak rusak
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

// Tipe data untuk props komponen utama
interface LocationPickerProps {
  onLocationSelect: (lat: number, lng: number) => void;
}

// --- PERBAIKAN DI SINI ---
// Beri tipe data untuk props komponen internal 'LocationFinder'
function LocationFinder({ onLocationSelect }: { onLocationSelect: (lat: number, lng: number) => void }) {
  const map = useMapEvents({
    click(e) {
      onLocationSelect(e.latlng.lat, e.latlng.lng);
      map.flyTo(e.latlng, map.getZoom());
    },
  });
  return null;
}
// --- AKHIR PERBAIKAN ---

export default function LocationPicker({ onLocationSelect }: LocationPickerProps) {
  const [position, setPosition] = useState<L.LatLngExpression>([-6.9929, 110.4232]); 

  const handleLocationSelect = (lat: number, lng: number) => {
    setPosition([lat, lng]);
    onLocationSelect(lat, lng);
  };
  
  const displayMap = useMemo(
    () => (
        <MapContainer center={position} zoom={15} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
            <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <Marker position={position} />
            <LocationFinder onLocationSelect={handleLocationSelect} />
        </MapContainer>
    ), [position]
  );

  return (
    <div className="h-64 rounded-lg overflow-hidden z-0 border">
      {displayMap}
    </div>
  );
}