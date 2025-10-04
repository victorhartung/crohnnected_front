"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  AlertCircle,
  BarChart3,
  Download,
  Filter,
  Info,
  Layers,
  Loader2,
  MapPin,
  X,
} from "lucide-react";
import { useSession } from "next-auth/react";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { toast } from "sonner";

// Dynamically import the map component to avoid SSR issues
const MapView = dynamic(() => import("@/components/map-view"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-96 bg-muted rounded-md">
      <div className="flex items-center space-x-2">
        <Loader2 className="h-6 w-6 animate-spin" />
        <span>Loading map...</span>
      </div>
    </div>
  ),
});

interface MapFilters {
  country: string;
  severity: string;
  symptom: string;
  approvedOnly: boolean;
  showHeatmap: boolean;
}

interface MapData {
  reports: any[];
  incidence: any[];
  summary: {
    totalReports: number;
    approvedReports: number;
    countries: number;
    avgAge: number;
  };
}

export default function MapPage() {
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(true);
  const [mapData, setMapData] = useState<MapData | null>(null);
  const [availableCountries, setAvailableCountries] = useState<string[]>([]);
  const [availableSymptoms, setAvailableSymptoms] = useState<string[]>([]);
  const [filters, setFilters] = useState<MapFilters>({
    country: "all",
    severity: "all",
    symptom: "all",
    approvedOnly: false,
    showHeatmap: true,
  });

  const canExport =
    session?.user?.role === "RESEARCHER" ||
    session?.user?.role === "ADMIN" ||
    session?.user?.role === "MODERATOR";

  useEffect(() => {
    if (status === "authenticated") {
      loadMapData();
    }
  }, [filters, status]);

  const loadMapData = async () => {
    setIsLoading(true);

    try {
      // Build query parameters
      const params = new URLSearchParams();

      if (filters.country && filters.country !== "all") {
        params.append("country", filters.country);
      }

      if (filters.severity && filters.severity !== "all") {
        params.append("severity", filters.severity);
      }

      if (filters.symptom && filters.symptom !== "all") {
        params.append("symptoms", filters.symptom);
      }

      if (filters.approvedOnly) {
        params.append("approvedOnly", "true");
      }

      console.log("API Request params:", params.toString());

      const reportsRes = await fetch(`/api/map/reports?${params.toString()}`);

      if (!reportsRes.ok) {
        const errorText = await reportsRes.text();
        console.error("Reports API error:", errorText);
        throw new Error(`Failed to fetch reports: ${reportsRes.status}`);
      }

      const reportsData = await reportsRes.json();
      console.log("Reports API response:", reportsData);

      // Verificar se os dados estão sendo filtrados corretamente
      const filteredReports = reportsData.data?.features || [];
      console.log("Filtered reports count:", filteredReports.length);

      if (filteredReports.length > 0 && filters.country !== "all") {
        const countriesInResponse = new Set(
          filteredReports.map((f: any) => f.properties?.country)
        );
        console.log(
          "Countries in filtered response:",
          Array.from(countriesInResponse)
        );
      }

      // Agora buscar incidence data se necessário
      let incidenceData = { data: { regions: [] } };
      try {
        const incidenceRes = await fetch(
          `/api/map/incidence?${params.toString()}`
        );
        if (incidenceRes.ok) {
          incidenceData = await incidenceRes.json();
        }
      } catch (incidenceError) {
        console.warn("Failed to fetch incidence data:", incidenceError);
      }

      const data: MapData = {
        reports: filteredReports,
        incidence: incidenceData.data?.regions || [],
        summary: {
          totalReports: filteredReports.length,
          approvedReports: filteredReports.filter(
            (f: any) => f.properties?.status === "APPROVED"
          ).length,
          countries: new Set(
            filteredReports
              .map((f: any) => f.properties?.country)
              .filter(Boolean)
          ).size,
          avgAge:
            filteredReports.length > 0
              ? Math.round(
                  filteredReports.reduce(
                    (sum: number, f: any) =>
                      sum + (f.properties?.ageAtReport || 0),
                    0
                  ) / filteredReports.length
                )
              : 0,
        },
      };

      setMapData(data);

      // Extrair países disponíveis de TODOS os dados (sem filtro) para o dropdown
      if (filters.country === "all") {
        const allCountries = Array.from(
          new Set(
            filteredReports
              .map((f: any) => f.properties?.country)
              .filter(Boolean)
          )
        ).sort() as string[];
        setAvailableCountries(allCountries);
      }

      // Extrair sintomas disponíveis
      const symptoms = Array.from(
        new Set(
          filteredReports
            .flatMap((f: any) => f.properties?.symptoms || [])
            .filter(Boolean)
        )
      ).sort() as string[];
      setAvailableSymptoms(symptoms);
    } catch (error) {
      console.error("Failed to load map data:", error);
      toast.error("Failed to load map data");
    } finally {
      setIsLoading(false);
    }
  };

  // Função separada para carregar todos os países disponíveis (sem filtros)
  const loadAvailableCountries = async () => {
    try {
      const response = await fetch("/api/map/reports");
      if (response.ok) {
        const data = await response.json();
        const countries = Array.from(
          new Set(
            data.data?.features
              ?.map((f: any) => f.properties?.country)
              .filter(Boolean)
          )
        ).sort() as string[];
        setAvailableCountries(countries);
      }
    } catch (error) {
      console.error("Failed to load available countries:", error);
    }
  };

  useEffect(() => {
    if (status === "authenticated") {
      loadAvailableCountries();
    }
  }, [status]);

  const handleExportData = async () => {
    if (!canExport) {
      toast.error("You do not have permission to export data");
      return;
    }

    try {
      const params = new URLSearchParams();

      if (filters.country && filters.country !== "all") {
        params.append("country", filters.country);
      }
      if (filters.severity && filters.severity !== "all") {
        params.append("severity", filters.severity);
      }
      if (filters.symptom && filters.symptom !== "all") {
        params.append("symptoms", filters.symptom);
      }
      if (filters.approvedOnly) {
        params.append("approvedOnly", "true");
      }
      params.append("format", "csv");

      const response = await fetch(`/api/reports/export?${params.toString()}`);

      if (!response.ok) {
        throw new Error("Export failed");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      a.download = `crohnnected-map-data-${
        new Date().toISOString().split("T")[0]
      }.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);

      toast.success("Data exported successfully");
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Failed to export data");
    }
  };

  const updateFilter = (key: keyof MapFilters, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      country: "all",
      severity: "all",
      symptom: "all",
      approvedOnly: false,
      showHeatmap: true,
    });
  };

  const hasActiveFilters =
    filters.country !== "all" ||
    filters.severity !== "all" ||
    filters.symptom !== "all" ||
    filters.approvedOnly;

  if (status === "loading" || isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Loading map data...</span>
        </div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>Please sign in to view the map.</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Geographic Map</h1>
            <p className="text-muted-foreground">
              Explore geographic distribution of Crohn's disease reports and
              incidence data.
            </p>
          </div>
          {hasActiveFilters && (
            <Button variant="outline" onClick={clearFilters}>
              <X className="mr-2 h-4 w-4" />
              Clear Filters
            </Button>
          )}
        </div>

        {/* Summary Cards */}
        {mapData && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">
                      Total Reports
                    </p>
                    <p className="text-2xl font-bold">
                      {mapData.summary.totalReports}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2">
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Approved</p>
                    <p className="text-2xl font-bold">
                      {mapData.summary.approvedReports}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Countries</p>
                    <p className="text-2xl font-bold">
                      {mapData.summary.countries}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2">
                  <Info className="h-4 w-4 text-muted-foreground" />
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Avg Age</p>
                    <p className="text-2xl font-bold">
                      {mapData.summary.avgAge}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filters Panel */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Filters
              </CardTitle>
              <CardDescription>
                Filter map data by various criteria
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Countries Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Country</label>
                <Select
                  value={filters.country}
                  onValueChange={(value) => updateFilter("country", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Countries</SelectItem>
                    {availableCountries.map((country) => (
                      <SelectItem key={country} value={country}>
                        {country}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Severity Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Severity</label>
                <Select
                  value={filters.severity}
                  onValueChange={(value) => updateFilter("severity", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select severity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Severities</SelectItem>
                    <SelectItem value="MILD">Mild</SelectItem>
                    <SelectItem value="MODERATE">Moderate</SelectItem>
                    <SelectItem value="SEVERE">Severe</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Symptoms Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Symptom</label>
                <Select
                  value={filters.symptom}
                  onValueChange={(value) => updateFilter("symptom", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select symptom" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Symptoms</SelectItem>
                    {availableSymptoms.map((symptom) => (
                      <SelectItem key={symptom} value={symptom}>
                        {symptom}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              {/* Checkboxes */}
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="approvedOnly"
                    checked={filters.approvedOnly}
                    onCheckedChange={(checked) =>
                      updateFilter("approvedOnly", checked === true)
                    }
                  />
                  <label
                    htmlFor="approvedOnly"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Approved reports only
                  </label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="showHeatmap"
                    checked={filters.showHeatmap}
                    onCheckedChange={(checked) =>
                      updateFilter("showHeatmap", checked === true)
                    }
                  />
                  <label
                    htmlFor="showHeatmap"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Show heatmap
                  </label>
                </div>
              </div>

              <Separator />

              {/* Export Button */}
              {canExport && (
                <Button onClick={handleExportData} className="w-full">
                  <Download className="mr-2 h-4 w-4" />
                  Export Data
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Map */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Layers className="h-5 w-5" />
                  Interactive Map
                </CardTitle>
                <CardDescription>
                  {filters.country !== "all"
                    ? `Showing data for: ${filters.country}`
                    : "Showing data for all countries"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[600px] rounded-md overflow-hidden">
                  {mapData && mapData.reports.length > 0 ? (
                    <MapView
                      reports={mapData.reports}
                      showHeatmap={filters.showHeatmap}
                      approvedOnly={filters.approvedOnly}
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full bg-muted">
                      <div className="text-center">
                        <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                        <p className="text-muted-foreground">
                          {filters.country !== "all"
                            ? `No data available for ${filters.country}`
                            : "No map data available"}
                        </p>
                        <Button onClick={loadMapData} className="mt-4">
                          <Loader2 className="mr-2 h-4 w-4" />
                          Reload Data
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
