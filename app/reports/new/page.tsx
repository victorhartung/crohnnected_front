
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'
import { Loader2, AlertCircle, FileText, MapPin, Stethoscope } from 'lucide-react'
import { reportSchema, type ReportInput } from '@/lib/validations'
import { PDFUpload } from '@/components/pdf-upload'
import { MultiSelect, type Option } from '@/components/multi-select'
import { COMMON_SYMPTOMS, COMMON_MEDICATIONS } from '@/lib/constants'
import { toast } from 'sonner'

export default function NewReportPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [pdfFile, setPdfFile] = useState<{
    base64: string
    originalName: string
    mime: string
    sizeBytes: number
  } | null>(null)

  const form = useForm<ReportInput>({
    resolver: zodResolver(reportSchema),
    defaultValues: {
      ageAtReport: undefined,
      sex: undefined,
      country: '',
      state: '',
      city: '',
      lat: undefined,
      lng: undefined,
      symptoms: [],
      symptomSeverity: undefined,
      medications: [],
      flareFrequencyPerYear: undefined,
      surgeryHistory: [],
      diagnosisDate: '',
      notes: '',
    },
  })

  const symptomOptions: Option[] = COMMON_SYMPTOMS.map(symptom => ({
    label: symptom,
    value: symptom,
  }))

  const medicationOptions: Option[] = COMMON_MEDICATIONS.map(medication => ({
    label: medication,
    value: medication,
  }))

  const watchedSymptoms = form.watch('symptoms') || []
  const watchedMedications = form.watch('medications') || []

  const onSubmit = async (data: ReportInput) => {
    if (session?.user?.role !== 'PATIENT') {
      setError('Only patients can submit reports')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      const payload = {
        ...data,
        documentBase64: pdfFile?.base64,
        documentOriginalName: pdfFile?.originalName,
        documentMime: pdfFile?.mime,
        documentSizeBytes: pdfFile?.sizeBytes,
      }

      const response = await fetch('/api/reports', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const errorData = await response.json()
        setError(errorData.message || 'Failed to submit report')
        return
      }

      toast.success('Report submitted successfully!')
      router.push('/reports')
    } catch (error) {
      setError('An unexpected error occurred. Please try again.')
      console.error('Report submission error:', error)
    } finally {
      setIsLoading(false)
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
          <AlertDescription>Please sign in to submit a report.</AlertDescription>
        </Alert>
      </div>
    )
  }

  if (session?.user?.role !== 'PATIENT') {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>Only patients can submit reports.</AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Submit New Report</h1>
          <p className="text-muted-foreground">
            Provide details about your condition and attach supporting documentation.
          </p>
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Personal Information
              </CardTitle>
              <CardDescription>
                Basic demographic information for this report.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="ageAtReport">Age at Report</Label>
                  <Input
                    id="ageAtReport"
                    type="number"
                    placeholder="Enter your age"
                    {...form.register('ageAtReport', { valueAsNumber: true })}
                    disabled={isLoading}
                  />
                  {form.formState.errors.ageAtReport && (
                    <p className="text-sm text-destructive">
                      {form.formState.errors.ageAtReport.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sex">Sex</Label>
                  <Select
                    value={form.watch('sex') || ''}
                    onValueChange={(value) => form.setValue('sex', value as any)}
                    disabled={isLoading}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select sex" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="FEMALE">Female</SelectItem>
                      <SelectItem value="MALE">Male</SelectItem>
                      <SelectItem value="INTERSEX">Intersex</SelectItem>
                      <SelectItem value="OTHER">Other</SelectItem>
                      <SelectItem value="UNSPECIFIED">Prefer not to say</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="diagnosisDate">Diagnosis Date</Label>
                <Input
                  id="diagnosisDate"
                  type="date"
                  {...form.register('diagnosisDate')}
                  disabled={isLoading}
                />
              </div>
            </CardContent>
          </Card>

          {/* Location Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Location Information
              </CardTitle>
              <CardDescription>
                Location information for geographic analysis.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="country">Country *</Label>
                  <Input
                    id="country"
                    type="text"
                    placeholder="Country"
                    {...form.register('country')}
                    disabled={isLoading}
                  />
                  {form.formState.errors.country && (
                    <p className="text-sm text-destructive">
                      {form.formState.errors.country.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">State/Province</Label>
                  <Input
                    id="state"
                    type="text"
                    placeholder="State/Province"
                    {...form.register('state')}
                    disabled={isLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    type="text"
                    placeholder="City"
                    {...form.register('city')}
                    disabled={isLoading}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Medical Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Stethoscope className="h-5 w-5" />
                Medical Information
              </CardTitle>
              <CardDescription>
                Details about your symptoms, medications, and medical history.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Symptoms *</Label>
                <MultiSelect
                  options={symptomOptions}
                  value={watchedSymptoms}
                  onChange={(value) => form.setValue('symptoms', value)}
                  placeholder="Select symptoms..."
                  searchPlaceholder="Search symptoms..."
                  emptyText="No symptoms found"
                  disabled={isLoading}
                />
                {form.formState.errors.symptoms && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.symptoms.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="symptomSeverity">Symptom Severity *</Label>
                <Select
                  value={form.watch('symptomSeverity') || ''}
                  onValueChange={(value) => form.setValue('symptomSeverity', value as any)}
                  disabled={isLoading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select severity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MILD">Mild</SelectItem>
                    <SelectItem value="MODERATE">Moderate</SelectItem>
                    <SelectItem value="SEVERE">Severe</SelectItem>
                  </SelectContent>
                </Select>
                {form.formState.errors.symptomSeverity && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.symptomSeverity.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Current Medications</Label>
                <MultiSelect
                  options={medicationOptions}
                  value={watchedMedications}
                  onChange={(value) => form.setValue('medications', value)}
                  placeholder="Select medications..."
                  searchPlaceholder="Search medications..."
                  emptyText="No medications found"
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="flareFrequencyPerYear">Flare Frequency per Year</Label>
                <Input
                  id="flareFrequencyPerYear"
                  type="number"
                  placeholder="Number of flares per year"
                  {...form.register('flareFrequencyPerYear', { valueAsNumber: true })}
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Additional Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="Any additional information about your condition, symptoms, or treatment..."
                  {...form.register('notes')}
                  disabled={isLoading}
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>

          {/* PDF Upload */}
          <Card>
            <CardHeader>
              <CardTitle>Supporting Documentation</CardTitle>
              <CardDescription>
                Upload medical reports, test results, or other supporting documents.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PDFUpload
                onFileChange={setPdfFile}
                currentFile={pdfFile}
                disabled={isLoading}
              />
            </CardContent>
          </Card>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="flex gap-4">
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Submit Report
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/reports')}
              disabled={isLoading}
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
