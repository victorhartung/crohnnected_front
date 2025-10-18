import { withAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createStorySchema } from "@/lib/validation";
import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

// GET /api/hub/stories - List stories
export const GET = async (request: NextRequest) => {
  try {
    const isPublicOnly = !(await isAuthenticated(request));

    const stories = await prisma.story.findMany({
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
        createdAt: "desc",
      },
    });

    return Response.json(stories);
  } catch (error) {
    console.error("Failed to fetch stories:", error);
    return Response.json(
      { success: false, error: "Falha ao buscar histórias" },
      { status: 500 }
    );
  }
};

// POST /api/hub/stories - Create story
export const POST = withAuth(
  async (request: NextRequest, user: any) => {
    // Allow patients to create stories in addition to moderators, admins, and doctors
    if (!["PATIENT", "MODERATOR", "ADMIN", "DOCTOR"].includes(user.role)) {
      return Response.json(
        { success: false, error: "Permissão insuficiente" },
        { status: 403 }
      );
    }

    try {
      const body = await request.json();
      const validatedData = createStorySchema(() => "").parse(body);

      const story = await prisma.story.create({
        data: {
          ...validatedData,
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
      });

      return Response.json({ success: true, data: story }, { status: 201 });
    } catch (error) {
      console.error("Failed to create story:", error);
      return Response.json(
        { success: false, error: "Falha ao criar história" },
        { status: 500 }
      );
    }
  },
  ["PATIENT", "MODERATOR", "ADMIN", "DOCTOR"]
);

async function isAuthenticated(request: NextRequest): Promise<boolean> {
  try {
    const authHeader = request.headers.get("authorization");
    return !!authHeader;
  } catch {
    return false;
  }
}
