"use client"

import React, { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, ArrowLeft } from 'lucide-react'
import { createStorySchema, type CreateStoryInput } from '@/lib/validation'
import { MultiSelect } from '@/components/multi-select'
import { toast } from 'sonner'

const STORY_TAGS = [
  'Journey', 'Diagnosis', 'Treatment', 'Recovery', 'Challenges', 
  'Hope', 'Family', 'Work', 'Mental Health', 'Success', 'Support'
].map(tag => ({ label: tag, value: tag }))

export default function EditStoryPage() {
  const params = useParams()
  const router = useRouter()
  const { data: session, status } = useSession()
  const slug = params?.slug as string
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedTags, setSelectedTags] = useState<string[]>([])

  const form = useForm<CreateStoryInput>({
    resolver: zodResolver(createStorySchema),
    defaultValues: { title: '', summary: '', content: '', tags: [], isPublic: false }
  })

  useEffect(() => {
    if (slug) fetchStory()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug])

  async function fetchStory() {
    setIsLoading(true)
    setError('')

    try {
      const res = await fetch(`/api/hub/stories/${slug}`)
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        setError(data.error || 'Failed to load story')
        return
      }

      const data = await res.json()
      form.reset({
        title: data.title || '',
        summary: data.summary || '',
        content: data.content || '',
        tags: Array.isArray(data.tags) ? data.tags : [],
        isPublic: !!data.isPublic,
      })
      setSelectedTags(Array.isArray(data.tags) ? data.tags : [])
    } catch (err) {
      console.error(err)
      setError('An unexpected error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  async function onSubmit(values: CreateStoryInput) {
    setIsLoading(true)
    setError('')

    try {
      const res = await fetch(`/api/hub/stories/${slug}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...values, tags: selectedTags })
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        setError(data.error || 'Failed to update story')
        return
      }

      toast.success('Story updated')
      router.push(`/hub/stories/${slug}`)
    } catch (err) {
      console.error(err)
      setError('An unexpected error occurred')
    } finally {
      setIsLoading(false)
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
          <AlertDescription>Please sign in to edit this story.</AlertDescription>
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
            Back
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Edit Story</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input id="title" {...form.register('title')} />
                {form.formState.errors.title && <p className="text-sm text-destructive">{form.formState.errors.title.message}</p>}
              </div>

              <div>
                <Label htmlFor="summary">Summary</Label>
                <Textarea id="summary" {...form.register('summary')} rows={3} />
              </div>

              <div>
                <Label>Tags</Label>
                <MultiSelect options={STORY_TAGS} value={selectedTags} onChange={setSelectedTags} />
              </div>

              <div>
                <Label htmlFor="content">Content</Label>
                <Textarea id="content" {...form.register('content')} rows={12} className="min-h-[300px]" />
                {form.formState.errors.content && <p className="text-sm text-destructive">{form.formState.errors.content.message}</p>}
              </div>

              <div className="flex items-center gap-2">
                <Switch checked={form.watch('isPublic')} onCheckedChange={(v) => form.setValue('isPublic', v)} />
                <Label>Make public</Label>
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="flex gap-4">
                <Button type="submit">Save changes</Button>
                <Button variant="destructive" onClick={() => router.push('/hub')}>Cancel</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
