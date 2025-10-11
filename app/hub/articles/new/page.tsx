
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
import { Loader2, AlertCircle, ArrowLeft, BookOpen, X } from 'lucide-react'
import { createArticleSchema, type CreateArticleInput } from '@/lib/validation'
import { toast } from 'sonner'

const COMMON_TAGS = [
  'Treatment', 'Symptoms', 'Diet', 'Medication', 'Surgery', 
  'Research', 'Lifestyle', 'Mental Health', 'Pediatric', 'Women\'s Health'
]

export default function NewArticlePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState('')

  const form = useForm<CreateArticleInput>({
    resolver: zodResolver(createArticleSchema),
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

  const addTag = (tag: string) => {
    const trimmedTag = tag.trim()
    if (trimmedTag && !selectedTags.includes(trimmedTag)) {
      setSelectedTags([...selectedTags, trimmedTag])
      setTagInput('')
    }
  }

  const removeTag = (tagToRemove: string) => {
    setSelectedTags(selectedTags.filter(tag => tag !== tagToRemove))
  }

  const handleTagInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addTag(tagInput)
    }
  }

  const addCommonTag = (tag: string) => {
    if (!selectedTags.includes(tag)) {
      setSelectedTags([...selectedTags, tag])
    }
  }

  const onSubmit = async (data: CreateArticleInput) => {
    if (!canCreate) {
      setError('You do not have permission to create articles')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('/api/hub/articles', {
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
        setError(errorData.error || 'Failed to create article')
        return
      }

      toast.success('Article created successfully!')
      router.push('/hub')
    } catch (error) {
      setError('An unexpected error occurred')
      console.error('Article creation error:', error)
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
          <AlertDescription>Please sign in to create articles.</AlertDescription>
        </Alert>
      </div>
    )
  }

  if (!canCreate) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>You do not have permission to create articles.</AlertDescription>
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
            <BookOpen className="h-8 w-8" />
            Create New Article
          </h1>
          <p className="text-muted-foreground">
            Share educational content with the Crohn's community.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Article Details</CardTitle>
            <CardDescription>
              Provide information about your article.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  placeholder="Enter article title"
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
                  placeholder="article-url-slug"
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
                  placeholder="Brief summary of the article..."
                  {...form.register('summary')}
                  disabled={isLoading}
                  rows={3}
                />
              </div>

              <div className="space-y-4">
                <Label>Tags</Label>
                
                <div className="space-y-2">
                  <Input
                    placeholder="Type a tag and press Enter..."
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleTagInputKeyDown}
                    disabled={isLoading}
                  />
                  <p className="text-sm text-muted-foreground">
                    Type a tag and press Enter to add it
                  </p>
                </div>

                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Common tags:</p>
                  <div className="flex flex-wrap gap-2">
                    {COMMON_TAGS.map(tag => (
                      <Button key={tag} type="button" variant="whiteline" size="sm" onClick={() => addCommonTag(tag)} disabled={isLoading || selectedTags.includes(tag)} className="text-xs">
                        {tag}
                      </Button>
                    ))}
                  </div>
                </div>

                {selectedTags.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Selected tags:</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedTags.map(tag => (
                        <div key={tag} className="flex items-center gap-1 bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm border">
                          {tag}
                          <button type="button" onClick={() => removeTag(tag)} disabled={isLoading} className="hover:bg-destructive hover:text-destructive-foreground rounded-full p-0.5">
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Content *</Label>
                <Textarea
                  id="content"
                  placeholder="Write your article content here..."
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
                <Label htmlFor="isPublic">Make this article public</Label>
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
                  Create Article
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
