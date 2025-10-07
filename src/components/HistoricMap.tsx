"use client";

import { MapContainer, TileLayer, Popup, CircleMarker } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Gunakan type assertion yang lebih spesifik
const iconProto = L.Icon.Default.prototype as unknown as {
  _getIconUrl?: () => string;
};

// Hapus method private dengan aman
delete iconProto._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

interface HistoricMapProps {
  center: [number, number];
  points: [number, number][];
}

export default function HistoricMap({ center, points }: HistoricMapProps) {
  return (
    <MapContainer
      center={center}
      zoom={12}
      style={{ height: "100%", width: "100%" }}
      scrollWheelZoom={false}
      className="rounded-lg"
    >
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="https://carto.com/attributions">CARTO</a>'
      />
      {points.map((point, index) => (
        <CircleMarker
          key={index}
          center={[point[1], point[0]]}
          radius={8}
          pathOptions={{
            color: "#4f46e5",
            fillColor: "#6366f1",
            fillOpacity: 0.7,
            weight: 2,
          }}
        >
          <Popup>Area Terdampak</Popup>
        </CircleMarker>
      ))}
    </MapContainer>
  );
}
