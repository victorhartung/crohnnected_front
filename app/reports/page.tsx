"use client";

import { useLanguage } from "@/components/language-provider";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Report } from "@/interfaces/report";
import { formatDate, getSeverityColor, getStatusColor } from "@/lib/utils";
import {
  AlertCircle,
  Calendar,
  FileText,
  Filter,
  Loader2,
  MapPin,
  Plus,
  Search,
} from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

type TabKey = "all" | "pending" | "approved" | "rejected";

type TabState = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  items: Report[];
  loading: boolean;
  error: string;
};

export default function ReportsPage() {
  const { t } = useLanguage();
  const { data: session, status } = useSession();

  const isPatient = session?.user?.role === "PATIENT";
  const isDoctor = session?.user?.role === "DOCTOR";
  const isNotResearcher = session?.user?.role !== "RESEARCHER";
  const canApprove =
    isDoctor ||
    session?.user?.role === "MODERATOR" ||
    session?.user?.role === "ADMIN";
  const params = useSearchParams();

  const [hasActiveReport, setHasActiveReport] = useState(false);

  const [activeTab, setActiveTab] = useState<TabKey>("all");
  const [tabs, setTabs] = useState<Record<TabKey, TabState>>({
    all: {
      page: 1,
      limit: 20,
      total: 0,
      totalPages: 1,
      items: [],
      loading: false,
      error: "",
    },
    pending: {
      page: 1,
      limit: 20,
      total: 0,
      totalPages: 1,
      items: [],
      loading: false,
      error: "",
    },
    approved: {
      page: 1,
      limit: 20,
      total: 0,
      totalPages: 1,
      items: [],
      loading: false,
      error: "",
    },
    rejected: {
      page: 1,
      limit: 20,
      total: 0,
      totalPages: 1,
      items: [],
      loading: false,
      error: "",
    },
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("all");
  const [selectedSeverity, setSelectedSeverity] = useState("all");

  const [countsLoading, setCountsLoading] = useState(false);
  const [countsError, setCountsError] = useState("");

  useEffect(() => {
    const checkActiveReport = async () => {
      if (session?.user?.role !== "PATIENT") {
        return;
      }

      try {
        const res = await fetch("/api/reports?limit=1");
        if (res.ok) {
          const data = await res.json();
          const activeReport = data?.data?.reports?.find(
            (report: Report) => report.status !== "REJECTED"
          );
          setHasActiveReport(!!activeReport);
        }
      } catch (error) {
        console.error("Error checking active report:", error);
      }
    };

    if (status === "authenticated") {
      checkActiveReport();
    }
  }, [session, status]);

  useEffect(() => {
    const statusParam = params?.get("status");
    if (statusParam) {
      const normalized = statusParam.toLowerCase();
      if (["all", "pending", "approved", "rejected"].includes(normalized)) {
        setActiveTab(normalized as TabKey);
      }
    }
  }, [params]);

  const uniqueCountries = useMemo(() => {
    const countries = new Set<string>();
    tabs.all.items.forEach((r) => {
      if (r.country) countries.add(r.country);
    });

    // Always include the currently selected country to prevent breaking the select
    if (selectedCountry !== "all" && selectedCountry) {
      countries.add(selectedCountry);
    }

    return Array.from(countries).sort();
  }, [tabs.all.items, selectedCountry]);

  // Busca counts agregados
  const fetchCounts = useCallback(async () => {
    setCountsLoading(true);
    setCountsError("");
    try {
      const params = new URLSearchParams();

      // Apply specific filters
      if (selectedCountry !== "all") params.set("country", selectedCountry);
      if (selectedSeverity !== "all") params.set("severity", selectedSeverity);

      // Use searchQuery parameter for general search
      if (searchQuery.trim()) {
        params.set("searchQuery", searchQuery.trim());
      }

      const res = await fetch(`/api/reports/counts?${params.toString()}`, {
        cache: "no-store",
      });
      const data = await res.json();

      if (!res.ok || !data?.success) {
        throw new Error(
          data?.error || data?.message || "Failed to load counts"
        );
      }

      setTabs((prev) => ({
        ...prev,
        all: {
          ...prev.all,
          total: data.data.all,
          totalPages: Math.max(
            1,
            Math.ceil((data.data.all ?? 0) / prev.all.limit)
          ),
        },
        pending: {
          ...prev.pending,
          total: data.data.pending,
          totalPages: Math.max(
            1,
            Math.ceil((data.data.pending ?? 0) / prev.pending.limit)
          ),
        },
        approved: {
          ...prev.approved,
          total: data.data.approved,
          totalPages: Math.max(
            1,
            Math.ceil((data.data.approved ?? 0) / prev.approved.limit)
          ),
        },
        rejected: {
          ...prev.rejected,
          total: data.data.rejected,
          totalPages: Math.max(
            1,
            Math.ceil((data.data.rejected ?? 0) / prev.rejected.limit)
          ),
        },
      }));

      setCountsLoading(false);
    } catch (err: any) {
      setCountsLoading(false);
      setCountsError(err?.message || "Unexpected error while loading counts");
    }
  }, [selectedCountry, selectedSeverity, searchQuery]);

  // Busca itens para a aba (com página/limit explícitos)
  const fetchTab = useCallback(
    async (tab: TabKey, opts?: { page?: number; limit?: number }) => {
      const targetPage = opts?.page ?? tabs[tab].page;
      const targetLimit = opts?.limit ?? tabs[tab].limit;

      setTabs((prev) => ({
        ...prev,
        [tab]: { ...prev[tab], loading: true, error: "" },
      }));

      try {
        const params = new URLSearchParams();
        params.set("page", String(targetPage));
        params.set("limit", String(targetLimit));

        // Set status filter based on tab
        if (tab === "pending") params.set("status", "PENDING");
        if (tab === "approved") params.set("status", "APPROVED");
        if (tab === "rejected") params.set("status", "REJECTED");

        // Apply specific filters
        if (selectedCountry !== "all") params.set("country", selectedCountry);
        if (selectedSeverity !== "all")
          params.set("severity", selectedSeverity);

        // Use searchQuery parameter for general search
        if (searchQuery.trim()) {
          params.set("searchQuery", searchQuery.trim());
        }

        if (!params.has("sortBy")) params.set("sortBy", "createdAt");
        if (!params.has("sortOrder")) params.set("sortOrder", "desc");

        const res = await fetch(`/api/reports?${params.toString()}`, {
          cache: "no-store",
        });
        const data = await res.json();
        if (!res.ok || !data?.success) {
          throw new Error(
            data?.error || data?.message || "Failed to load reports"
          );
        }

        setTabs((prev) => ({
          ...prev,
          [tab]: {
            ...prev[tab],
            items: data.data.reports ?? [],
            total: data.data.total ?? prev[tab].total, // mantém total vindo de counts se backend não devolver
            totalPages:
              data.data.totalPages ??
              Math.max(
                1,
                Math.ceil((data.data.total ?? prev[tab].total) / targetLimit)
              ),
            page: data.data.page ?? targetPage,
            limit: data.data.limit ?? targetLimit,
            loading: false,
            error: "",
          },
        }));
      } catch (err: any) {
        setTabs((prev) => ({
          ...prev,
          [tab]: {
            ...prev[tab],
            loading: false,
            error: err?.message || "Unexpected error",
          },
        }));
      }
    },
    [tabs, selectedCountry, selectedSeverity, searchQuery]
  );

  // Primeiro load: buscar counts e, depois, a aba ativa
  useEffect(() => {
    if (status === "authenticated") {
      (async () => {
        await fetchCounts();
        await fetchTab(activeTab, {
          page: tabs[activeTab].page,
          limit: tabs[activeTab].limit,
        });
      })();
    }
  }, [status]); // eslint-disable-line react-hooks/exhaustive-deps

  // Mudança de aba: buscar itens para a aba se ainda não foram carregados ou se a página mudou
  useEffect(() => {
    if (status === "authenticated" && tabs[activeTab].items.length === 0) {
      fetchTab(activeTab, {
        page: tabs[activeTab].page,
        limit: tabs[activeTab].limit,
      });
    }
  }, [activeTab]); // eslint-disable-line react-hooks/exhaustive-deps

  // Mudança de filtros: recarregar counts e resetar todas as abas para página 1, depois buscar itens da aba ativa
  useEffect(() => {
    if (status === "authenticated") {
      (async () => {
        // Reset all tabs to page 1 and clear items
        setTabs((prev) => ({
          all: { ...prev.all, page: 1, items: [] },
          pending: { ...prev.pending, page: 1, items: [] },
          approved: { ...prev.approved, page: 1, items: [] },
          rejected: { ...prev.rejected, page: 1, items: [] },
        }));

        // Fetch new counts with updated filters
        await fetchCounts();

        // Fetch items for active tab with page 1
        await fetchTab(activeTab, { page: 1, limit: tabs[activeTab].limit });
      })();
    }
  }, [searchQuery, selectedCountry, selectedSeverity]); // eslint-disable-line react-hooks/exhaustive-deps

  const setPage = (tab: TabKey, nextPage: number) => {
    setTabs((prev) => ({
      ...prev,
      [tab]: { ...prev[tab], page: nextPage },
    }));
    fetchTab(tab, { page: nextPage });
  };

  const handleApproveReport = async (reportId: string) => {
    try {
      const response = await fetch(`/api/reports/${reportId}/approve`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notes: "Approved by doctor" }),
      });

      if (!response.ok) {
        toast.error(t("reports.failedToApprove"));
        return;
      }

      toast.success(t("reports.reportApproved"));
      // Atualiza counts + listas relevantes
      await fetchCounts();
      fetchTab(activeTab, { page: tabs[activeTab].page });
      if (activeTab !== "approved")
        fetchTab("approved", { page: tabs.approved.page });
      if (activeTab !== "pending")
        fetchTab("pending", { page: tabs.pending.page });
      fetchTab("all", { page: tabs.all.page });
    } catch (error) {
      toast.error(t("reports.failedToApprove"));
      console.error("Approve report error:", error);
    }
  };

  const handleRejectReport = async (reportId: string, reason: string) => {
    try {
      const response = await fetch(`/api/reports/${reportId}/reject`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason }),
      });

      if (!response.ok) {
        toast.error(t("reports.failedToReject"));
        return;
      }

      toast.success("Report rejected");
      await fetchCounts();
      fetchTab(activeTab, { page: tabs[activeTab].page });
      if (activeTab !== "rejected")
        fetchTab("rejected", { page: tabs.rejected.page });
      if (activeTab !== "pending")
        fetchTab("pending", { page: tabs.pending.page });
      fetchTab("all", { page: tabs.all.page });
    } catch (error) {
      toast.error("Failed to reject report");
      console.error("Reject report error:", error);
    }
  };

  const statusCounts = {
    all: tabs.all.total,
    pending: tabs.pending.total,
    approved: tabs.approved.total,
    rejected: tabs.rejected.total,
  };

  if (status === "loading") {
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
          <AlertDescription>{t("auth.pleaseSignIn")}</AlertDescription>
        </Alert>
      </div>
    );
  }

  const current = tabs[activeTab];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">
              {isPatient ? t("reports.myReports") : t("reports.title")}
            </h1>
            <p className="text-muted-foreground">
              {isPatient
                ? t("reports.viewManageReports")
                : t("reports.reviewManageReports")}
            </p>
          </div>

          {/* Mostra botão apenas se não tiver report ATIVO (PENDING ou APPROVED) */}
          {isPatient && !hasActiveReport && (
            <Button asChild>
              <Link href="/reports/new">
                <Plus className="mr-2 h-4 w-4" />
                {t("reports.submitNew")}
              </Link>
            </Button>
          )}
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              {t("reports.filters")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-[200px]">
                <div className="relative">
                  <Search className="search-alignment" />
                  <Input
                    placeholder={t("reports.searchByLocation")}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <Select
                value={selectedCountry}
                onValueChange={setSelectedCountry}
              >
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder={t("reports.allCountries")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">
                    {t("reports.allCountries")}
                  </SelectItem>
                  {uniqueCountries.map((country) => (
                    <SelectItem key={country} value={country}>
                      {country}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={selectedSeverity}
                onValueChange={setSelectedSeverity}
              >
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder={t("reports.allSeverities")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">
                    {t("reports.allSeverities")}
                  </SelectItem>
                  <SelectItem value="MILD">{t("reports.severityMild")}</SelectItem>
                  <SelectItem value="MODERATE">
                    {t("reports.severityModerate")}
                  </SelectItem>
                  <SelectItem value="SEVERE">{t("reports.severitySevere")}</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant="default"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCountry("all");
                  setSelectedSeverity("all");
                }}
              >
                {t("reports.clearFilters")}
              </Button>
            </div>

            {countsLoading && (
              <div className="text-xs text-muted-foreground mt-2">
                {t("reports.updatingCounters")}
              </div>
            )}
            {countsError && (
              <div className="text-xs text-destructive mt-2">
                {t("reports.failedToLoadCounters")}: {countsError}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Status Tabs */}
        <Tabs
          value={activeTab}
          onValueChange={(v) => setActiveTab(v as TabKey)}
        >
          <TabsList>
            {isNotResearcher && (
              <TabsTrigger value="all">
                {t("reports.allReports")} ({statusCounts.all})
              </TabsTrigger>
            )}

            {isNotResearcher && (
              <TabsTrigger value="pending">
                {t("reports.pending")} ({statusCounts.pending})
              </TabsTrigger>
            )}

            <TabsTrigger value="approved">
              {t("reports.approved")} ({statusCounts.approved})
            </TabsTrigger>

            {isNotResearcher && (
              <TabsTrigger value="rejected">
                {t("reports.rejected")} ({statusCounts.rejected})
              </TabsTrigger>
            )}
          </TabsList>

          <TabsContent value={activeTab} className="space-y-4">
            {current.loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : current.error ? (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{current.error}</AlertDescription>
              </Alert>
            ) : current.items.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    {t("reports.noReportsFound")}
                  </p>
                  {isPatient && !hasActiveReport && (
                    <Button asChild className="mt-4">
                      <Link href="/reports/new">
                        {t("reports.createFirstReport")}
                      </Link>
                    </Button>
                  )}
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {current.items.map((report) => (
                  <Card key={report.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start font-semibold">
                        <div className="space-y-1">
                          <CardTitle className="text-lg">
                            {t("reports.reportNumber").replace(
                              "{number}",
                              report.id ? report.id.slice(-8) : "N/A"
                            )}
                          </CardTitle>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="h-4 w-4" />
                            {t("reports.submittedAt")}{" "}
                            {formatDate(report.createdAt, t)}
                            {report.ageAtReport && (
                              <>
                                • {t("reports.age")}: {report.ageAtReport}
                              </>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant={"none"}
                            className={getStatusColor(report.status)}
                          >
                            {t(`reports.${report.status.toLowerCase()}`)}
                          </Badge>
                          <Badge
                            variant={"none"}
                            className={getSeverityColor(report.symptomSeverity)}
                          >
                            {t(
                              `reports.${report.symptomSeverity.toLowerCase()}`
                            )}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1 font-semibold">
                              <MapPin className="h-4 w-4" />
                              {t("reports.location")}
                            </div>
                            <p className="text-sm">
                              {[report.city, report.state, report.country]
                                .filter(Boolean)
                                .join(", ")}
                            </p>
                          </div>
                          <div>
                            <div className="text-sm text-muted-foreground mb-1 font-semibold">
                              {t("reports.symptoms")}
                            </div>
                            <div className="flex flex-wrap gap-1">
                              {(report.symptoms || [])
                                .slice(0, 3)
                                .map((symptom) => (
                                  <Badge
                                    key={symptom}
                                    variant="outline"
                                    className="text-xs"
                                  >
                                    {symptom}
                                  </Badge>
                                ))}
                              {(report.symptoms || []).length > 3 && (
                                <Badge variant="outline" className="text-xs">
                                  +{(report.symptoms || []).length - 3}{" "}
                                  {t("common.more")}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>

                        {report.hasDocument && (
                          <div className="flex items-center gap-2 text-sm font-bold text-primary">
                            <FileText className="h-4 w-4" />
                            {t("reports.pdfAttached")}:{" "}
                            {report.documentOriginalName}
                          </div>
                        )}

                        <div className="flex justify-between items-center pt-4 border-t">
                          <div className="flex gap-2">
                            <Button variant="secondary" size="sm" asChild>
                              <Link href={`/reports/${report.id}`}>
                                {t("reports.viewDetails")}
                              </Link>
                            </Button>
                          </div>

                          {canApprove && report.status === "PENDING" && (
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                onClick={() => handleApproveReport(report.id)}
                              >
                                {t("reports.approveReport")}
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() =>
                                  handleRejectReport(
                                    report.id,
                                    t("reports.rejectedByDoctor")
                                  )
                                }
                              >
                                {t("reports.rejectReport")}
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {/* Paginação */}
                <div className="flex items-center justify-between pt-2">
                  <div className="text-sm text-muted-foreground">
                    {t("reports.page")
                      .replace("{current}", String(current.page))
                      .replace("{total}", String(current.totalPages))}{" "}
                    • {current.total} {t("common.total")}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="white"
                      size="sm"
                      disabled={current.page <= 1 || current.loading}
                      onClick={() => setPage(activeTab, current.page - 1)}
                    >
                      {t("reports.previous")}
                    </Button>
                    <Button
                      variant="white"
                      size="sm"
                      disabled={
                        current.page >= current.totalPages || current.loading
                      }
                      onClick={() => setPage(activeTab, current.page + 1)}
                    >
                      {t("reports.next")}
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
