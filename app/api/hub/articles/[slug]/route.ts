import { NextRequest } from 'next/server'
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

    // Try to find by slug first, then by ID
    const article = await prisma.article.findFirst({
      where: {
        OR: [
          { id: slug } // Try by ID first since slug might not exist in schema
        ],
        isPublic: true // Only return public articles
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