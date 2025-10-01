"use client";

import { useState, useEffect } from 'react';
import { Sun, Cloud, CloudRain, Wind } from 'lucide-react';

interface WeatherApiType {
  current: {
    temp_c: number;
    condition: {
      text: string;
      code: number;
    };
    wind_kph: number;
    precip_mm: number;
  };
  location: {
    name: string;
  }
}

const getWeatherIcon = (weatherCode: number) => {
  if (weatherCode >= 1150 && weatherCode <= 1282) return <CloudRain className="w-12 h-12 text-blue-500" />;
  if (weatherCode >= 1003 && weatherCode <= 1030) return <Cloud className="w-12 h-12 text-gray-500" />;
  if (weatherCode === 1000) return <Sun className="w-12 h-12 text-yellow-500" />;
  return <Cloud className="w-12 h-12 text-gray-400" />;
};

export default function WeatherWidget() {
  const [weather, setWeather] = useState<WeatherApiType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const res = await fetch('/api/weather');
        const data = await res.json();
        if (data.error) throw new Error(data.error.message);
        setWeather(data);
      } catch (error) {
        console.error("Gagal memuat data cuaca:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchWeather();
  }, []);

  if (loading) {
    return <div className="bg-white p-4 rounded-lg shadow-md text-center text-gray-700">Memuat data cuaca...</div>; // Tambah text-gray-700
  }

  if (!weather) {
    return <div className="bg-white p-4 rounded-lg shadow-md text-center text-red-600">Gagal memuat data cuaca.</div>; // Tambah text-red-600
  }

  const { current, location } = weather;
  const weatherIcon = getWeatherIcon(current.condition.code);

  let alert = null;
  if (current.wind_kph > 38) {
    alert = { level: 'Waspada', message: 'Angin kencang terdeteksi.' };
  }
  if (current.precip_mm > 4) {
    alert = { level: 'Siaga', message: 'Hujan sangat lebat, waspada potensi banjir.' };
  }

  return (
    <div className={`p-6 rounded-lg shadow-md ${alert ? (alert.level === 'Siaga' ? 'bg-red-100 border-red-500' : 'bg-yellow-100 border-yellow-500') : 'bg-white border-transparent'} border`}>
      <h3 className="font-bold text-lg mb-4 text-gray-800">Cuaca Saat Ini - {location.name}</h3>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-4xl font-bold text-gray-900">{Math.round(current.temp_c)}°C</p>
          <p className="capitalize text-gray-700">{current.condition.text}</p>
          <p className="text-sm text-gray-600 mt-2 flex items-center"><Wind className="w-4 h-4 mr-1 text-gray-600"/> {current.wind_kph.toFixed(1)} km/jam</p>
        </div>
        <div>
          {weatherIcon}
        </div>
      </div>
      {alert && (
        <div className={`mt-4 p-3 rounded-md text-sm ${alert.level === 'Siaga' ? 'bg-red-200 text-red-800' : 'bg-yellow-200 text-yellow-800'}`}>
          <span className="font-bold">{alert.level}!</span> {alert.message}
        </div>
      )}
    </div>
  );
}