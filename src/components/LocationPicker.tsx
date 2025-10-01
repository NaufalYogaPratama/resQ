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

// Komponen untuk menangani klik
const MapClickHandler = ({ onLocationSelect }: LocationPickerProps) => {
  const map = useMapEvents({
    click(e) {
      onLocationSelect(e.latlng.lat, e.latlng.lng);
      map.flyTo(e.latlng, map.getZoom());
    },
  });
  return null;
};

export default function LocationPicker({ onLocationSelect }: LocationPickerProps) {
  const [position, setPosition] = useState<L.LatLngExpression>([-6.9929, 110.4232]);

  const handleLocationSelect = (lat: number, lng: number) => {
    const newPos: L.LatLngExpression = [lat, lng];
    setPosition(newPos);
    onLocationSelect(lat, lng);
  };
  
  return (
    <div className="h-80 rounded-lg overflow-hidden z-0 border border-gray-300 relative">
      <MapContainer center={position} zoom={15} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <Marker position={position} />
        <SearchControl onLocationSelect={handleLocationSelect} />
        <MapClickHandler onLocationSelect={handleLocationSelect} />
      </MapContainer>
      
      <style jsx global>{`
        .leaflet-control-geosearch .bar {
          background-color: #ffffff !important; /* bg-white */
          border: 1px solid #d1d5db !important; /* border-gray-300 */
          border-radius: 8px;
        }
        .leaflet-control-geosearch .bar form input {
          background-color: transparent !important;
          color: #1f2937 !important; /* text-gray-800 */
          border: none !important;
          padding: 0 12px !important;
          height: 40px !important;
        }
        .leaflet-control-geosearch .bar form input::placeholder {
          color: #6b7280 !important; /* text-gray-500 */
        }
        .leaflet-control-geosearch a.glass {
          border-left: 1px solid #d1d5db !important; /* border-gray-300 */
          border-radius: 0 8px 8px 0;
          height: 40px !important;
        }
        .leaflet-control-geosearch a.glass:hover {
          background: #e5e7eb !important; /* bg-gray-200 */
        }
        .leaflet-control-geosearch .results {
          background-color: #ffffff;
          border: 1px solid #d1d5db;
        }
        .leaflet-control-geosearch .results > * {
          color: #1f2937;
        }
        .leaflet-control-geosearch .results > *:hover {
          background-color: #eef2ff; /* bg-indigo-100 */
          color: #1e40af; /* text-indigo-700 */
        }
      `}</style>
    </div>
  );
}