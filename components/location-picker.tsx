"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Loader2, MapPin } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export interface LocationData {
  lat: number;
  lng: number;
  country: string;
  state?: string;
  city?: string;
  displayName?: string;
}

interface LocationPickerProps {
  onLocationSelect: (location: LocationData | null) => void;
  initialLocation?: LocationData;
  height?: string;
}

export default function LocationPicker({
  onLocationSelect,
  initialLocation,
  height = "400px",
}: LocationPickerProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  // Obtém a localização do usuário
  useEffect(() => {
    if (initialLocation) {
      // Se já tem localização inicial, não precisa buscar a do usuário
      return;
    }

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.log("Geolocation error:", error.message);
          // Silenciosamente usa o fallback (Brasil) se houver erro
        },
        {
          enableHighAccuracy: false,
          timeout: 5000,
          maximumAge: 0,
        }
      );
    }
  }, [initialLocation]);

  // Inicializa o mapa
  useEffect(() => {
    if (!mapRef.current) return;

    // Determina a posição inicial do mapa
    let initialLat: number;
    let initialLng: number;
    let initialZoom: number;

    if (initialLocation) {
      // Usa a localização inicial fornecida
      initialLat = initialLocation.lat;
      initialLng = initialLocation.lng;
      initialZoom = 10;
    } else if (userLocation) {
      // Usa a localização do usuário
      initialLat = userLocation.lat;
      initialLng = userLocation.lng;
      initialZoom = 12;
    } else {
      // Fallback para o Brasil
      initialLat = -14.235;
      initialLng = -51.9253;
      initialZoom = 4;
    }

    // Cria o mapa centrado na posição determinada
    const map = L.map(mapRef.current).setView(
      [initialLat, initialLng],
      initialZoom
    );
    leafletMapRef.current = map;

    // Adiciona o tile layer do OpenStreetMap
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(map);

    // Se há uma localização inicial, adiciona o marcador
    if (initialLocation) {
      addMarker(initialLocation.lat, initialLocation.lng, map);
    }

    // Adiciona evento de clique no mapa
    map.on("click", async (e: L.LeafletMouseEvent) => {
      const { lat, lng } = e.latlng;
      await handleMapClick(lat, lng, map);
    });

    return () => {
      map.remove();
      leafletMapRef.current = null;
      markerRef.current = null;
    };
  }, [userLocation]);

  // Função para adicionar/atualizar marcador
  const addMarker = (lat: number, lng: number, map: L.Map) => {
    // Remove marcador anterior se existir
    if (markerRef.current) {
      map.removeLayer(markerRef.current);
    }

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

    // Adiciona novo marcador
    const marker = L.marker([lat, lng], { icon }).addTo(map);
    markerRef.current = marker;

    // Centraliza o mapa no marcador
    map.setView([lat, lng], map.getZoom());
  };

  // Função para fazer reverse geocoding usando Nominatim
  const reverseGeocode = async (
    lat: number,
    lng: number
  ): Promise<LocationData | null> => {
    try {
      setIsLoading(true);
      setError(null);

      // Chama a API do Nominatim
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
        {
          headers: {
            "Accept-Language": "en",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch location data");
      }

      const data = await response.json();

      if (!data || !data.address) {
        throw new Error("No address data found for this location");
      }

      const address = data.address;

      // Extrai país, estado e cidade
      const country =
        address.country || address.country_code?.toUpperCase() || "";

      const state =
        address.state ||
        address.province ||
        address.region ||
        address.county ||
        "";

      const city =
        address.city ||
        address.town ||
        address.village ||
        address.municipality ||
        address.hamlet ||
        "";

      // Valida que pelo menos o país foi encontrado
      if (!country) {
        throw new Error(
          "Could not determine country for this location. Please select a different location."
        );
      }

      const locationData: LocationData = {
        lat,
        lng,
        country,
        state: state || undefined,
        city: city || undefined,
        displayName: data.display_name,
      };

      return locationData;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to get location data";
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Manipula o clique no mapa
  const handleMapClick = async (lat: number, lng: number, map: L.Map) => {
    // Adiciona marcador imediatamente
    addMarker(lat, lng, map);

    // Faz reverse geocoding
    const locationData = await reverseGeocode(lat, lng);

    if (locationData) {
      onLocationSelect(locationData);
    } else {
      // Se falhou, remove o marcador
      if (markerRef.current && leafletMapRef.current) {
        leafletMapRef.current.removeLayer(markerRef.current);
        markerRef.current = null;
      }
      onLocationSelect(null);
    }
  };

  return (
    <div className="space-y-2">
      <div className="relative">
        <div
          ref={mapRef}
          style={{
            width: "100%",
            height,
            borderRadius: "0.5rem",
            border: "1px solid hsl(var(--border))",
          }}
        />
        {isLoading && (
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center rounded-lg">
            <div className="flex items-center gap-2 text-sm">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Getting location data...</span>
            </div>
          </div>
        )}
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="flex items-start gap-2 text-sm text-muted-foreground">
        <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
        <p>
          Click anywhere on the map to select your location. The system will
          automatically detect the country, state, and city.
        </p>
      </div>
    </div>
  );
}
