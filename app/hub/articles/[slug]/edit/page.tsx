'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Loader2, 
  AlertCircle, 
  ArrowLeft,
  Calendar,
  User,
  Tag,
  Save,
  X
} from 'lucide-react'
import { formatDate } from '@/lib/utils'
import { toast } from 'sonner'
import Link from 'next/link'

interface Article {
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

export default function EditArticlePage() {
  const { data: session } = useSession()
  const params = useParams()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState('')
  const [article, setArticle] = useState<Article | null>(null)
  
  // Form state
  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [summary, setSummary] = useState('')
  const [content, setContent] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [newTag, setNewTag] = useState('')
  const [isPublic, setIsPublic] = useState(true)

  const slugParam = params?.slug as string
  const canEdit = session?.user?.role === 'MODERATOR' || session?.user?.role === 'ADMIN' || session?.user?.role === 'DOCTOR'

  // Redirect if user doesn't have permission
  useEffect(() => {
    if (session && !canEdit) {
      toast.error('Insufficient permissions')
      router.push('/hub')
    }
  }, [session, canEdit, router])

  useEffect(() => {
    if (slugParam && canEdit) {
      loadArticle()
    }
  }, [slugParam, canEdit])

  const loadArticle = async () => {
    setIsLoading(true)
    setError('')

    try {
      const response = await fetch(`/api/hub/articles/${slugParam}`)
      
      if (!response.ok) {
        if (response.status === 404) {
          setError('Article not found')
        } else {
          setError(`Failed to load article: ${response.status}`)
        }
        return
      }

      const data = await response.json()
      setArticle(data)
      // Populate form fields
      setTitle(data.title)
      setSlug(data.slug || '')
      setSummary(data.summary || '')
      setContent(data.content)
      setTags(data.tags || [])
      setIsPublic(data.isPublic)
    } catch (error) {
      setError('An unexpected error occurred')
      console.error('Failed to load article:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()])
      setNewTag('')
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove))
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAddTag()
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!title.trim()) {
      toast.error('Title is required')
      return
    }

    if (!content.trim()) {
      toast.error('Content is required')
      return
    }

    setIsSaving(true)

    try {
      const response = await fetch(`/api/hub/articles/${slugParam}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: title.trim(),
          slug: slug.trim() || undefined,
          summary: summary.trim() || undefined,
          content: content.trim(),
          tags,
          isPublic
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to update article')
      }

      const updatedArticle = await response.json()
      
      toast.success('Article updated successfully')
      // Redirect to the article page
      router.push(`/hub/articles/${updatedArticle.data.slug || updatedArticle.data.id}`)
    } catch (error) {
      console.error('Failed to update article:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to update article')
    } finally {
      setIsSaving(false)
    }
  }

  const generateSlugFromTitle = () => {
    if (!title.trim()) return
    
    const generatedSlug = title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .substring(0, 100)
    
    setSlug(generatedSlug)
  }

  if (!canEdit) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>You do not have permission to edit articles.</AlertDescription>
        </Alert>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <Button asChild variant="outline">
            <Link href="/hub">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Hub
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

  if (!article) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Button asChild variant="outline" className="mb-4">
          <Link href="/hub">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Hub
          </Link>
        </Button>
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>Article not found</AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button asChild variant="outline">
            <Link href={`/hub/articles/${article.id}`}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Article
            </Link>
          </Button>
          
          <div className="flex items-center gap-2">
            <Button 
              onClick={handleSubmit}
              disabled={isSaving}
            >
              {isSaving ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Save className="mr-2 h-4 w-4" />
              )}
              Save Changes
            </Button>
          </div>
        </div>

        {/* Edit Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Edit Article</CardTitle>
              <CardDescription>
                Update the article information below.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Title */}
              <div className="space-y-2">
                <label htmlFor="title" className="text-sm font-medium">
                  Title *
                </label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter article title"
                  required
                />
              </div>

              {/* Slug */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label htmlFor="slug" className="text-sm font-medium">
                    Slug
                  </label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={generateSlugFromTitle}
                  >
                    Generate from title
                  </Button>
                </div>
                <Input
                  id="slug"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="article-slug (optional)"
                />
                <p className="text-sm text-muted-foreground">
                  Leave empty to auto-generate from title. Should be URL-friendly.
                </p>
              </div>

              {/* Summary */}
              <div className="space-y-2">
                <label htmlFor="summary" className="text-sm font-medium">
                  Summary
                </label>
                <Textarea
                  id="summary"
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  placeholder="Brief description of the article"
                  rows={3}
                />
              </div>

              {/* Content */}
              <div className="space-y-2">
                <label htmlFor="content" className="text-sm font-medium">
                  Content *
                </label>
                <Textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Article content (supports HTML)"
                  rows={15}
                  required
                />
                <p className="text-sm text-muted-foreground">
                  You can use HTML tags for formatting.
                </p>
              </div>

              {/* Tags */}
              <div className="space-y-2">
                <label htmlFor="tags" className="text-sm font-medium">
                  Tags
                </label>
                <div className="flex gap-2">
                  <Input
                    id="tags"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Add a tag"
                  />
                  <Button type="button" onClick={handleAddTag}>
                    Add
                  </Button>
                </div>
                
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                        <Tag className="h-3 w-3" />
                        {tag}
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tag)}
                          className="ml-1 hover:text-destructive"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              {/* Visibility */}
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isPublic"
                    checked={isPublic}
                    onChange={(e) => setIsPublic(e.target.checked)}
                    className="rounded border-gray-300"
                  />
                  <label htmlFor="isPublic" className="text-sm font-medium">
                    Make this article public
                  </label>
                </div>
                <p className="text-sm text-muted-foreground">
                  Public articles are visible to all users. Uncheck to make it private.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Article Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Article Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span>Created by: {article.createdBy.name || article.createdBy.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>Created: {formatDate(article.createdAt)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>Last updated: {formatDate(article.updatedAt)}</span>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </div>
  )
}