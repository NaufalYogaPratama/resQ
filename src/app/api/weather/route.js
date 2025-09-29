import { NextResponse } from "next/server";

export async function GET() {
  const API_KEY = process.env.WEATHERAPI_KEY; 

  const location = "Semarang"; 
  const url = `https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${location}&aqi=no&lang=id`;

  try {
    const response = await fetch(url, {
        next: { revalidate: 1800 } 
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error.message || "Gagal mengambil data cuaca.");
    }

    const data = await response.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error("Weather API Error:", error); 
    return NextResponse.json(
      { message: "Terjadi kesalahan pada server.", error: error.message },
      { status: 500 }
    );
  }
}