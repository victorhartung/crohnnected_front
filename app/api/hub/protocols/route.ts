
import { NextRequest } from 'next/server'
import { withAuth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { createProtocolSchema } from '@/lib/validation'

export const dynamic = 'force-dynamic'

// GET /api/hub/protocols - List protocols
export const GET = async (request: NextRequest) => {
  try {
    const isPublicOnly = !await isAuthenticated(request)
    
    const protocols = await prisma.protocol.findMany({
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

    return Response.json(protocols)
  } catch (error) {
    console.error('Failed to fetch protocols:', error)
    return Response.json(
      { success: false, error: 'Failed to fetch protocols' },
      { status: 500 }
    )
  }
}

// POST /api/hub/protocols - Create protocol
export const POST = withAuth(async (request: NextRequest, user: any) => {
  if (!['MODERATOR', 'ADMIN', 'DOCTOR'].includes(user.role)) {
    return Response.json(
      { success: false, error: 'Insufficient permissions' },
      { status: 403 }
    )
  }

  try {
    const body = await request.json()
    const validatedData = createProtocolSchema.parse(body)

    const slug = validatedData.slug || generateSlug(validatedData.title)

    const existingProtocol = await prisma.protocol.findUnique({
      where: { slug },
    })

    if (existingProtocol) {
      return Response.json(
        { success: false, error: 'Protocol with this slug already exists' },
        { status: 400 }
      )
    }

    const protocol = await prisma.protocol.create({
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

    return Response.json({ success: true, data: protocol }, { status: 201 })
  } catch (error) {
    console.error('Failed to create protocol:', error)
    return Response.json(
      { success: false, error: 'Failed to create protocol' },
      { status: 500 }
    )
  }
}, ['MODERATOR', 'ADMIN', 'DOCTOR'])

async function isAuthenticated(request: NextRequest): Promise<boolean> {
  try {
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
