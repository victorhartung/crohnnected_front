
'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useParams, useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { 
  Loader2, 
  AlertCircle, 
  ArrowLeft,
  FileText, 
  Calendar, 
  MapPin,
  Download,
  User,
  Stethoscope,
  Clock,
  CheckCircle,
  XCircle
} from 'lucide-react'
import { formatDate, formatDateTime, formatFileSize, getStatusColor, getSeverityColor, downloadPDFFromBase64 } from '@/lib/utils'
import { rejectReportSchema, type RejectReportInput } from '@/lib/validations'
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
  flareFrequencyPerYear?: number
  surgeryHistory?: Array<{ type: string; year?: number; notes?: string }>
  diagnosisDate?: string
  notes?: string
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
}

export default function ReportDetailPage() {
  const { data: session, status } = useSession()
  const params = useParams()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [report, setReport] = useState<Report | null>(null)
  const [isDownloading, setIsDownloading] = useState(false)
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false)

  const reportId = params?.id as string

  const isPatient = session?.user?.role === 'PATIENT'
  const canApprove = session?.user?.role === 'DOCTOR' || session?.user?.role === 'MODERATOR' || session?.user?.role === 'ADMIN'
  const canViewDocument = session?.user?.role !== 'RESEARCHER' // Researchers can't access PDFs

  const rejectForm = useForm<RejectReportInput>({
    resolver: zodResolver(rejectReportSchema),
    defaultValues: {
      reason: '',
    },
  })

  useEffect(() => {
    if (reportId && session?.user) {
      loadReport()
    }
  }, [reportId, session])

  const loadReport = async () => {
    setIsLoading(true)
    setError('')

    try {
      const response = await fetch(`/api/reports/${reportId}`)
      if (!response.ok) {
        if (response.status === 404) {
          setError('Report not found')
        } else if (response.status === 403) {
          setError('You do not have permission to view this report')
        } else {
          const errorData = await response.json()
          setError(errorData.message || 'Failed to load report')
        }
        return
      }

      const data = await response.json()
      setReport(data)
    } catch (error) {
      setError('An unexpected error occurred')
      console.error('Failed to load report:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleApproveReport = async () => {
    if (!report) return

    try {
      const response = await fetch(`/api/reports/${report.id}/approve`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ notes: 'Approved by healthcare provider' }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        toast.error(errorData.message || 'Failed to approve report')
        return
      }

      toast.success('Report approved successfully')
      loadReport() // Refresh the report
    } catch (error) {
      toast.error('Failed to approve report')
      console.error('Approve report error:', error)
    }
  }

  const handleRejectReport = async (data: RejectReportInput) => {
    if (!report) return

    try {
      const response = await fetch(`/api/reports/${report.id}/reject`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const errorData = await response.json()
        toast.error(errorData.message || 'Failed to reject report')
        return
      }

      toast.success('Report rejected')
      setRejectDialogOpen(false)
      rejectForm.reset()
      loadReport() // Refresh the report
    } catch (error) {
      toast.error('Failed to reject report')
      console.error('Reject report error:', error)
    }
  }

  const handleDownloadPDF = async () => {
    if (!report?.hasDocument) return

    setIsDownloading(true)

    try {
      const response = await fetch(`/api/reports/${report.id}/document`)
      if (!response.ok) {
        const errorData = await response.json()
        toast.error(errorData.message || 'Failed to download document')
        return
      }

      const data = await response.json()
      downloadPDFFromBase64(data.documentBase64, data.documentOriginalName)
      toast.success('Document downloaded successfully')
    } catch (error) {
      toast.error('Failed to download document')
      console.error('Download error:', error)
    } finally {
      setIsDownloading(false)
    }
  }

  if (status === 'loading' || isLoading) {
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
          <AlertDescription>Please sign in to view this report.</AlertDescription>
        </Alert>
      </div>
    )
  }

  if (error || !report) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-4">
          <Button variant="ghost" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error || 'Report not found'}</AlertDescription>
          </Alert>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Reports
          </Button>
          
          {canApprove && report.status === 'PENDING' && (
            <div className="flex gap-2">
              <Button onClick={handleApproveReport}>
                <CheckCircle className="mr-2 h-4 w-4" />
                Approve
              </Button>
              <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="destructive">
                    <XCircle className="mr-2 h-4 w-4" />
                    Reject
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Reject Report</DialogTitle>
                    <DialogDescription>
                      Please provide a reason for rejecting this report.
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={rejectForm.handleSubmit(handleRejectReport)}>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="reason">Rejection Reason</Label>
                        <Textarea
                          id="reason"
                          placeholder="Enter the reason for rejection..."
                          {...rejectForm.register('reason')}
                          rows={3}
                        />
                        {rejectForm.formState.errors.reason && (
                          <p className="text-sm text-destructive">
                            {rejectForm.formState.errors.reason.message}
                          </p>
                        )}
                      </div>
                    </div>
                    <DialogFooter>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setRejectDialogOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button type="submit" variant="destructive">
                        Reject Report
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          )}
        </div>

        {/* Report Header */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <CardTitle className="text-2xl">
                  Report #{report.id.slice(-8)}
                </CardTitle>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    Submitted {formatDate(report.createdAt)}
                  </div>
                  {report.ageAtReport && (
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      Age: {report.ageAtReport}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge className={getStatusColor(report.status)}>
                  {report.status}
                </Badge>
                <Badge className={getSeverityColor(report.symptomSeverity)}>
                  {report.symptomSeverity} Severity
                </Badge>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Status Information */}
        {(report.status === 'APPROVED' || report.status === 'REJECTED') && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Status Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              {report.status === 'APPROVED' && (
                <div className="space-y-2">
                  <p className="text-sm">
                    <span className="font-medium">Approved by:</span>{' '}
                    {report.approvedBy?.name || report.approvedBy?.email}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Approved on:</span>{' '}
                    {report.approvedAt && formatDateTime(report.approvedAt)}
                  </p>
                </div>
              )}
              {report.status === 'REJECTED' && report.rejectionReason && (
                <div className="space-y-2">
                  <p className="text-sm font-medium">Rejection Reason:</p>
                  <p className="text-sm bg-destructive/10 p-3 rounded-md">
                    {report.rejectionReason}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {report.ageAtReport && (
                <div>
                  <span className="text-sm font-medium">Age at Report:</span>
                  <p className="text-sm text-muted-foreground">{report.ageAtReport} years</p>
                </div>
              )}
              {report.sex && (
                <div>
                  <span className="text-sm font-medium">Sex:</span>
                  <p className="text-sm text-muted-foreground">{report.sex}</p>
                </div>
              )}
              {report.diagnosisDate && (
                <div>
                  <span className="text-sm font-medium">Diagnosis Date:</span>
                  <p className="text-sm text-muted-foreground">
                    {formatDate(report.diagnosisDate)}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Location Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Location
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <span className="text-sm font-medium">Location:</span>
                <p className="text-sm text-muted-foreground">
                  {[report.city, report.state, report.country].filter(Boolean).join(', ')}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Medical Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Stethoscope className="h-5 w-5" />
              Medical Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <span className="text-sm font-medium block mb-2">Symptoms:</span>
              <div className="flex flex-wrap gap-2">
                {report.symptoms.map((symptom) => (
                  <Badge key={symptom} variant="outline">
                    {symptom}
                  </Badge>
                ))}
              </div>
            </div>

            {report.medications && report.medications.length > 0 && (
              <div>
                <span className="text-sm font-medium block mb-2">Current Medications:</span>
                <div className="flex flex-wrap gap-2">
                  {report.medications.map((medication) => (
                    <Badge key={medication} variant="outline">
                      {medication}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {report.flareFrequencyPerYear && (
              <div>
                <span className="text-sm font-medium">Flare Frequency:</span>
                <p className="text-sm text-muted-foreground">
                  {report.flareFrequencyPerYear} flares per year
                </p>
              </div>
            )}

            {report.surgeryHistory && report.surgeryHistory.length > 0 && (
              <div>
                <span className="text-sm font-medium block mb-2">Surgery History:</span>
                <div className="space-y-2">
                  {report.surgeryHistory.map((surgery, index) => (
                    <div key={index} className="bg-muted/50 p-3 rounded-md">
                      <p className="text-sm">
                        <span className="font-medium">{surgery.type}</span>
                        {surgery.year && <span className="text-muted-foreground"> ({surgery.year})</span>}
                      </p>
                      {surgery.notes && (
                        <p className="text-xs text-muted-foreground mt-1">{surgery.notes}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {report.notes && (
              <div>
                <span className="text-sm font-medium block mb-2">Additional Notes:</span>
                <div className="bg-muted/50 p-3 rounded-md">
                  <p className="text-sm text-muted-foreground">{report.notes}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Document Section */}
        {report.hasDocument && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Supporting Documentation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-4 border rounded-md">
                <div className="flex items-center gap-3">
                  <FileText className="h-8 w-8 text-red-500" />
                  <div>
                    <p className="font-medium">{report.documentOriginalName}</p>
                    <p className="text-sm text-muted-foreground">
                      {report.documentSizeBytes && formatFileSize(report.documentSizeBytes)}
                    </p>
                  </div>
                </div>
                {canViewDocument ? (
                  <Button 
                    variant="outline"
                    onClick={handleDownloadPDF}
                    disabled={isDownloading}
                  >
                    {isDownloading ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Download className="mr-2 h-4 w-4" />
                    )}
                    Download
                  </Button>
                ) : (
                  <Badge variant="secondary">Access Restricted</Badge>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
