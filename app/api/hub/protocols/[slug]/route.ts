import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

// GET /api/hub/protocols/[slug] - Get a specific protocol
export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params

    if (!slug) {
      return Response.json(
        { success: false, error: 'Protocol slug is required' },
        { status: 400 }
      )
    }

    // Try to find by slug first, then by ID
    const protocol = await prisma.protocol.findFirst({
      where: {
        OR: [
          { id: slug }, // Try by ID first since slug might not exist in schema
        ],
        isPublic: true // Only return public protocols
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

    if (!protocol) {
      return Response.json(
        { success: false, error: 'Protocol not found' },
        { status: 404 }
      )
    }

    return Response.json(protocol)
  } catch (error) {
    console.error('Failed to fetch protocol:', error)
    return Response.json(
      { success: false, error: 'Failed to fetch protocol' },
      { status: 500 }
    )
  }
}