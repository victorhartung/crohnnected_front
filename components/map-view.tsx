'use client'

import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { formatDate, getSeverityColor } from '@/lib/utils'

interface MapViewProps {
  reports: Array<{
    geometry: { coordinates: [number, number] } // [lng, lat]
    properties: {
      id: string
      ageAtReport?: number
      severity: string
      symptoms: string[]
      city?: string
      state?: string
      country?: string
      createdAt: string
      status?: string
    }
  }>
}

export default function MapView({ reports }: MapViewProps) {
  const mapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!mapRef.current) return

    const map = L.map(mapRef.current).setView([39.8283, -98.5795], 4)

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map)


    reports.forEach((report) => {
      const [lng, lat] = report.geometry.coordinates
      const colorMap: Record<string, string> = {
        MILD: '#22c55e',
        MODERATE: '#f59e0b',
        SEVERE: '#ef4444',
      }
      const color = colorMap[report.properties.severity] || '#6b7280'

      const icon = L.divIcon({
        className: 'custom-div-icon',
        html: `<div style="
          background:${color};
          width:20px;height:20px;border-radius:50%;
          border:2px solid white;
          box-shadow:0 2px 4px rgba(0,0,0,0.3);
        "></div>`,
        iconSize: [20, 20],
        iconAnchor: [10, 10],
      })

      const popupHtml = `
        <div style="font-size:12px">
          <strong>${[report.properties.city, report.properties.state, report.properties.country]
            .filter(Boolean)
            .join(', ')}</strong><br/>
          Severity: <span style="color:${getSeverityColor(
            report.properties.severity
          )}">${report.properties.severity}</span><br/>
          Age: ${report.properties.ageAtReport ?? '-'}<br/>
          Date: ${formatDate(report.properties.createdAt)}
        </div>
      `

      L.marker([lat, lng], { icon }).addTo(map).bindPopup(popupHtml)
    })


    if (reports.length) {
      const bounds = L.latLngBounds(
        reports.map((r) => [r.geometry.coordinates[1], r.geometry.coordinates[0]])
      )
      map.fitBounds(bounds, { padding: [20, 20] })
    }

    return () => {
      map.remove()
    }
  }, [reports])

  return (
    <div
      ref={mapRef}
      style={{ width: '100%', height: '100%', borderRadius: '0.5rem' }}
    />
  )
}
