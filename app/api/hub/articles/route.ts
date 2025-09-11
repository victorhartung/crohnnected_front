
import { NextRequest } from 'next/server'
import { withAuth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { createArticleSchema } from '@/lib/validation'
import { UserRole } from '@prisma/client'

export const dynamic = 'force-dynamic'

// GET /api/hub/articles - List articles
export const GET = async (request: NextRequest) => {
  try {
    const url = new URL(request.url)
    const isPublicOnly = !await isAuthenticated(request)
    
    const articles = await prisma.article.findMany({
      where: isPublicOnly ? { isPublic: true } : {},
      include: {
        createdBy: {
          select: {
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return Response.json(articles)
  } catch (error) {
    console.error('Failed to fetch articles:', error)
    return Response.json(
      { success: false, error: 'Failed to fetch articles' },
      { status: 500 }
    )
  }
}

// POST /api/hub/articles - Create article
export const POST = withAuth(async (request: NextRequest, user: any) => {
  // Only moderators, admins, and doctors can create articles
  if (!['MODERATOR', 'ADMIN', 'DOCTOR'].includes(user.role)) {
    return Response.json(
      { success: false, error: 'Insufficient permissions' },
      { status: 403 }
    )
  }

  try {
    const body = await request.json()
    const validatedData = createArticleSchema.parse(body)

    // Generate slug from title if not provided
    const slug = validatedData.slug || generateSlug(validatedData.title)

    // Check if slug already exists
    const existingArticle = await prisma.article.findUnique({
      where: { slug },
    })

    if (existingArticle) {
      return Response.json(
        { success: false, error: 'Article with this slug already exists' },
        { status: 400 }
      )
    }

    const article = await prisma.article.create({
      data: {
        ...validatedData,
        slug,
        createdById: user.id,
      },
      include: {
        createdBy: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    })

    return Response.json({ success: true, data: article }, { status: 201 })
  } catch (error) {
    console.error('Failed to create article:', error)
    return Response.json(
      { success: false, error: 'Failed to create article' },
      { status: 500 }
    )
  }
}, ['MODERATOR', 'ADMIN', 'DOCTOR'])

async function isAuthenticated(request: NextRequest): Promise<boolean> {
  try {
    // Simple check for authentication - in a real app you'd verify the session
    const authHeader = request.headers.get('authorization')
    return !!authHeader
  } catch {
    return false
  }
}

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 100)
}
