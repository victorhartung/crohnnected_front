"use client";

import { useLanguage } from "@/components/language-provider";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatDate } from "@/lib/utils";
import {
  Activity,
  AlertCircle,
  BarChart3,
  Calendar,
  Eye,
  FileText,
  Loader2,
  MapPin,
  Plus,
  Settings,
  Shield,
  TrendingUp,
  Users,
} from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";

interface AdminStats {
  users: {
    total: number;
    patients: number;
    doctors: number;
    researchers: number;
    moderators: number;
    admins: number;
  };
  reports: {
    total: number;
    pending: number;
    approved: number;
    rejected: number;
  };
  hubContent: {
    articles: number;
    protocols: number;
    stories: number;
  };
  activity: {
    reportsThisWeek: number;
    newUsersThisWeek: number;
    contentThisWeek: number;
  };
}

interface RecentActivity {
  id: string;
  type:
    | "user_registered"
    | "report_submitted"
    | "report_approved"
    | "content_created";
  description: string;
  timestamp: string;
  user?: {
    name?: string;
    email: string;
  };
}

export default function AdminPage() {
  const { data: session, status } = useSession();
  const { t } = useLanguage();
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);

  const canAccess =
    session?.user?.role === "ADMIN" || session?.user?.role === "MODERATOR";

  useEffect(() => {
    if (canAccess) {
      loadDashboardData();
    }
  }, [canAccess]);

  const loadDashboardData = async () => {
    try {
      const [statsRes, activityRes] = await Promise.all([
        fetch("/api/admin/stats"),
        fetch("/api/admin/activity"),
      ]);

      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData);
      }

      if (activityRes.ok) {
        const activityData = await activityRes.json();
        setRecentActivity(activityData);
      }
    } catch (error) {
      console.error("Failed to load dashboard data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (status === "loading" || (canAccess && isLoading)) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{t("admin.signInRequired")}</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!canAccess) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{t("admin.accessDenied")}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold">{t("admin.title")}</h1>
            <p className="text-muted-foreground">{t("admin.description")}</p>
            <Badge variant={"account"} className="mt-2">
              {session?.user?.role}
            </Badge>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="white" asChild>
              <Link href="/reports">
                <FileText className="mr-2 h-4 w-4" />
                {t("admin.reviewReports")}
              </Link>
            </Button>
            <Button asChild>
              <Link href="/hub">
                <Plus className="mr-2 h-4 w-4" />
                {t("admin.createContent")}
              </Link>
            </Button>
          </div>
        </div>

        {/* Stats Overview */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between space-y-0 pb-2">
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {t("admin.totalUsers")}
                    </p>
                    <p className="text-2xl font-bold">{stats.users.total}</p>
                  </div>
                  <Users className="h-6 w-6 text-muted-foreground" />
                </div>
                <div className="text-xs text-muted-foreground">
                  +{stats.activity.newUsersThisWeek} {t("admin.thisWeek")}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between space-y-0 pb-2">
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {t("admin.totalReports")}
                    </p>
                    <p className="text-2xl font-bold">{stats.reports.total}</p>
                  </div>
                  <FileText className="h-6 w-6 text-muted-foreground" />
                </div>
                <div className="text-xs text-muted-foreground">
                  +{stats.activity.reportsThisWeek} {t("admin.thisWeek")}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between space-y-0 pb-2">
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {t("admin.pendingReports")}
                    </p>
                    <p className="text-2xl font-bold">
                      {stats.reports.pending}
                    </p>
                  </div>
                  <Activity className="h-6 w-6 text-muted-foreground" />
                </div>
                <div className="text-xs text-muted-foreground">
                  {t("admin.requireAttention")}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between space-y-0 pb-2">
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {t("admin.hubContent")}
                    </p>
                    <p className="text-2xl font-bold">
                      {stats.hubContent.articles +
                        stats.hubContent.protocols +
                        stats.hubContent.stories}
                    </p>
                  </div>
                  <BarChart3 className="h-6 w-6 text-muted-foreground" />
                </div>
                <div className="text-xs text-muted-foreground">
                  +{stats.activity.contentThisWeek} {t("admin.thisWeek")}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">{t("admin.overview")}</TabsTrigger>
            <TabsTrigger value="users">{t("admin.users")}</TabsTrigger>
            <TabsTrigger value="content">{t("admin.content")}</TabsTrigger>
            <TabsTrigger value="reports">{t("admin.reportsTab")}</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    {t("admin.recentActivity")}
                  </CardTitle>
                  <CardDescription>{t("admin.latestActivity")}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivity.length === 0 ? (
                      <p className="text-sm text-muted-foreground text-center py-4">
                        {t("admin.noRecentActivity")}
                      </p>
                    ) : (
                      recentActivity.slice(0, 5).map((activity) => (
                        <div
                          key={activity.id}
                          className="flex items-start space-x-3"
                        >
                          <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
                          <div className="flex-1 space-y-1">
                            <p className="text-sm">{activity.description}</p>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <Calendar className="h-3 w-3" />
                              {formatDate(activity.timestamp, t)}
                              {activity.user && (
                                <>
                                  • {activity.user.name || activity.user.email}
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    {t("admin.quickActions")}
                  </CardTitle>
                  <CardDescription>{t("admin.commonTasks")}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 gap-3">
                    <Button
                      variant="whiteline"
                      className="justify-start"
                      asChild
                    >
                      <Link href="/reports?status=pending">
                        <Eye className="mr-2 h-4 w-4" />
                        {t("admin.reviewPendingReports")}
                        {stats && stats.reports.pending > 0 && (
                          <Badge variant="destructive" className="ml-auto">
                            {stats.reports.pending}
                          </Badge>
                        )}
                      </Link>
                    </Button>

                    <Button
                      variant="whiteline"
                      className="justify-start"
                      asChild
                    >
                      <Link href="/hub/articles/new">
                        <Plus className="mr-2 h-4 w-4" />
                        {t("admin.createNewArticle")}
                      </Link>
                    </Button>

                    <Button
                      variant="whiteline"
                      className="justify-start"
                      asChild
                    >
                      <Link href="/hub/protocols/new">
                        <Plus className="mr-2 h-4 w-4" />
                        {t("admin.createNewProtocol")}
                      </Link>
                    </Button>

                    <Button
                      variant="whiteline"
                      className="justify-start"
                      asChild
                    >
                      <Link href="/map">
                        <MapPin className="mr-2 h-4 w-4" />
                        {t("admin.viewGeographicData")}
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="users" className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {stats &&
                Object.entries(stats.users).map(
                  ([role, count]) =>
                    role !== "total" && (
                      <Card key={role}>
                        <CardContent className="pt-6">
                          <div className="text-center">
                            <p className="text-2xl font-bold">{count}</p>
                            <p className="text-sm text-muted-foreground capitalize">
                              {role}
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    )
                )}
            </div>
          </TabsContent>

          <TabsContent value="content" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    {t("admin.articles")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-2xl font-bold text-center">
                      {stats?.hubContent.articles || 0}
                    </div>
                    <div className="space-y-2">
                      <Button size="sm" asChild className="w-full">
                        <Link href="/hub/articles/new">
                          <Plus className="mr-2 h-4 w-4" />
                          {t("admin.newArticle")}
                        </Link>
                      </Button>
                      <Button
                        size="sm"
                        variant="whiteline"
                        asChild
                        className="w-full"
                      >
                        <Link href="/hub?tab=articles">
                          <Eye className="mr-2 h-4 w-4" />
                          {t("admin.manageArticles")}
                        </Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    {t("admin.protocols")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-2xl font-bold text-center">
                      {stats?.hubContent.protocols || 0}
                    </div>
                    <div className="space-y-2">
                      <Button size="sm" asChild className="w-full">
                        <Link href="/hub/protocols/new">
                          <Plus className="mr-2 h-4 w-4" />
                          {t("admin.newProtocol")}
                        </Link>
                      </Button>
                      <Button
                        size="sm"
                        variant="whiteline"
                        asChild
                        className="w-full"
                      >
                        <Link href="/hub?tab=protocols">
                          <Eye className="mr-2 h-4 w-4" />
                          {t("admin.manageProtocols")}
                        </Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    {t("admin.stories")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-2xl font-bold text-center">
                      {stats?.hubContent.stories || 0}
                    </div>
                    <div className="space-y-2">
                      <Button size="sm" asChild className="w-full">
                        <Link href="/hub/stories/new">
                          <Plus className="mr-2 h-4 w-4" />
                          {t("admin.newStory")}
                        </Link>
                      </Button>
                      <Button
                        size="sm"
                        variant="whiteline"
                        asChild
                        className="w-full"
                      >
                        <Link href="/hub?tab=stories">
                          <Eye className="mr-2 h-4 w-4" />
                          {t("admin.manageStories")}
                        </Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="reports" className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {stats &&
                Object.entries(stats.reports).map(([status, count]) => {
                  const getStatusLabel = (status: string) => {
                    if (status === "total") return t("admin.total");
                    if (status === "pending") return t("reports.pending");
                    if (status === "approved") return t("reports.approved");
                    if (status === "rejected") return t("reports.rejected");
                    return status;
                  };

                  return (
                    <Card key={status}>
                      <CardContent className="pt-6">
                        <div className="text-center">
                          <p className="text-2xl font-bold">{count}</p>
                          <p className="text-sm text-muted-foreground capitalize">
                            {getStatusLabel(status)}
                          </p>
                        </div>
                        {status !== "total" && (
                          <Button
                            size="sm"
                            variant="whiteline"
                            className="w-full mt-3 h-auto whitespace-normal text-center leading-tight px-3 py-2 break-words"
                            asChild
                          >
                            <Link
                              href={`/reports${
                                status !== "total" ? `?status=${status}` : ""
                              }`}
                              className="block w-full whitespace-normal break-words text-center"
                            >
                              {t("reports.viewReports")} {getStatusLabel(status)}
                            </Link>
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
