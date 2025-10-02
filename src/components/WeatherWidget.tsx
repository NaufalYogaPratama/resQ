"use client";

import { useState, useEffect } from 'react';
import { Sun, Cloud, CloudRain, Wind, Droplets, AlertTriangle, Loader2 } from 'lucide-react';

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

// Fungsi untuk menentukan style dan rekomendasi berdasarkan suhu
const getThemeByTemperature = (temp: number) => {
    if (temp > 30) {
        return {
            gradient: "from-orange-400 to-red-500",
            recommendation: "Suhu cukup panas! Pastikan Anda terhidrasi dengan baik."
        };
    }
    if (temp < 25) {
        return {
            gradient: "from-indigo-400 to-blue-500",
            recommendation: "Cuaca sejuk dan nyaman hari ini."
        };
    }
    return {
        gradient: "from-teal-400 to-cyan-500",
        recommendation: "Cuaca sedang yang menyenangkan untuk beraktivitas."
    };
};

const getWeatherIcon = (weatherCode: number) => {
    if ([1150, 1153, 1180, 1183, 1186, 1189, 1192, 1195, 1240, 1243, 1246].includes(weatherCode)) {
        return <CloudRain className="w-16 h-16 text-white/90" />;
    }
    if ([1003, 1006, 1009].includes(weatherCode)) {
        return <Cloud className="w-16 h-16 text-white/90" />;
    }
    if (weatherCode === 1000) {
        return <Sun className="w-16 h-16 text-white/90" />;
    }
    return <Cloud className="w-16 h-16 text-white/80" />;
};

export default function WeatherWidget() {
  const [weather, setWeather] = useState<WeatherApiType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const apiKey = process.env.NEXT_PUBLIC_WEATHERAPI_KEY; 
        if (!apiKey) {
            throw new Error("API Key untuk cuaca tidak ditemukan.");
        }
        const response = await fetch(`https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=Semarang&aqi=no`);
        const data = await response.json();
        
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
    return (
        <div className="p-6 rounded-2xl shadow-md bg-white border border-slate-200 flex items-center justify-center h-full min-h-[200px]">
            <Loader2 className="w-6 h-6 animate-spin text-slate-500"/>
            <span className="ml-2 text-slate-500">Memuat data cuaca...</span>
        </div>
    );
  }

  if (!weather) {
    return (
        <div className="p-6 rounded-2xl shadow-md bg-white border border-slate-200 text-center text-red-700 min-h-[200px] flex items-center justify-center">
            Gagal memuat data cuaca.
        </div>
    );
  }

  const { current, location } = weather;
  const theme = getThemeByTemperature(current.temp_c);
  const weatherIcon = getWeatherIcon(current.condition.code);

  let alert = null;
  if (current.precip_mm > 4) {
    alert = { level: 'Siaga Hujan', message: 'Hujan sangat lebat, waspada potensi banjir.', style: "bg-blue-600/70" };
  } else if (current.wind_kph > 38) {
    alert = { level: 'Waspada Angin', message: 'Angin kencang terdeteksi.', style: "bg-yellow-600/70" };
  }

  return (
    <div className={`p-6 rounded-2xl shadow-lg text-white bg-gradient-to-br ${theme.gradient} flex flex-col justify-between h-full min-h-[200px]`}>
      <div>
        <div className="flex items-start justify-between">
            <div>
                <p className="font-bold text-xl">{location.name}</p>
                <p className="text-5xl font-bold tracking-tighter">{Math.round(current.temp_c)}°C</p>
            </div>
            {weatherIcon}
        </div>
        <p className="mt-2 text-white/90 capitalize text-lg">{current.condition.text}</p>
        <p className="mt-2 text-white/80 text-sm font-medium">{theme.recommendation}</p>
      </div>

      <div className="mt-6 space-y-3">
        {alert && (
            <div className={`flex items-center gap-3 p-3 rounded-lg text-sm ${alert.style}`}>
                <AlertTriangle className="w-6 h-6 flex-shrink-0" />
                <div>
                    <span className="font-bold">{alert.level}!</span> {alert.message}
                </div>
            </div>
        )}
        <div className="flex justify-between items-center text-sm bg-black/20 p-3 rounded-lg backdrop-blur-sm">
            <div className="flex items-center gap-2">
                <Wind className="w-4 h-4" />
                <span>{current.wind_kph.toFixed(1)} km/j</span>
            </div>
            <div className="flex items-center gap-2">
                <Droplets className="w-4 h-4" />
                <span>{current.precip_mm.toFixed(1)} mm</span>
            </div>
        </div>
      </div>
    </div>
  );
}