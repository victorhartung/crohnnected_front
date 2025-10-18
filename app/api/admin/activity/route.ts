import { NextRequest } from "next/server";
import { withAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { UserRole } from "@prisma/client";

export const dynamic = "force-dynamic";

// GET /api/admin/activity - Get recent platform activity
export const GET = withAuth(
  async (request: NextRequest, user: any) => {
    try {
      // Get recent activities from audit log if available, otherwise simulate
      const recentActivity: Array<{
        id: string;
        type:
          | "user_registered"
          | "report_submitted"
          | "report_approved"
          | "content_created";
        description: string;
        timestamp: string;
        user?: {
          name?: string | null;
          email: string;
        };
      }> = [];

      // Get recent users
      const recentUsers = await prisma.user.findMany({
        take: 5,
        orderBy: {
          createdAt: "desc",
        },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
        },
      });

      recentUsers.forEach((user) => {
        recentActivity.push({
          id: `user_${user.id}`,
          type: "user_registered" as const,
          description: `New ${user.role.toLowerCase()} registered`,
          timestamp: user.createdAt.toISOString(),
          user: {
            name: user.name,
            email: user.email,
          },
        });
      });

      // Get recent reports
      const recentReports = await prisma.report.findMany({
        take: 5,
        orderBy: {
          createdAt: "desc",
        },
        include: {
          patient: {
            select: {
              name: true,
              email: true,
            },
          },
        },
      });

      recentReports.forEach((report) => {
        recentActivity.push({
          id: `report_${report.id}`,
          type: "report_submitted" as const,
          description: `Novo relatório submetido`,
          timestamp: report.createdAt.toISOString(),
          user: {
            name: report.patient.name,
            email: report.patient.email,
          },
        });

        if (report.approvedAt) {
          recentActivity.push({
            id: `report_approved_${report.id}`,
            type: "report_approved" as const,
            description: `Relatório aprovado`,
            timestamp: report.approvedAt.toISOString(),
          });
        }
      });

      // Get recent content
      const [recentArticles, recentProtocols, recentStories] =
        await Promise.all([
          prisma.article.findMany({
            take: 3,
            orderBy: { createdAt: "desc" },
            include: {
              createdBy: {
                select: { name: true, email: true },
              },
            },
          }),
          prisma.protocol.findMany({
            take: 3,
            orderBy: { createdAt: "desc" },
            include: {
              createdBy: {
                select: { name: true, email: true },
              },
            },
          }),
          prisma.story.findMany({
            take: 3,
            orderBy: { createdAt: "desc" },
            include: {
              createdBy: {
                select: { name: true, email: true },
              },
            },
          }),
        ]);

      recentArticles.forEach((article) => {
        recentActivity.push({
          id: `article_${article.id}`,
          type: "content_created" as const,
          description: `Novo artigo: ${article.title}`,
          timestamp: article.createdAt.toISOString(),
          user: {
            name: article.createdBy.name,
            email: article.createdBy.email,
          },
        });
      });

      recentProtocols.forEach((protocol) => {
        recentActivity.push({
          id: `protocol_${protocol.id}`,
          type: "content_created" as const,
          description: `Novo protocolo: ${protocol.title}`,
          timestamp: protocol.createdAt.toISOString(),
          user: {
            name: protocol.createdBy.name,
            email: protocol.createdBy.email,
          },
        });
      });

      recentStories.forEach((story) => {
        recentActivity.push({
          id: `story_${story.id}`,
          type: "content_created" as const,
          description: `Nova história: ${story.title}`,
          timestamp: story.createdAt.toISOString(),
          user: {
            name: story.createdBy.name,
            email: story.createdBy.email,
          },
        });
      });

      // Sort by timestamp descending and limit
      const sortedActivity = recentActivity
        .sort(
          (a, b) =>
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        )
        .slice(0, 10);

      return Response.json(sortedActivity);
    } catch (error) {
      console.error("Failed to fetch admin activity:", error);
      return Response.json(
        { success: false, error: "Falha ao buscar atividades" },
        { status: 500 }
      );
    }
  },
  [UserRole.ADMIN, UserRole.MODERATOR]
);
