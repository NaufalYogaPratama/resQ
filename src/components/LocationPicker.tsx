"use client";

import { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Circle, useMap, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { GeoSearchControl, OpenStreetMapProvider } from 'leaflet-geosearch';
import 'leaflet-geosearch/dist/geosearch.css';
import { Search } from "lucide-react";

// FIX untuk ikon default Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

// --- INTERFACE & TIPE DATA ---
interface InitialPos {
  lat: number;
  lng: number;
  accuracy?: number;
}

interface LocationPickerProps {
  onLocationSelect: (lat: number, lng: number, accuracy?: number) => void;
  initialPosition: InitialPos | null;
}

interface MapActionProps {
    onLocationSelect: (lat: number, lng: number) => void;
}

// --- KOMPONEN INTERNAL UNTUK EVENT PETA ---
function MapClickHandler({ onClick }: { onClick: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      onClick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

function SearchControl({ onLocationSelect }: MapActionProps) {
    const map = useMap();
    useEffect(() => {
        const provider = new OpenStreetMapProvider();
        const searchControl = new (GeoSearchControl as any)({
            provider, style: 'bar', showMarker: false, showPopup: false, autoClose: true, keepResult: true,
        });
        map.addControl(searchControl);
        const onResult = (e: any) => onLocationSelect(e.location.y, e.location.x);
        map.on('geosearch/showlocation', onResult);
        return () => {
            map.removeControl(searchControl);
            map.off('geosearch/showlocation', onResult);
        };
    }, [map, onLocationSelect]);
    return null;
}

// --- KOMPONEN UTAMA LocationPicker ---
export default function LocationPicker({ onLocationSelect, initialPosition }: LocationPickerProps) {
  const [markerPosition, setMarkerPosition] = useState<[number, number] | null>(
    initialPosition ? [initialPosition.lat, initialPosition.lng] : null
  );
  const [accuracy, setAccuracy] = useState<number | undefined>(initialPosition?.accuracy);
  const mapRef = useRef<L.Map | null>(null);
  const defaultCenter: [number, number] = [-6.9929, 110.4232];

  // Cek jika props initialPosition berubah dan update state internal
  useEffect(() => {
    if (initialPosition) {
      const newPos: [number, number] = [initialPosition.lat, initialPosition.lng];
      if (!markerPosition || markerPosition[0] !== newPos[0] || markerPosition[1] !== newPos[1]) {
        setMarkerPosition(newPos);
        setAccuracy(initialPosition.accuracy);
        if (mapRef.current) {
          mapRef.current.flyTo(newPos, 15);
        }
      }
    }
  }, [initialPosition, markerPosition]);

  const handleLocationUpdate = (lat: number, lng: number, acc?: number) => {
      setMarkerPosition([lat, lng]);
      setAccuracy(acc);
      onLocationSelect(lat, lng, acc);
  };
  
  const handleMarkerDragEnd = (e: L.DragEndEvent) => {
    const pos = e.target.getLatLng();
    handleLocationUpdate(pos.lat, pos.lng);
  };

  return (
    <div className="h-80 rounded-lg overflow-hidden z-0 border border-slate-300 relative">
      <MapContainer
        center={markerPosition ?? defaultCenter}
        zoom={markerPosition ? 15 : 13}
        style={{ height: "100%", width: "100%" }}
        ref={mapRef}
        zoomControl={true}
      >
        {/* DIUBAH: Kembali ke Tile Peta Terang */}
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <MapClickHandler onClick={handleLocationUpdate} />
        <SearchControl onLocationSelect={handleLocationUpdate} />
        {markerPosition && (
          <>
            <Marker
              position={markerPosition}
              draggable={true}
              eventHandlers={{ dragend: handleMarkerDragEnd }}
            />
            {typeof accuracy === "number" && accuracy > 0 && (
              <Circle center={markerPosition} radius={accuracy} />
            )}
          </>
        )}
      </MapContainer>
      
      {/* DIUBAH: CSS untuk Bar Pencarian di Tema Terang */}
      <style jsx global>{`
        .leaflet-control-geosearch .bar {
          background-color: white !important;
          border: 1px solid #d1d5db !important; /* gray-300 */
          border-radius: 8px;
          box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
        }
        .leaflet-control-geosearch .bar form input {
          background-color: transparent !important;
          color: black !important; /* Warna teks input jadi hitam */
          border: none !important;
          padding: 0 12px !important;
          height: 40px !important;
        }
        .leaflet-control-geosearch .bar form input::placeholder {
          color: #6b7280 !important; /* text-gray-500 */
        }
        .leaflet-control-geosearch a.glass {
            border-left: 1px solid #d1d5db !important;
            border-radius: 0 8px 8px 0;
            height: 40px !important;
        }
        .leaflet-control-geosearch a.glass:hover {
            background: #f3f4f6 !important; /* bg-gray-100 */
        }
        .leaflet-control-geosearch .results {
            background-color: white;
            border: 1px solid #d1d5db;
        }
        .leaflet-control-geosearch .results > * {
            color: #1f2937; /* text-gray-800 */
        }
        .leaflet-control-geosearch .results > *:hover {
            background-color: #f59e0b; /* bg-amber-500 */
            color: black;
        }
      `}</style>
    </div>
  );
}

