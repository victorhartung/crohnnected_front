
'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Loader2, 
  AlertCircle, 
  Search, 
  Plus,
  BookOpen,
  FileText,
  Heart,
  Calendar,
  User,
  Tag
} from 'lucide-react'
import { formatDate } from '@/lib/utils'
import { toast } from 'sonner'

interface HubContent {
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

export default function HubPage() {
  const { data: session, status } = useSession()
  const [activeTab, setActiveTab] = useState('articles')
  const params = useSearchParams()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTag, setSelectedTag] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [articles, setArticles] = useState<HubContent[]>([])
  const [protocols, setProtocols] = useState<HubContent[]>([])
  const [stories, setStories] = useState<HubContent[]>([])
  const [allTags, setAllTags] = useState<string[]>([])

  const canCreateContent = session?.user?.role === 'MODERATOR' || session?.user?.role === 'ADMIN' || session?.user?.role === 'DOCTOR'

  useEffect(() => {
    const tabParam = params?.get('tab')
    if (tabParam && ['articles','protocols','stories'].includes(tabParam)) {
      setActiveTab(tabParam)
    }
    loadContent()
  }, [])

  const loadContent = async () => {
    setIsLoading(true)

    try {
      const [articlesRes, protocolsRes, storiesRes] = await Promise.all([
        fetch('/api/hub/articles'),
        fetch('/api/hub/protocols'),
        fetch('/api/hub/stories')
      ])

      if (articlesRes.ok) {
        const articlesData = await articlesRes.json()
        setArticles(articlesData)
      }

      if (protocolsRes.ok) {
        const protocolsData = await protocolsRes.json()
        setProtocols(protocolsData)
      }

      if (storiesRes.ok) {
        const storiesData = await storiesRes.json()
        setStories(storiesData)
      }

      // Extract all unique tags
      const allContent = [
        ...articles,
        ...protocols, 
        ...stories
      ]
      const tags = Array.from(new Set(allContent.flatMap(item => item.tags))).sort()
      setAllTags(tags)

    } catch (error) {
      toast.error('Failed to load content')
      console.error('Failed to load hub content:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getCurrentContent = () => {
    switch (activeTab) {
      case 'articles':
        return articles
      case 'protocols':
        return protocols
      case 'stories':
        return stories
      default:
        return []
    }
  }

  const filterContent = (content: HubContent[]) => {
    return content.filter(item => {
      const matchesSearch = !searchQuery || 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.summary?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.content.toLowerCase().includes(searchQuery.toLowerCase())
      
      const matchesTag = !selectedTag || item.tags.includes(selectedTag)
      
      return matchesSearch && matchesTag
    })
  }

  const getTabIcon = (tab: string) => {
    switch (tab) {
      case 'articles':
        return <BookOpen className="h-4 w-4" />
      case 'protocols':
        return <FileText className="h-4 w-4" />
      case 'stories':
        return <Heart className="h-4 w-4" />
      default:
        return null
    }
  }

  const getCreateLink = (type: string) => {
    return `/hub/${type}/new`
  }

  const currentContent = getCurrentContent()
  const filteredContent = filterContent(currentContent)

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold">Information Hub</h1>
            <p className="text-muted-foreground">
              Educational resources, clinical protocols, and patient stories for the Crohn's community.
            </p>
          </div>
          
          {canCreateContent && (
            <Button asChild>
              <Link href={getCreateLink(activeTab)}>
                <Plus className="mr-2 h-4 w-4" />
                New {activeTab.slice(0, -1)}
              </Link>
            </Button>
          )}
        </div>

        {/* Search and Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search content..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={selectedTag === '' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedTag('')}
                >
                  All Topics
                </Button>
                {allTags.slice(0, 6).map((tag) => (
                  <Button
                    key={tag}
                    variant={selectedTag === tag ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedTag(tag)}
                  >
                    {tag}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="articles" className="flex items-center gap-2">
              {getTabIcon('articles')}
              Articles ({articles.length})
            </TabsTrigger>
            <TabsTrigger value="protocols" className="flex items-center gap-2">
              {getTabIcon('protocols')}
              Protocols ({protocols.length})
            </TabsTrigger>
            <TabsTrigger value="stories" className="flex items-center gap-2">
              {getTabIcon('stories')}
              Stories ({stories.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="space-y-4">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : filteredContent.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center">
                  {getTabIcon(activeTab)}
                  <div className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                  <p className="text-muted-foreground">
                    {searchQuery || selectedTag 
                      ? `No ${activeTab} match your search criteria.`
                      : `No ${activeTab} available yet.`
                    }
                  </p>
                  {canCreateContent && !searchQuery && !selectedTag && (
                    <Button asChild className="mt-4">
                      <Link href={getCreateLink(activeTab)}>
                        Create the first {activeTab.slice(0, -1)}
                      </Link>
                    </Button>
                  )}
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredContent.map((item) => (
                  <Card key={item.id} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex justify-between items-start mb-2">
                        <CardTitle className="text-lg line-clamp-2 flex-1 min-h-[56px]">
                          {item.title}
                        </CardTitle>
                        {!item.isPublic && (
                          <Badge variant="secondary" className="ml-2 flex-shrink-0">
                            Private
                          </Badge>
                        )}
                      </div>
                      {item.summary && (
                        <CardDescription className="line-clamp-3">
                          {item.summary}
                        </CardDescription>
                      )}
                    </CardHeader>
                    <CardContent className="flex-grow flex flex-col">
                      <div className="space-y-4 flex-grow">
                        {/* Tags */}
                        {item.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 min-h-[32px]">
                            {item.tags.slice(0, 3).map((tag) => (
                              <Badge key={tag} variant="outline" className="text-xs">
                                <Tag className="h-3 w-3 mr-1" />
                                {tag}
                              </Badge>
                            ))}
                            {item.tags.length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{item.tags.length - 3} more
                              </Badge>
                            )}
                          </div>
                        )}

                        <div className="flex-grow"></div>

                        {/* Meta information */}
                        <div className="flex items-center justify-between text-sm text-muted-foreground min-h-[24px]">
                          <div className="flex items-center gap-1 flex-1 min-w-0">
                            <User className="h-3 w-3 flex-shrink-0" />
                            <span className="truncate">
                              {item.createdBy.name || item.createdBy.email}
                            </span>
                          </div>
                          <div className="flex items-center gap-1 flex-shrink-0 ml-2">
                            <Calendar className="h-3 w-3 flex-shrink-0" />
                            <span className="whitespace-nowrap">
                              {formatDate(item.createdAt)}
                            </span>
                          </div>
                        </div>
                      </div>

                      <Button asChild className="w-full mt-4">
                        <Link href={`/hub/${activeTab}/${item.slug || item.id}`}>
                          Read More
                        </Link>
                      </Button>
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
