import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

// GET /api/hub/stories/[slug] - Get a specific story
export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params

    if (!slug) {
      return Response.json(
        { success: false, error: 'Story slug is required' },
        { status: 400 }
      )
    }

    // Try to find by slug first, then by ID
    const story = await prisma.story.findFirst({
      where: {
        OR: [
          { id: slug } // Try by ID first since slug might not exist in schema
        ],
        isPublic: true // Only return public stories
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

    if (!story) {
      return Response.json(
        { success: false, error: 'Story not found' },
        { status: 404 }
      )
    }

    return Response.json(story)
  } catch (error) {
    console.error('Failed to fetch story:', error)
    return Response.json(
      { success: false, error: 'Failed to fetch story' },
      { status: 500 }
    )
  }
}