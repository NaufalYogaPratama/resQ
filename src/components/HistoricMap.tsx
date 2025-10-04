"use client";

import { MapContainer, TileLayer, Marker, Popup, CircleMarker } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
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
            style={{ height: '100%', width: '100%' }}
            scrollWheelZoom={false}
        >
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; OpenStreetMap contributors'
            />
            {points.map((point, index) => (
                <CircleMarker
                    key={index}
                    center={[point[1], point[0]]}
                    radius={8}
                    pathOptions={{ color: 'red', fillColor: 'red', fillOpacity: 0.7 }}
                >
                     <Popup>Area Terdampak</Popup>
                </CircleMarker>
            ))}
        </MapContainer>
    );
}