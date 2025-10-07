"use client";

import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";


const iconProto = L.Icon.Default.prototype as unknown as {
  _getIconUrl?: () => string;
};
delete iconProto._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

interface PickerProps {
  initialPoints: [number, number][];
  onPointsChange: (points: [number, number][]) => void;
}

function MapEventsHandler({ onMapClick }: { onMapClick: (latlng: L.LatLng) => void }) {
  useMapEvents({
    click(e) {
      onMapClick(e.latlng);
    },
  });
  return null;
}

export default function ImpactedAreaPicker({ initialPoints, onPointsChange }: PickerProps) {
  const [points, setPoints] = useState<[number, number][]>(initialPoints);
  const defaultCenter: [number, number] = [-6.9929, 110.4232]; // Semarang

  useEffect(() => {
    onPointsChange(points);
  }, [points, onPointsChange]);

  const addPoint = (latlng: L.LatLng) => {
    setPoints((prevPoints) => [...prevPoints, [latlng.lng, latlng.lat]]);
  };

  const removePoint = (indexToRemove: number) => {
    setPoints((prevPoints) => prevPoints.filter((_, index) => index !== indexToRemove));
  };

  return (
    <div className="h-80 rounded-lg overflow-hidden z-0 border border-slate-300 relative">
      <MapContainer center={defaultCenter} zoom={12} style={{ height: "100%", width: "100%" }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; OpenStreetMap contributors'
        />
        <MapEventsHandler onMapClick={addPoint} />
        {points.map((point, index) => (
          <Marker
            key={index}
            position={[point[1], point[0]]} 
            eventHandlers={{
              click: () => {
                removePoint(index);
              },
            }}
          />
        ))}
      </MapContainer>

      <div className="absolute top-2 right-2 bg-white/80 p-2 rounded-md shadow-md text-xs text-slate-700 z-[1000]">
        Klik pada peta untuk menambah titik. Klik titik untuk menghapus.
      </div>
    </div>
  );
}
