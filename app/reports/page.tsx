
'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Loader2, 
  AlertCircle, 
  Plus, 
  FileText, 
  Calendar, 
  MapPin,
  Search,
  Filter,
  Download
} from 'lucide-react'
import { formatDate, getStatusColor, getSeverityColor } from '@/lib/utils'
import { useReportsStore } from '@/store/reports-store'
import { toast } from 'sonner'

interface Report {
  id: string
  ageAtReport?: number
  sex?: string
  country: string
  state?: string
  city?: string
  symptoms: string[]
  symptomSeverity: string
  medications?: string[]
  status: string
  createdAt: string
  approvedAt?: string
  approvedBy?: {
    name?: string
    email: string
  }
  rejectionReason?: string
  hasDocument: boolean
  documentOriginalName?: string
  documentSizeBytes?: number
  notes?: string
}

export default function ReportsPage() {
  const { data: session, status } = useSession()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [reports, setReports] = useState<Report[]>([])
  const [filteredReports, setFilteredReports] = useState<Report[]>([])
  const [activeTab, setActiveTab] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCountry, setSelectedCountry] = useState('all')
  const [selectedSeverity, setSelectedSeverity] = useState('all')

  const isPatient = session?.user?.role === 'PATIENT'
  const isDoctor = session?.user?.role === 'DOCTOR'
  const canApprove = isDoctor || session?.user?.role === 'MODERATOR' || session?.user?.role === 'ADMIN'
  
  useEffect(() => {
    if (session?.user) {
      loadReports()
    }
  }, [session])

  useEffect(() => {
    filterReports()
  }, [reports, activeTab, searchQuery, selectedCountry, selectedSeverity])

  const loadReports = async () => {
    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('/api/reports')
      if (!response.ok) {
        const errorData = await response.json()
        setError(errorData.message || 'Failed to load reports')
        return
      }

      const data = await response.json()
      setReports(data.data.reports)

    } catch (error) {
      setError('An unexpected error occurred')
      console.error('Failed to load reports:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const filterReports = () => {
    let filtered = [...reports]
    console.log("FILTERED", filtered);
    // Filter by status tab
    if (activeTab !== 'all') {
      filtered = filtered.filter(report => report.status.toLowerCase() === activeTab)
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(report => 
        report.country.toLowerCase().includes(query) ||
        report.city?.toLowerCase().includes(query) ||
        report.symptoms.some(symptom => symptom.toLowerCase().includes(query)) ||
        report.medications?.some(med => med.toLowerCase().includes(query))
      )
    }

    // Filter by country
    if (selectedCountry && selectedCountry !== 'all') {
      filtered = filtered.filter(report => report.country === selectedCountry)
    }

    // Filter by severity
    if (selectedSeverity && selectedSeverity !== 'all') {
      filtered = filtered.filter(report => report.symptomSeverity === selectedSeverity)
    }

    setFilteredReports(filtered)
  }

  const handleApproveReport = async (reportId: string) => {
    try {
      const response = await fetch(`/api/reports/${reportId}/approve`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ notes: 'Approved by doctor' }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        toast.error(errorData.message || 'Failed to approve report')
        return
      }

      toast.success('Report approved successfully')
      loadReports()
    } catch (error) {
      toast.error('Failed to approve report')
      console.error('Approve report error:', error)
    }
  }

  const handleRejectReport = async (reportId: string, reason: string) => {
    try {
      const response = await fetch(`/api/reports/${reportId}/reject`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reason }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        toast.error(errorData.message || 'Failed to reject report')
        return
      }

      toast.success('Report rejected')
      loadReports()
    } catch (error) {
      toast.error('Failed to reject report')
      console.error('Reject report error:', error)
    }
  }

  const getUniqueCountries = () => {
    const countries = [...new Set(reports.map(report => report.country))]
    return countries.filter(Boolean).sort()
  }

  const getStatusCounts = () => {
    return {
      all: filteredReports.length,
      pending: filteredReports.filter(r => r.status === 'PENDING').length,
      approved: filteredReports.filter(r => r.status === 'APPROVED').length,
      rejected: filteredReports.filter(r => r.status === 'REJECTED').length,
    }
  }

  if (status === 'loading') {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    )
  }

  if (status === 'unauthenticated') {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>Please sign in to view reports.</AlertDescription>
        </Alert>
      </div>
    )
  }

  const statusCounts = getStatusCounts()

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">
              {isPatient ? 'My Reports' : 'Reports'}
            </h1>
            <p className="text-muted-foreground">
              {isPatient 
                ? 'View and manage your submitted reports' 
                : 'Review and manage patient reports'
              }
            </p>
          </div>
          
          {isPatient && (
            <Button asChild>
              <Link href="/reports/new">
                <Plus className="mr-2 h-4 w-4" />
                New Report
              </Link>
            </Button>
          )}
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-[200px]">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by location, symptoms, medications..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="All Countries" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Countries</SelectItem>
                  {getUniqueCountries().map(country => (
                    <SelectItem key={country} value={country}>
                      {country}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedSeverity} onValueChange={setSelectedSeverity}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="All Severities" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Severities</SelectItem>
                  <SelectItem value="MILD">Mild</SelectItem>
                  <SelectItem value="MODERATE">Moderate</SelectItem>
                  <SelectItem value="SEVERE">Severe</SelectItem>
                </SelectContent>
              </Select>

              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchQuery('')
                  setSelectedCountry('all')
                  setSelectedSeverity('all')
                }}
              >
                Clear Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Status Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="all">
              All ({statusCounts.all})
            </TabsTrigger>
            <TabsTrigger value="pending">
              Pending ({statusCounts.pending})
            </TabsTrigger>
            <TabsTrigger value="approved">
              Approved ({statusCounts.approved})
            </TabsTrigger>
            <TabsTrigger value="rejected">
              Rejected ({statusCounts.rejected})
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="space-y-4">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : error ? (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            ) : filteredReports.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No reports found.</p>
                  {isPatient && (
                    <Button asChild className="mt-4">
                      <Link href="/reports/new">Submit your first report</Link>
                    </Button>
                  )}
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {filteredReports.map((report) => (
                  <Card key={report.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                          <CardTitle className="text-lg">
                            Report #{report.id ? report.id.slice(-8) : 'N/A'}
                          </CardTitle>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="h-4 w-4" />
                            Submitted {formatDate(report.createdAt)}
                            {report.ageAtReport && (
                              <>
                                • Age: {report.ageAtReport}
                              </>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={getStatusColor(report.status)}>
                            {report.status}
                          </Badge>
                          <Badge className={getSeverityColor(report.symptomSeverity)}>
                            {report.symptomSeverity}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                              <MapPin className="h-4 w-4" />
                              Location
                            </div>
                            <p className="text-sm">
                              {[report.city, report.state, report.country].filter(Boolean).join(', ')}
                            </p>
                          </div>
                          <div>
                            <div className="text-sm text-muted-foreground mb-1">Symptoms</div>
                            <div className="flex flex-wrap gap-1">
                              {(report.symptoms || []).slice(0, 3).map((symptom) => (
                                <Badge key={symptom} variant="outline" className="text-xs">
                                  {symptom}
                                </Badge>
                              ))}
                              {(report.symptoms || []).length > 3 && (
                                <Badge variant="outline" className="text-xs">
                                  +{(report.symptoms || []).length - 3} more
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>

                        {report.hasDocument && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <FileText className="h-4 w-4" />
                            PDF attached: {report.documentOriginalName}
                          </div>
                        )}

                        <div className="flex justify-between items-center pt-4 border-t">
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" asChild>
                              <Link href={`/reports/${report.id}`}>
                                View Details
                              </Link>
                            </Button>
                          </div>

                          {canApprove && report.status === 'PENDING' && (
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                onClick={() => handleApproveReport(report.id)}
                              >
                                Approve
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleRejectReport(report.id, 'Rejected by doctor')}
                              >
                                Reject
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
