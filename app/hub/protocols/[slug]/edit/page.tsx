'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Loader2, 
  AlertCircle, 
  ArrowLeft,
  Calendar,
  User,
  Save,
  Shield
} from 'lucide-react'
import { formatDate } from '@/lib/utils'
import { toast } from 'sonner'
import Link from 'next/link'
import { MultiSelect } from '@/components/multi-select'
import { createProtocolSchema, type CreateProtocolInput } from '@/lib/validation'

const PROTOCOL_TAGS = [
  'Diagnosis', 'Treatment', 'Surgery', 'Medication', 'Monitoring', 
  'Emergency', 'Pediatric', 'Adult', 'Endoscopy', 'Imaging'
].map(tag => ({ label: tag, value: tag }))

interface Protocol {
  id: string
  title: string
  slug?: string
  summary?: string
  content: string
  tags: string[]
  isPublic: boolean
  createdBy: {
    name?: string
    email: string
  }
  createdAt: string
  updatedAt: string
}

export default function EditProtocolPage() {
  const { data: session, status } = useSession()
  const params = useParams()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState('')
  const [protocol, setProtocol] = useState<Protocol | null>(null)
  const [selectedTags, setSelectedTags] = useState<string[]>([])

  const slugParam = params?.slug as string
  const canEdit = session?.user?.role === 'MODERATOR' || session?.user?.role === 'ADMIN' || session?.user?.role === 'DOCTOR'

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

  // Redirect if user doesn't have permission
  useEffect(() => {
    if (status === 'authenticated' && !canEdit) {
      toast.error('Insufficient permissions')
      router.push('/hub')
    }
  }, [status, canEdit, router])

  useEffect(() => {
    if (slugParam && canEdit) {
      loadProtocol()
    }
  }, [slugParam, canEdit])

  const loadProtocol = async () => {
    setIsLoading(true)
    setError('')

    try {
      const response = await fetch(`/api/hub/protocols/${slugParam}`)
      
      if (!response.ok) {
        if (response.status === 404) {
          setError('Protocol not found')
        } else {
          setError(`Failed to load protocol: ${response.status}`)
        }
        return
      }

      const data = await response.json()
      setProtocol(data)
      setSelectedTags(data.tags || [])
      
      // Populate form fields
      form.reset({
        title: data.title,
        slug: data.slug || '',
        summary: data.summary || '',
        content: data.content,
        tags: data.tags || [],
        isPublic: data.isPublic,
      })
    } catch (error) {
      setError('An unexpected error occurred')
      console.error('Failed to load protocol:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const onSubmit = async (data: CreateProtocolInput) => {
    if (!canEdit) {
      toast.error('Insufficient permissions')
      return
    }

    setIsSaving(true)

    try {
      const response = await fetch(`/api/hub/protocols/${slugParam}`, {
        method: 'PUT',
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
        throw new Error(errorData.error || 'Failed to update protocol')
      }

      const updatedProtocol = await response.json()
      
      toast.success('Protocol updated successfully')
      router.push(`/hub/protocols/${updatedProtocol.data.slug || updatedProtocol.data.id}`)
    } catch (error) {
      console.error('Failed to update protocol:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to update protocol')
    } finally {
      setIsSaving(false)
    }
  }

  const generateSlugFromTitle = () => {
    const title = form.getValues('title')
    if (!title.trim()) return
    
    const generatedSlug = title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .substring(0, 100)
    
    form.setValue('slug', generatedSlug)
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
          <AlertDescription>Please sign in to edit protocols.</AlertDescription>
        </Alert>
      </div>
    )
  }

  if (!canEdit) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>You do not have permission to edit protocols.</AlertDescription>
        </Alert>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="space-y-6">
          <Button asChild variant="ghost">
            <Link href="/hub?tab=protocols">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Protocols
            </Link>
          </Button>
          
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </div>
      </div>
    )
  }

  if (!protocol) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Button asChild variant="ghost" className="mb-4">
          <Link href="/hub?tab=protocols">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Protocols
          </Link>
        </Button>
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>Protocol not found</AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button asChild variant="ghost">
            <Link href={`/hub/protocols/${protocol.slug || protocol.id}`}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Protocol
            </Link>
          </Button>
        </div>

        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Shield className="h-8 w-8" />
            Edit Protocol
          </h1>
          <p className="text-muted-foreground">
            Update the protocol information below.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Protocol Details</CardTitle>
            <CardDescription>
              Update the protocol information below.
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
                  disabled={isSaving}
                />
                {form.formState.errors.title && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.title.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="slug">URL Slug (optional)</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={generateSlugFromTitle}
                    disabled={isSaving}
                  >
                    Generate from title
                  </Button>
                </div>
                <Input
                  id="slug"
                  placeholder="protocol-slug"
                  {...form.register('slug')}
                  disabled={isSaving}
                />
                <p className="text-sm text-muted-foreground">
                  Leave empty to auto-generate from title. Should be URL-friendly.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="summary">Summary (optional)</Label>
                <Textarea
                  id="summary"
                  placeholder="Brief overview of the protocol..."
                  {...form.register('summary')}
                  disabled={isSaving}
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
                  disabled={isSaving}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Protocol Content *</Label>
                <Textarea
                  id="content"
                  placeholder="Write your protocol steps and guidelines here..."
                  {...form.register('content')}
                  disabled={isSaving}
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
                  disabled={isSaving}
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
                <Button type="submit" disabled={isSaving}>
                  {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  asChild
                  disabled={isSaving}
                >
                  <Link href={`/hub/protocols/${protocol.slug || protocol.id}`}>
                    Cancel
                  </Link>
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Protocol Info */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Protocol Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <span>Created by: {protocol.createdBy.name || protocol.createdBy.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>Created: {formatDate(protocol.createdAt)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>Last updated: {formatDate(protocol.updatedAt)}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}