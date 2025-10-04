"use client";

import { useEffect, useMemo, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { formatDate, getSeverityColor } from "@/lib/utils";

// Importa o plugin leaflet.heat
// @ts-ignore
import "leaflet.heat";

type ReportFeature = {
  geometry: { coordinates: [number, number] }; // [lng, lat]
  properties: {
    id: string;
    ageAtReport?: number;
    severity: "MILD" | "MODERATE" | "SEVERE" | string;
    symptoms: string[];
    city?: string;
    state?: string;
    country?: string;
    createdAt: string;
    status?: string;
  };
};

interface MapViewProps {
  reports: ReportFeature[];
  showHeatmap?: boolean;
  approvedOnly?: boolean;
}

export default function MapView({
  reports,
  showHeatmap = false,
  approvedOnly = false,
}: MapViewProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMapRef = useRef<L.Map | null>(null);
  const heatLayerRef = useRef<any>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);

  // Filtra reports no client conforme approvedOnly
  const visibleReports = useMemo(() => {
    if (!approvedOnly) return reports;
    return reports.filter((r) => r.properties?.status === "APPROVED");
  }, [reports, approvedOnly]);

  useEffect(() => {
    if (!mapRef.current) return;

    // inicializa mapa uma única vez
    const map = L.map(mapRef.current).setView([39.8283, -98.5795], 4);
    leafletMapRef.current = map;

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    return () => {
      map.remove();
      leafletMapRef.current = null;
      heatLayerRef.current = null;
      markersLayerRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = leafletMapRef.current;
    if (!map) return;

    // Remove layers anteriores
    if (markersLayerRef.current) {
      map.removeLayer(markersLayerRef.current);
    }
    if (heatLayerRef.current) {
      map.removeLayer(heatLayerRef.current);
    }

    // MARKERS LAYER
    const markersLayer = L.layerGroup();
    markersLayerRef.current = markersLayer;

    visibleReports.forEach((report) => {
      const [lng, lat] = report.geometry.coordinates;
      const colorMap: Record<string, string> = {
        MILD: "#22c55e",
        MODERATE: "#f59e0b",
        SEVERE: "#ef4444",
      };
      const color = colorMap[report.properties.severity] || "#6b7280";

      const icon = L.divIcon({
        className: "custom-div-icon",
        html: `<div style="
          background:${color};
          width:20px;height:20px;border-radius:50%;
          border:2px solid white;
          box-shadow:0 2px 4px rgba(0,0,0,0.3);
        "></div>`,
        iconSize: [20, 20],
        iconAnchor: [10, 10],
      });

      const popupHtml = `
        <div style="font-size:12px">
          <strong>${[
            report.properties.city,
            report.properties.state,
            report.properties.country,
          ]
            .filter(Boolean)
            .join(", ")}</strong><br/>
          Severity: <span style="color:${getSeverityColor(
            report.properties.severity
          )}">${report.properties.severity}</span><br/>
          Age: ${report.properties.ageAtReport ?? "-"}<br/>
          Date: ${formatDate(report.properties.createdAt)}
        </div>
      `;
      L.marker([lat, lng], { icon }).bindPopup(popupHtml).addTo(markersLayer);
    });
    markersLayer.addTo(map);

    // HEATMAP LAYER REAL usando leaflet.heat
    if (showHeatmap && visibleReports.length > 0) {
      // Prepara os dados no formato [lat, lng, intensity]
      const heatData = visibleReports.map((report) => {
        const [lng, lat] = report.geometry.coordinates;
        const severity = report.properties.severity;

        // Define intensidade baseada na severidade
        let intensity = 0.3;
        if (severity === "MODERATE") intensity = 0.6;
        if (severity === "SEVERE") intensity = 1.0;

        return [lat, lng, intensity];
      });

      // Cria o heatmap layer
      // @ts-ignore - leaflet.heat adiciona o método heatLayer ao L
      const heatLayer = L.heatLayer(heatData, {
        radius: 25, // raio de cada ponto
        blur: 15, // blur do gradiente
        maxZoom: 17, // zoom máximo onde o heatmap é visível
        max: 1.0, // valor máximo de intensidade
        gradient: {
          // Gradiente de cores personalizado
          0.0: "blue",
          0.3: "lime",
          0.5: "yellow",
          0.7: "orange",
          1.0: "red",
        },
      });

      heatLayer.addTo(map);
      heatLayerRef.current = heatLayer;
    }

    // Ajusta bounds para os reports visíveis
    if (visibleReports.length) {
      const bounds = L.latLngBounds(
        visibleReports.map((r) => [
          r.geometry.coordinates[1],
          r.geometry.coordinates[0],
        ])
      );
      map.fitBounds(bounds, { padding: [20, 20] });
    }
  }, [visibleReports, showHeatmap]);

  return (
    <div
      ref={mapRef}
      style={{ width: "100%", height: "100%", borderRadius: "0.5rem" }}
    />
  );
}
