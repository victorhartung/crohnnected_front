import { NextRequest } from "next/server";
import { withAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// GET /api/hub/protocols/[slug] - Get a specific protocol
export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;

    if (!slug) {
      return Response.json(
        { success: false, error: "Slug é obrigatório" },
        { status: 400 }
      );
    }

    const isAuthenticated = await checkAuthentication(request);

    // Try to find by slug first, then by ID
    const protocol = await prisma.protocol.findFirst({
      where: {
        OR: [{ slug: slug }, { id: slug }],
        ...(isAuthenticated ? {} : { isPublic: true }),
      },
      include: {
        createdBy: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    if (!protocol) {
      return Response.json(
        { success: false, error: "Protocolo não encontrado" },
        { status: 404 }
      );
    }

    return Response.json(protocol);
  } catch (error) {
    console.error("Failed to fetch protocol:", error);
    return Response.json(
      { success: false, error: "Falha ao buscar protocolo" },
      { status: 500 }
    );
  }
}

export const PUT = withAuth(
  async (
    request: NextRequest,
    user: any,
    { params }: { params: { slug: string } }
  ) => {
    if (!["MODERATOR", "ADMIN", "DOCTOR"].includes(user.role)) {
      return Response.json(
        { success: false, error: "Permissão insuficiente" },
        { status: 403 }
      );
    }

    try {
      const { slug } = params;
      const body = await request.json();

      const existingProtocol = await prisma.protocol.findFirst({
        where: {
          OR: [{ slug: slug }, { id: slug }],
        },
      });

      if (!existingProtocol) {
        return Response.json(
          { success: false, error: "Protocolo não encontrado" },
          { status: 404 }
        );
      }

      if (existingProtocol.createdById !== user.id && user.role !== "ADMIN") {
        return Response.json(
          {
            success: false,
            error: "Você pode editar apenas os seus próprios protocolos",
          },
          { status: 403 }
        );
      }

      const newSlug = body.slug || generateSlug(body.title);

      if (newSlug !== existingProtocol.slug) {
        const slugConflict = await prisma.protocol.findUnique({
          where: { slug: newSlug },
        });

        if (slugConflict) {
          return Response.json(
            { success: false, error: "Protocolo já existe com este slug" },
            { status: 400 }
          );
        }
      }

      const updatedProtocol = await prisma.protocol.update({
        where: { id: existingProtocol.id },
        data: {
          title: body.title,
          slug: newSlug,
          summary: body.summary,
          content: body.content,
          tags: body.tags,
          isPublic: body.isPublic,
        },
        include: {
          createdBy: {
            select: {
              name: true,
              email: true,
            },
          },
        },
      });

      return Response.json({
        success: true,
        data: updatedProtocol,
      });
    } catch (error) {
      console.error("Failed to update protocol:", error);
      return Response.json(
        { success: false, error: "Falha ao atualizar protocolo" },
        { status: 500 }
      );
    }
  },
  ["MODERATOR", "ADMIN", "DOCTOR"]
);

async function checkAuthentication(request: NextRequest): Promise<boolean> {
  try {
    const authHeader = request.headers.get("authorization");
    const cookieHeader = request.headers.get("cookie");
    return !!(
      authHeader ||
      (cookieHeader && cookieHeader.includes("next-auth.session-token"))
    );
  } catch {
    return false;
  }
}

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .substring(0, 100);
}
