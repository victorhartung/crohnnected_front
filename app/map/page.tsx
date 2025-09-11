
'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import dynamic from 'next/dynamic'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Loader2, 
  AlertCircle, 
  MapPin,
  Filter,
  Download,
  Layers,
  Info,
  BarChart3
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { MultiSelect } from '@/components/multi-select'
import { COMMON_SYMPTOMS } from '@/lib/constants'
import { toast } from 'sonner'

// Dynamically import the map component to avoid SSR issues
const MapView = dynamic(() => import('@/components/map-view'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-96 bg-muted rounded-md">
      <div className="flex items-center space-x-2">
        <Loader2 className="h-6 w-6 animate-spin" />
        <span>Loading map...</span>
      </div>
    </div>
  )
})

interface MapFilters {
  countries: string[]
  severity: string[]
  symptoms: string[]
  ageRange: [number, number]
  approvedOnly: boolean
  showHeatmap: boolean
  showIncidence: boolean
}

interface MapData {
  reports: any[]
  incidence: any[]
  summary: {
    totalReports: number
    approvedReports: number
    countries: number
    avgAge: number
  }
}

export default function MapPage() {
  const { data: session, status } = useSession()
  console.log("SESSION: ", session);
  console.log("STATUS: ", status);
  const [isLoading, setIsLoading] = useState(true)
  const [mapData, setMapData] = useState<MapData | null>(null)
  const [availableCountries, setAvailableCountries] = useState<string[]>([])
  const [filters, setFilters] = useState<MapFilters>({
    countries: [],
    severity: [],
    symptoms: [],
    ageRange: [1, 100],
    approvedOnly: false,
    showHeatmap: true,
    showIncidence: false
  })

  const canExport = session?.user?.role === 'RESEARCHER' || session?.user?.role === 'ADMIN' || session?.user?.role === 'MODERATOR'

  useEffect(() => {
    loadMapData()
  }, [filters])

  const loadMapData = async () => {
    setIsLoading(true)

    try {
      // Build query parameters
      const params = new URLSearchParams()
      
      if (filters.countries.length > 0) {
        params.append('countries', filters.countries.join(','))
      }
      if (filters.severity.length > 0) {
        params.append('severity', filters.severity.join(','))
      }
      if (filters.symptoms.length > 0) {
        params.append('symptoms', filters.symptoms.join(','))
      }
      if (filters.approvedOnly) {
        params.append('approvedOnly', 'true')
      }
      params.append('minAge', filters.ageRange[0].toString())
      params.append('maxAge', filters.ageRange[1].toString())

      const [reportsRes, incidenceRes] = await Promise.all([
        fetch(`/api/map/reports?${params.toString()}`),
        fetch(`/api/map/incidence?${params.toString()}`)
      ])

      if (!reportsRes.ok || !incidenceRes.ok) {
        throw new Error('Failed to fetch map data')
      }

      const [reportsData, incidenceData] = await Promise.all([
        reportsRes.json(),
        incidenceRes.json()
      ])

      const data: MapData = {
        reports: reportsData.data.features || [],
        incidence: incidenceData.data.regions || [],
        summary: {
          totalReports: reportsData.data.features?.length || 0,
          approvedReports: reportsData.data.features?.filter((f: any) => f.properties.status === 'APPROVED').length || 0,
          countries: new Set(reportsData.data.features?.map((f: any) => f.properties.country)).size || 0,
          avgAge: reportsData.data.features?.length > 0 ? 
            Math.round(reportsData.data.features.reduce((sum: number, f: any) => sum + (f.properties.ageAtReport || 0), 0) / reportsData.data.features.length) : 0
        }
      }

      setMapData(data)

      // Extract available countries for filter
      const countries = Array.from(new Set(reportsData.data.features?.map((f: any) => f.properties.country).filter(Boolean))).sort() as string[]
      setAvailableCountries(countries)

    } catch (error) {
      console.error('Failed to load map data:', error)
      toast.error('Failed to load map data')
    } finally {
      setIsLoading(false)
    }
  }

  const handleExportData = async () => {
    if (!canExport) {
      toast.error('You do not have permission to export data')
      return
    }

    try {
      const params = new URLSearchParams()
      
      if (filters.countries.length > 0) {
        params.append('countries', filters.countries.join(','))
      }
      if (filters.severity.length > 0) {
        params.append('severity', filters.severity.join(','))
      }
      if (filters.symptoms.length > 0) {
        params.append('symptoms', filters.symptoms.join(','))
      }
      if (filters.approvedOnly) {
        params.append('approvedOnly', 'true')
      }
      params.append('minAge', filters.ageRange[0].toString())
      params.append('maxAge', filters.ageRange[1].toString())
      params.append('format', 'csv')

      const response = await fetch(`/api/reports/export?${params.toString()}`)
      
      if (!response.ok) {
        throw new Error('Export failed')
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.style.display = 'none'
      a.href = url
      a.download = `crohnnected-map-data-${new Date().toISOString().split('T')[0]}.csv`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      
      toast.success('Data exported successfully')
    } catch (error) {
      console.error('Export error:', error)
      toast.error('Failed to export data')
    }
  }

  const updateFilters = (key: keyof MapFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const symptomOptions = COMMON_SYMPTOMS.map(symptom => ({
    label: symptom,
    value: symptom
  }))

  if (status === 'loading' || isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Loading map data...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Geographic Map</h1>
          <p className="text-muted-foreground">
            Explore geographic distribution of Crohn's disease reports and incidence data.
          </p>
        </div>

        {/* Summary Cards */}
        {mapData && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Total Reports</p>
                    <p className="text-2xl font-bold">{mapData.summary.totalReports}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2">
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Approved</p>
                    <p className="text-2xl font-bold">{mapData.summary.approvedReports}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Countries</p>
                    <p className="text-2xl font-bold">{mapData.summary.countries}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2">
                  <Info className="h-4 w-4 text-muted-foreground" />
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Avg Age</p>
                    <p className="text-2xl font-bold">{mapData.summary.avgAge}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filters Panel */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Filters
              </CardTitle>
              <CardDescription>
                Filter map data by various criteria
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Countries Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Countries</label>
                <MultiSelect
                  options={availableCountries.map(country => ({ label: country, value: country }))}
                  value={filters.countries}
                  onChange={(countries) => updateFilters('countries', countries)}
                  placeholder="All countries..."
                />
              </div>

              {/* Severity Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Severity</label>
                <MultiSelect
                  options={[
                    { label: 'Mild', value: 'MILD' },
                    { label: 'Moderate', value: 'MODERATE' },
                    { label: 'Severe', value: 'SEVERE' }
                  ]}
                  value={filters.severity}
                  onChange={(severity) => updateFilters('severity', severity)}
                  placeholder="All severities..."
                />
              </div>

              {/* Symptoms Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Symptoms</label>
                <MultiSelect
                  options={symptomOptions}
                  value={filters.symptoms}
                  onChange={(symptoms) => updateFilters('symptoms', symptoms)}
                  placeholder="All symptoms..."
                  maxItems={5}
                />
              </div>

              <Separator />

              {/* Checkboxes */}
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="approvedOnly"
                    checked={filters.approvedOnly}
                    onCheckedChange={(checked) => updateFilters('approvedOnly', checked)}
                  />
                  <label
                    htmlFor="approvedOnly"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Approved reports only
                  </label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="showHeatmap"
                    checked={filters.showHeatmap}
                    onCheckedChange={(checked) => updateFilters('showHeatmap', checked)}
                  />
                  <label
                    htmlFor="showHeatmap"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Show heatmap
                  </label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="showIncidence"
                    checked={filters.showIncidence}
                    onCheckedChange={(checked) => updateFilters('showIncidence', checked)}
                  />
                  <label
                    htmlFor="showIncidence"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Show incidence data
                  </label>
                </div>
              </div>

              <Separator />

              {/* Export Button */}
              {canExport && (
                <Button onClick={handleExportData} className="w-full">
                  <Download className="mr-2 h-4 w-4" />
                  Export Data
                </Button>
              )}

              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => setFilters({
                  countries: [],
                  severity: [],
                  symptoms: [],
                  ageRange: [0, 100],
                  approvedOnly: false,
                  showHeatmap: true,
                  showIncidence: false
                })}
              >
                Clear Filters
              </Button>
            </CardContent>
          </Card>

          {/* Map */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Layers className="h-5 w-5" />
                  Interactive Map
                </CardTitle>
                <CardDescription>
                  Geographic visualization of Crohn's disease data
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[600px] rounded-md overflow-hidden">
                  {mapData ? (
                    <MapView 
                      reports={mapData.reports}
                      incidence={mapData.incidence}
                      showHeatmap={filters.showHeatmap}
                      showIncidence={filters.showIncidence}
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full bg-muted">
                      <div className="text-center">
                        <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                        <p className="text-muted-foreground">No map data available</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
