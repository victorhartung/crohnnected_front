
'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, AlertCircle, ArrowLeft, Shield } from 'lucide-react'
import { createProtocolSchema, type CreateProtocolInput } from '@/lib/validation'
import { MultiSelect } from '@/components/multi-select'
import { toast } from 'sonner'

const PROTOCOL_TAGS = [
  'Diagnosis', 'Treatment', 'Surgery', 'Medication', 'Monitoring', 
  'Emergency', 'Pediatric', 'Adult', 'Endoscopy', 'Imaging'
].map(tag => ({ label: tag, value: tag }))

export default function NewProtocolPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [selectedTags, setSelectedTags] = useState<string[]>([])

  const form = useForm<CreateProtocolInput>({
    resolver: zodResolver(createProtocolSchema),
    defaultValues: {
      title: '',
      slug: '',
      summary: '',
      content: '',
      tags: [],
      isPublic: true,
    },
  })

  const canCreate = ['MODERATOR', 'ADMIN', 'DOCTOR'].includes(session?.user?.role || '')

  const onSubmit = async (data: CreateProtocolInput) => {
    if (!canCreate) {
      setError('You do not have permission to create protocols')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('/api/hub/protocols', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          tags: selectedTags,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        setError(errorData.error || 'Failed to create protocol')
        return
      }

      toast.success('Protocol created successfully!')
      router.push('/hub?tab=protocols')
    } catch (error) {
      setError('An unexpected error occurred')
      console.error('Protocol creation error:', error)
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
          <AlertDescription>Please sign in to create protocols.</AlertDescription>
        </Alert>
      </div>
    )
  }

  if (!canCreate) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>You do not have permission to create protocols.</AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Hub
          </Button>
        </div>

        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Shield className="h-8 w-8" />
            Create New Protocol
          </h1>
          <p className="text-muted-foreground">
            Share clinical guidelines and procedures with healthcare professionals.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Protocol Details</CardTitle>
            <CardDescription>
              Provide information about your clinical protocol.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  placeholder="Enter protocol title"
                  {...form.register('title')}
                  disabled={isLoading}
                />
                {form.formState.errors.title && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.title.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug">URL Slug (optional)</Label>
                <Input
                  id="slug"
                  placeholder="protocol-url-slug"
                  {...form.register('slug')}
                  disabled={isLoading}
                />
                <p className="text-sm text-muted-foreground">
                  Leave empty to auto-generate from title
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="summary">Summary (optional)</Label>
                <Textarea
                  id="summary"
                  placeholder="Brief overview of the protocol..."
                  {...form.register('summary')}
                  disabled={isLoading}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label>Tags</Label>
                <MultiSelect
                  options={PROTOCOL_TAGS}
                  value={selectedTags}
                  onChange={setSelectedTags}
                  placeholder="Select tags..."
                  searchPlaceholder="Search tags..."
                  emptyText="No tags found"
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Protocol Content *</Label>
                <Textarea
                  id="content"
                  placeholder="Write your protocol steps and guidelines here..."
                  {...form.register('content')}
                  disabled={isLoading}
                  rows={15}
                  className="min-h-[400px]"
                />
                {form.formState.errors.content && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.content.message}
                  </p>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="isPublic"
                  checked={form.watch('isPublic')}
                  onCheckedChange={(checked) => form.setValue('isPublic', checked)}
                  disabled={isLoading}
                />
                <Label htmlFor="isPublic">Make this protocol public</Label>
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="flex gap-4">
                <Button type="submit" disabled={isLoading}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Create Protocol
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push('/hub')}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
