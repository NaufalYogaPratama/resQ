
"use client";

import { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents, Circle, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";


delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

interface InitialPos {
  lat: number;
  lng: number;
  accuracy?: number;
}

interface LocationPickerProps {
  onLocationSelect: (lat: number, lng: number, accuracy?: number) => void;
  initialPosition: InitialPos | null;
}

function MapClickHandler({ onClick }: { onClick: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      onClick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

function SetMapRef({ mapRef }: { mapRef: React.MutableRefObject<L.Map | null> }) {
  const map = useMap();
  useEffect(() => {
    mapRef.current = map;
    return () => {
      mapRef.current = null;
    };
  }, [map, mapRef]);
  return null;
}

export default function LocationPicker({ onLocationSelect, initialPosition }: LocationPickerProps) {
  const [markerPosition, setMarkerPosition] = useState<[number, number] | null>(
    initialPosition ? [initialPosition.lat, initialPosition.lng] : null
  );
  const [accuracy, setAccuracy] = useState<number | undefined>(initialPosition?.accuracy);

  const mapRef = useRef<L.Map | null>(null);
  const defaultCenter: [number, number] = [-6.9929, 110.4232];


  useEffect(() => {
    if (initialPosition) {
      const newPos: [number, number] = [initialPosition.lat, initialPosition.lng];
      setMarkerPosition((prev) => {
        if (!prev || prev[0] !== newPos[0] || prev[1] !== newPos[1]) {
          return newPos;
        }
        return prev;
      });
      setAccuracy(initialPosition.accuracy);

      // Jika map sudah ready, centering
      if (mapRef.current) {
        mapRef.current.flyTo(newPos, 15, { duration: 0.6 });
      }
    }
  }, [initialPosition]);

  const handleMapClick = (lat: number, lng: number) => {
    setMarkerPosition([lat, lng]);
    setAccuracy(undefined);
    onLocationSelect(lat, lng);
    if (mapRef.current) mapRef.current.flyTo([lat, lng], 15);
  };

  const handleMarkerDragEnd = (e: L.DragEndEvent) => {
    const marker = e.target;
    const pos = marker.getLatLng();
    setMarkerPosition([pos.lat, pos.lng]);
    setAccuracy(undefined);
    onLocationSelect(pos.lat, pos.lng);
  };

  const handleRecenterClick = () => {
    if (markerPosition && mapRef.current) {
      mapRef.current.flyTo(markerPosition, 15);
    } else if (mapRef.current) {
      mapRef.current.flyTo(defaultCenter, 13);
    }
  };

  return (
    <div className="h-64 rounded-lg overflow-hidden z-0 border relative">
      <MapContainer
        center={markerPosition ?? defaultCenter}
        zoom={markerPosition ? 15 : 13}
        style={{ height: "100%", width: "100%" }}
        scrollWheelZoom={true}
        zoomControl={true}
        touchZoom={true}
      >

        <SetMapRef mapRef={mapRef} />

        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        <MapClickHandler onClick={handleMapClick} />

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

      <button
        type="button"
        onClick={handleRecenterClick}
        className="absolute right-2 bottom-2 bg-white p-2 rounded shadow text-sm"
        title="Pusatkan ke marker"
      >
        Pusatkan
      </button>
    </div>
  );
}