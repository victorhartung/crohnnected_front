"use client";

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

interface Report {
  id: string;
  ageAtReport?: number;
  sex?: string;
  country: string;
  state?: string;
  city?: string;
  symptoms: string[];
  symptomSeverity: string;
  medications?: string[];
  status: "PENDING" | "APPROVED" | "REJECTED";
  createdAt: string;
  approvedAt?: string;
  approvedBy?: {
    name?: string;
    email: string;
  };
  rejectionReason?: string;
  hasDocument: boolean;
  documentOriginalName?: string;
  documentSizeBytes?: number;
  notes?: string;
}

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
  const { data: session, status } = useSession();

  const isPatient = session?.user?.role === "PATIENT";
  const isDoctor = session?.user?.role === "DOCTOR";
  const isNotResearcher = session?.user?.role !== "RESEARCHER";
  const canApprove =
    isDoctor ||
    session?.user?.role === "MODERATOR" ||
    session?.user?.role === "ADMIN";
  const params = useSearchParams();

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
    return Array.from(countries).sort();
  }, [tabs.all.items]);

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
      const data = await response.json();

      if (!response.ok) {
        toast.error(data?.message || "Failed to approve report");
        return;
      }

      toast.success("Report approved successfully");
      // Atualiza counts + listas relevantes
      await fetchCounts();
      fetchTab(activeTab, { page: tabs[activeTab].page });
      if (activeTab !== "approved")
        fetchTab("approved", { page: tabs.approved.page });
      if (activeTab !== "pending")
        fetchTab("pending", { page: tabs.pending.page });
      fetchTab("all", { page: tabs.all.page });
    } catch (error) {
      toast.error("Failed to approve report");
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
      const data = await response.json();

      if (!response.ok) {
        toast.error(data?.message || "Failed to reject report");
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
          <AlertDescription>Please sign in to view reports.</AlertDescription>
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
              {isPatient ? "My Reports" : "Reports"}
            </h1>
            <p className="text-muted-foreground">
              {isPatient
                ? "View and manage your submitted reports"
                : "Review and manage patient reports"}
            </p>
          </div>

          {isPatient && (
            <Button asChild>
              <Link href="/reports/new">
                <Plus className="mr-2 h-4 w-4" />
                New Report
              </Link>
            </Button>
          )}
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-[200px]">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by location, symptoms, medications..."
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
                  <SelectValue placeholder="All Countries" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Countries</SelectItem>
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
                  <SelectValue placeholder="All Severities" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Severities</SelectItem>
                  <SelectItem value="MILD">Mild</SelectItem>
                  <SelectItem value="MODERATE">Moderate</SelectItem>
                  <SelectItem value="SEVERE">Severe</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCountry("all");
                  setSelectedSeverity("all");
                }}
              >
                Clear Filters
              </Button>
            </div>

            {countsLoading && (
              <div className="text-xs text-muted-foreground mt-2">
                Updating counters…
              </div>
            )}
            {countsError && (
              <div className="text-xs text-destructive mt-2">
                Failed to load counters: {countsError}
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
              <TabsTrigger value="all">All ({statusCounts.all})</TabsTrigger>
            )}

            {isNotResearcher && (
              <TabsTrigger value="pending">
                Pending ({statusCounts.pending})
              </TabsTrigger>
            )}

            <TabsTrigger value="approved">
              Approved ({statusCounts.approved})
            </TabsTrigger>

            {isNotResearcher && (
              <TabsTrigger value="rejected">
                Rejected ({statusCounts.rejected})
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
                  <p className="text-muted-foreground">No reports found.</p>
                  {isPatient && (
                    <Button asChild className="mt-4">
                      <Link href="/reports/new">Submit your first report</Link>
                    </Button>
                  )}
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {current.items.map((report) => (
                  <Card key={report.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                          <CardTitle className="text-lg">
                            Report #{report.id ? report.id.slice(-8) : "N/A"}
                          </CardTitle>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="h-4 w-4" />
                            Submitted {formatDate(report.createdAt)}
                            {report.ageAtReport && (
                              <>• Age: {report.ageAtReport}</>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={getStatusColor(report.status)}>
                            {report.status}
                          </Badge>
                          <Badge
                            className={getSeverityColor(report.symptomSeverity)}
                          >
                            {report.symptomSeverity}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                              <MapPin className="h-4 w-4" />
                              Location
                            </div>
                            <p className="text-sm">
                              {[report.city, report.state, report.country]
                                .filter(Boolean)
                                .join(", ")}
                            </p>
                          </div>
                          <div>
                            <div className="text-sm text-muted-foreground mb-1">
                              Symptoms
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
                                  +{(report.symptoms || []).length - 3} more
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>

                        {report.hasDocument && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <FileText className="h-4 w-4" />
                            PDF attached: {report.documentOriginalName}
                          </div>
                        )}

                        <div className="flex justify-between items-center pt-4 border-t">
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" asChild>
                              <Link href={`/reports/${report.id}`}>
                                View Details
                              </Link>
                            </Button>
                          </div>

                          {canApprove && report.status === "PENDING" && (
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                onClick={() => handleApproveReport(report.id)}
                              >
                                Approve
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() =>
                                  handleRejectReport(
                                    report.id,
                                    "Rejected by doctor"
                                  )
                                }
                              >
                                Reject
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
                    Page {current.page} of {current.totalPages} •{" "}
                    {current.total} total
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={current.page <= 1 || current.loading}
                      onClick={() => setPage(activeTab, current.page - 1)}
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={
                        current.page >= current.totalPages || current.loading
                      }
                      onClick={() => setPage(activeTab, current.page + 1)}
                    >
                      Next
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
