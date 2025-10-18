import { withAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { UserRole } from "@prisma/client";
import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

// GET /api/admin/stats - Get platform statistics
export const GET = withAuth(
  async (request: NextRequest, user: any) => {
    try {
      // Get user counts by role
      const userCounts = await prisma.user.groupBy({
        by: ["role"],
        _count: {
          id: true,
        },
      });

      const users = {
        total: 0,
        patients: 0,
        doctors: 0,
        researchers: 0,
        moderators: 0,
        admins: 0,
      };

      userCounts.forEach(({ role, _count }) => {
        users.total += _count.id;
        users[(role.toLowerCase() + "s") as keyof typeof users] = _count.id;
      });

      // Get report counts by status
      const reportCounts = await prisma.report.groupBy({
        by: ["status"],
        _count: {
          id: true,
        },
      });

      const reports = {
        total: 0,
        pending: 0,
        approved: 0,
        rejected: 0,
      };

      reportCounts.forEach(({ status, _count }) => {
        reports.total += _count.id;
        reports[status.toLowerCase() as keyof typeof reports] = _count.id;
      });

      // Get hub content counts
      const [articleCount, protocolCount, storyCount] = await Promise.all([
        prisma.article.count(),
        prisma.protocol.count(),
        prisma.story.count(),
      ]);

      const hubContent = {
        articles: articleCount,
        protocols: protocolCount,
        stories: storyCount,
      };

      // Get weekly activity stats
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

      const [
        reportsThisWeek,
        newUsersThisWeek,
        articlesThisWeek,
        protocolsThisWeek,
        storiesThisWeek,
      ] = await Promise.all([
        prisma.report.count({
          where: {
            createdAt: {
              gte: oneWeekAgo,
            },
          },
        }),
        prisma.user.count({
          where: {
            createdAt: {
              gte: oneWeekAgo,
            },
          },
        }),
        prisma.article.count({
          where: {
            createdAt: {
              gte: oneWeekAgo,
            },
          },
        }),
        prisma.protocol.count({
          where: {
            createdAt: {
              gte: oneWeekAgo,
            },
          },
        }),
        prisma.story.count({
          where: {
            createdAt: {
              gte: oneWeekAgo,
            },
          },
        }),
      ]);

      const activity = {
        reportsThisWeek,
        newUsersThisWeek,
        contentThisWeek: articlesThisWeek + protocolsThisWeek + storiesThisWeek,
      };

      return Response.json({
        users,
        reports,
        hubContent,
        activity,
      });
    } catch (error) {
      console.error("Failed to fetch admin stats:", error);
      return Response.json(
        { success: false, error: "Falha ao buscar estatísticas" },
        { status: 500 }
      );
    }
  },
  [UserRole.ADMIN, UserRole.MODERATOR]
);
