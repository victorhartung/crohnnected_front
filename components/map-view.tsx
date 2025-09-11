
'use client'

import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import MarkerClusterGroup from 'react-leaflet-cluster'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CalendarDays, MapPin, Activity } from 'lucide-react'
import { formatDate, getSeverityColor } from '@/lib/utils'

// Fix for default markers in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
})

// Custom marker icons for different severities
const createSeverityIcon = (severity: string) => {
  const colors = {
    MILD: '#22c55e',
    MODERATE: '#f59e0b', 
    SEVERE: '#ef4444'
  }
  
  const color = colors[severity as keyof typeof colors] || '#6b7280'
  
  return L.divIcon({
    className: 'custom-div-icon',
    html: `
      <div style="
        background-color: ${color};
        width: 20px;
        height: 20px;
        border-radius: 50%;
        border: 2px solid white;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
      "></div>
    `,
    iconSize: [20, 20],
    iconAnchor: [10, 10]
  })
}

interface MapViewProps {
  reports: Array<{
    type: 'Feature'
    geometry: {
      type: 'Point'
      coordinates: [number, number] // [lng, lat]
    }
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
  incidence: Array<{
    regionCode: string
    name: string
    lat: number
    lng: number
    cases: number
  }>
  showHeatmap?: boolean
  showIncidence?: boolean
}

// Component to fit map bounds to markers
function MapBoundsUpdater({ reports }: { reports: MapViewProps['reports'] }) {
  const map = useMap()
  useEffect(() => {
    if (reports.length > 0) {
      const bounds = L.latLngBounds(
        reports.map(report => [
          report.geometry.coordinates[1], // lat
          report.geometry.coordinates[0]  // lng
        ])
      )
      map.fitBounds(bounds, { padding: [20, 20] })
    }
  }, [map, reports])
  
  return null
}

export default function MapView({ 
  reports, 
  incidence, 
  showHeatmap = true, 
  showIncidence = false 
}: MapViewProps) {
  const [isClient, setIsClient] = useState(false)
  useEffect(() => {
    setIsClient(true)
  }, [])
  
  if (!isClient) {
    return (
      <div className="flex items-center justify-center h-full bg-muted">
        <div className="text-center">
          <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
          <p className="text-muted-foreground">Loading map...</p>
        </div>
      </div>
    )
  }

  const defaultCenter: [number, number] = [39.8283, -98.5795] // Center of USA
  const defaultZoom = 4

  return (
    <MapContainer
      center={defaultCenter}
      zoom={defaultZoom}
      style={{ height: '100%', width: '100%' }}
      className="rounded-md"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {reports.length > 0 && (
        <>
          <MapBoundsUpdater reports={reports} />
          <MarkerClusterGroup chunkedLoading>
            {reports.map((report) => (
              <Marker
                key={report.properties.id}
                position={[
                  report.geometry.coordinates[1], // lat
                  report.geometry.coordinates[0]  // lng
                ]}
                icon={createSeverityIcon(report.properties.severity)}
              >
                <Popup>
                  <Card className="border-0 shadow-none">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <Activity className="h-4 w-4" />
                        Report Details
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 pt-0">
                      {/* Location */}
                      <div className="flex items-start gap-2">
                        <MapPin className="h-3 w-3 mt-0.5 text-muted-foreground" />
                        <div className="text-xs">
                          <div className="font-medium">
                            {[
                              report.properties.city,
                              report.properties.state,
                              report.properties.country
                            ].filter(Boolean).join(', ')}
                          </div>
                        </div>
                      </div>

                      {/* Age and Severity */}
                      <div className="flex items-center gap-2">
                        {report.properties.ageAtReport && (
                          <Badge variant="outline" className="text-xs">
                            Age: {report.properties.ageAtReport}
                          </Badge>
                        )}
                        <Badge className={getSeverityColor(report.properties.severity) + ' text-xs'}>
                          {report.properties.severity}
                        </Badge>
                        {report.properties.status && (
                          <Badge 
                            variant={report.properties.status === 'APPROVED' ? 'default' : 'secondary'}
                            className="text-xs"
                          >
                            {report.properties.status}
                          </Badge>
                        )}
                      </div>

                      {/* Symptoms */}
                      {report.properties.symptoms.length > 0 && (
                        <div className="space-y-1">
                          <div className="text-xs font-medium text-muted-foreground">Symptoms:</div>
                          <div className="flex flex-wrap gap-1">
                            {report.properties.symptoms.slice(0, 3).map((symptom) => (
                              <Badge key={symptom} variant="outline" className="text-xs">
                                {symptom}
                              </Badge>
                            ))}
                            {report.properties.symptoms.length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{report.properties.symptoms.length - 3} more
                              </Badge>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Date */}
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <CalendarDays className="h-3 w-3" />
                        {formatDate(report.properties.createdAt)}
                      </div>
                    </CardContent>
                  </Card>
                </Popup>
              </Marker>
            ))}
          </MarkerClusterGroup>
        </>
      )}

      {/* Incidence Data Markers */}
      {showIncidence && incidence.map((region) => (
        <Marker
          key={region.regionCode}
          position={[region.lat, region.lng]}
          icon={L.divIcon({
            className: 'incidence-marker',
            html: `
              <div style="
                background-color: rgba(59, 130, 246, 0.8);
                color: white;
                border-radius: 50%;
                width: ${Math.min(40, Math.max(20, region.cases * 2))}px;
                height: ${Math.min(40, Math.max(20, region.cases * 2))}px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 10px;
                font-weight: bold;
                border: 2px solid white;
                box-shadow: 0 2px 4px rgba(0,0,0,0.3);
              ">
                ${region.cases}
              </div>
            `,
            iconSize: [Math.min(40, Math.max(20, region.cases * 2)), Math.min(40, Math.max(20, region.cases * 2))],
            iconAnchor: [Math.min(20, Math.max(10, region.cases)), Math.min(20, Math.max(10, region.cases))]
          })}
        >
          <Popup>
            <div className="text-center">
              <div className="font-medium">{region.name}</div>
              <div className="text-sm text-muted-foreground">
                {region.cases} cases
              </div>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}
