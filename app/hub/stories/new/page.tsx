
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
import { Loader2, AlertCircle, ArrowLeft, Heart } from 'lucide-react'
import { createStorySchema, type CreateStoryInput } from '@/lib/validation'
import { MultiSelect } from '@/components/multi-select'
import { toast } from 'sonner'

const STORY_TAGS = [
  'Journey', 'Diagnosis', 'Treatment', 'Recovery', 'Challenges', 
  'Hope', 'Family', 'Work', 'Mental Health', 'Success', 'Support'
].map(tag => ({ label: tag, value: tag }))

export default function NewStoryPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [selectedTags, setSelectedTags] = useState<string[]>([])

  const form = useForm<CreateStoryInput>({
    resolver: zodResolver(createStorySchema),
    defaultValues: {
      title: '',
      summary: '',
      content: '',
      tags: [],
      isPublic: false, // Stories are private by default
    },
  })

  const onSubmit = async (data: CreateStoryInput) => {
    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('/api/hub/stories', {
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
        setError(errorData.error || 'Failed to create story')
        return
      }

      toast.success('Story shared successfully!')
      router.push('/hub')
    } catch (error) {
      setError('An unexpected error occurred')
      console.error('Story creation error:', error)
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
          <AlertDescription>Please sign in to share your story.</AlertDescription>
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
            <Heart className="h-8 w-8" />
            Share Your Story
          </h1>
          <p className="text-muted-foreground">
            Share your experience with the Crohn's community to inspire and support others.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Your Story</CardTitle>
            <CardDescription>
              Your personal journey can help others facing similar challenges.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Story Title *</Label>
                <Input
                  id="title"
                  placeholder="Give your story a meaningful title"
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
                <Label htmlFor="summary">Summary (optional)</Label>
                <Textarea
                  id="summary"
                  placeholder="Brief summary of your story..."
                  {...form.register('summary')}
                  disabled={isLoading}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label>Tags</Label>
                <MultiSelect
                  options={STORY_TAGS}
                  value={selectedTags}
                  onChange={setSelectedTags}
                  placeholder="Select tags that describe your story..."
                  searchPlaceholder="Search tags..."
                  emptyText="No tags found"
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Your Story *</Label>
                <Textarea
                  id="content"
                  placeholder="Share your journey, challenges, victories, and what you'd like others to know..."
                  {...form.register('content')}
                  disabled={isLoading}
                  rows={12}
                  className="min-h-[300px]"
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
                <Label htmlFor="isPublic">Make this story public (visible to all users)</Label>
              </div>
              <p className="text-sm text-muted-foreground">
                By default, your story will be private and only visible to healthcare providers.
              </p>

              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="flex gap-4">
                <Button type="submit" disabled={isLoading}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Share Story
                </Button>
                <Button
                  type="button"
                  variant="destructive"
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
