import { authOptions, withAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createStorySchema } from "@/lib/validation";
import { getServerSession } from "next-auth";
import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

// GET /api/hub/stories/[slug] - Get a specific story
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

    // Check if the requester has a session: authenticated users may view non-public stories
    const session = await getServerSession(authOptions as any);
    const includePrivate = !!session;

    // Find by id (stories do not have a slug column in the schema)
    const story = await prisma.story.findFirst({
      where: {
        OR: [{ id: slug }],
        ...(includePrivate ? {} : { isPublic: true }),
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

    if (!story) {
      return Response.json(
        { success: false, error: "História não encontrada" },
        { status: 404 }
      );
    }

    return Response.json(story);
  } catch (error) {
    console.error("Failed to fetch story:", error);
    return Response.json(
      { success: false, error: "Falha ao buscar história" },
      { status: 500 }
    );
  }
}

// PATCH /api/hub/stories/[slug] - Update a story (owner or admin/moderator)
export const PATCH = withAuth(
  async (request: NextRequest, user: any, context: any) => {
    try {
      const slug = context?.params?.slug;

      if (!slug) {
        return Response.json(
          { success: false, error: "Identificador da história é obrigatório" },
          { status: 400 }
        );
      }

      const body = await request.json();
      const validated = createStorySchema(() => "").parse(body);

      // Find story by id or slug
      const existing = await prisma.story.findFirst({
        where: { OR: [{ id: slug }] },
      });

      if (!existing) {
        return Response.json(
          { success: false, error: "História não encontrada" },
          { status: 404 }
        );
      }

      // Authorization: owner or moderator/admin
      const allowedRoles = ["ADMIN", "MODERATOR"];
      if (
        existing.createdById !== user.id &&
        !allowedRoles.includes(user.role)
      ) {
        return Response.json(
          { success: false, error: "Forbidden" },
          { status: 403 }
        );
      }

      const updated = await prisma.story.update({
        where: { id: existing.id },
        data: {
          title: validated.title,
          summary: validated.summary ?? null,
          content: validated.content,
          tags: validated.tags ? validated.tags : undefined,
          isPublic: validated.isPublic ?? existing.isPublic,
        },
        include: {
          createdBy: { select: { name: true, email: true } },
        },
      });

      return Response.json({ success: true, data: updated });
    } catch (error) {
      console.error("Failed to update story:", error);
      return Response.json(
        { success: false, error: "Falha ao atualizar história" },
        { status: 500 }
      );
    }
  },
  ["PATIENT", "MODERATOR", "ADMIN", "DOCTOR"]
);
