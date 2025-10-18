"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface SingleLocationMapProps {
  lat: number;
  lng: number;
  city?: string;
  state?: string;
  country: string;
  height?: string;
}

export default function SingleLocationMap({
  lat,
  lng,
  city,
  state,
  country,
  height = "300px",
}: SingleLocationMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    // Cria o mapa centrado na localização do report
    const map = L.map(mapRef.current).setView([lat, lng], 10);
    leafletMapRef.current = map;

    // Adiciona o tile layer do OpenStreetMap
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(map);

    // Cria ícone customizado
    const icon = L.divIcon({
      className: "custom-location-marker",
      html: `<div style="
        background: #3b82f6;
        width: 30px;
        height: 30px;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        border: 3px solid white;
        box-shadow: 0 3px 6px rgba(0,0,0,0.4);
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <div style="
          width: 10px;
          height: 10px;
          background: white;
          border-radius: 50%;
          transform: rotate(45deg);
        "></div>
      </div>`,
      iconSize: [30, 30],
      iconAnchor: [15, 30],
    });

    // Adiciona marcador
    const locationName = [city, state, country].filter(Boolean).join(", ");
    L.marker([lat, lng], { icon })
      .bindPopup(`<strong>${locationName}</strong>`)
      .addTo(map);

    return () => {
      map.remove();
      leafletMapRef.current = null;
    };
  }, [lat, lng, city, state, country]);

  return (
    <div
      ref={mapRef}
      style={{
        width: "100%",
        height,
        borderRadius: "0.5rem",
        border: "1px solid hsl(var(--border))",
        zIndex: 0,
      }}
    />
  );
}
