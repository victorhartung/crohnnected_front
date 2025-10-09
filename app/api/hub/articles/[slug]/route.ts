import { NextRequest } from 'next/server'
import { withAuth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

// GET /api/hub/articles/[slug] - Get a specific article
export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params

    if (!slug) {
      return Response.json(
        { success: false, error: 'Article slug is required' },
        { status: 400 }
      )
    }

    const isAuthenticated = await checkAuthentication(request)

    // Try to find by slug first, then by ID
    const article = await prisma.article.findFirst({
      where: {
        OR: [
          { slug: slug },
          { id: slug }
        ],
        ...(isAuthenticated ? {} : { isPublic: true })
      },
      include: {
        createdBy: {
          select: {
            name: true,
            email: true
          }
        }
      }
    })

    if (!article) {
      return Response.json(
        { success: false, error: 'Article not found' },
        { status: 404 }
      )
    }

    return Response.json(article)
  } catch (error) {
    console.error('Failed to fetch article:', error)
    return Response.json(
      { success: false, error: 'Failed to fetch article' },
      { status: 500 }
    )
  }
}

export const PUT = withAuth(async (request: NextRequest, user: any, { params }: { params: { slug: string } }) => {
  if (!['MODERATOR', 'ADMIN', 'DOCTOR'].includes(user.role)) {
    return Response.json(
      { success: false, error: 'Insufficient permissions' },
      { status: 403 }
    )
  }

  try {
    const { slug } = params
    const body = await request.json()

    const existingArticle = await prisma.article.findFirst({
      where: {
        OR: [
          { slug: slug },
          { id: slug }
        ]
      }
    })

    if (!existingArticle) {
      return Response.json(
        { success: false, error: 'Article not found' },
        { status: 404 }
      )
    }

    if (existingArticle.createdById !== user.id && user.role !== 'ADMIN') {
      return Response.json(
        { success: false, error: 'You can only edit your own articles' },
        { status: 403 }
      )
    }

    const newSlug = body.slug

    if (newSlug !== existingArticle.slug) {
      const slugConflict = await prisma.article.findUnique({
        where: { slug: newSlug }
      })

      if (slugConflict) {
        return Response.json(
          { success: false, error: 'Article with this slug already exists' },
          { status: 400 }
        )
      }
    }

    const updatedArticle = await prisma.article.update({
      where: { id: existingArticle.id },
      data: {
        title: body.title,
        slug: newSlug,
        summary: body.summary,
        content: body.content,
        tags: body.tags,
        isPublic: body.isPublic
      },
      include: {
        createdBy: {
          select: {
            name: true,
            email: true
          }
        }
      }
    })

    return Response.json({ 
      success: true, 
      data: updatedArticle 
    })
  } catch (error) {
    console.error('Failed to update article:', error)
    return Response.json(
      { success: false, error: 'Failed to update article' },
      { status: 500 }
    )
  }
}, ['MODERATOR', 'ADMIN', 'DOCTOR'])

async function checkAuthentication(request: NextRequest): Promise<boolean> {
  try {
    const authHeader = request.headers.get('authorization')
    const cookieHeader = request.headers.get('cookie')
    return !!(authHeader || (cookieHeader && cookieHeader.includes('next-auth.session-token')))
  } catch {
    return false
  }
}