"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  downloadPDFFromBase64,
  formatDate,
  formatDateTime,
  formatFileSize,
  getSeverityColor,
  getStatusColor,
} from "@/lib/utils";
import { rejectReportSchema, type RejectReportInput } from "@/lib/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AlertCircle,
  ArrowLeft,
  Calendar,
  CheckCircle,
  Clock,
  Download,
  FileText,
  Loader2,
  MapPin,
  Stethoscope,
  User,
  XCircle,
} from "lucide-react";
import { useSession } from "next-auth/react";
import dynamic from "next/dynamic";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useLanguage } from "@/components/language-provider";

// Importa o componente de mapa dinamicamente (client-side only)
const SingleLocationMap = dynamic(
  () => import("@/components/single-location-map"),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-[300px] bg-muted rounded-lg">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    ),
  }
);

interface Report {
  id: string;
  ageAtReport?: number;
  sex?: string;
  country: string;
  state?: string;
  city?: string;
  lat?: number;
  lng?: number;
  symptoms: string[];
  symptomSeverity: string;
  medications?: string[];
  flareFrequencyPerYear?: number;
  surgeryHistory?: Array<{ type: string; year?: number; notes?: string }>;
  diagnosisDate?: string;
  notes?: string;
  status: string;
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
}

export default function ReportDetailPage() {
  const { t } = useLanguage();
  const { data: session, status } = useSession();
  const params = useParams();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [report, setReport] = useState<Report | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);

  const reportId = params?.id as string;

  const canApprove =
    session?.user?.role === "DOCTOR" || session?.user?.role === "ADMIN";
  const canViewDocument = session?.user?.role !== "RESEARCHER"; // Researchers can't access PDFs

  const rejectForm = useForm<RejectReportInput>({
    resolver: zodResolver(rejectReportSchema(t)),
    defaultValues: {
      reason: "",
    },
  });

  useEffect(() => {
    if (reportId && session?.user) {
      loadReport();
    }
  }, [reportId, session]);

  const loadReport = async () => {
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(`/api/reports/${reportId}`);
      if (!response.ok) {
        if (response.status === 404) {
          setError(t("reports.reportNotFound"));
        } else if (response.status === 403) {
          setError(t("reports.noPermissionToView"));
        } else {
          const errorData = await response.json();
          setError(errorData.message || t("reports.failedToLoad"));
        }
        return;
      }

      const data = await response.json();
      // API retorna { success: true, data: { report } }
      setReport(data?.data?.report ?? null);
    } catch (error) {
      setError(t("auth.unexpectedError"));
      console.error("Failed to load report:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApproveReport = async () => {
    if (!report) return;

    try {
      const response = await fetch(`/api/reports/${report.id}/approve`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ notes: "Approved by healthcare provider" }),
      });

      if (!response.ok) {
        toast.error(t("reports.failedToApprove"));
        return;
      }

      toast.success(t("reports.reportApproved"));
      loadReport(); // Refresh the report
    } catch (error) {
      toast.error(t("reports.failedToApprove"));
      console.error("Approve report error:", error);
    }
  };

  const handleRejectReport = async (data: RejectReportInput) => {
    if (!report) return;

    try {
      const response = await fetch(`/api/reports/${report.id}/reject`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        toast.error(t("reports.failedToReject"));
        return;
      }

      toast.success(t("reports.reportRejected"));
      setRejectDialogOpen(false);
      rejectForm.reset();
      loadReport(); // Refresh the report
    } catch (error) {
      toast.error(t("reports.failedToReject"));
      console.error("Reject report error:", error);
    }
  };

  const handleDownloadPDF = async () => {
    if (!report?.hasDocument) return;

    setIsDownloading(true);

    try {
      const response = await fetch(`/api/reports/${report.id}/document`);
      if (!response.ok) {
        toast.error(t("reports.failedToDownload"));
        return;
      }

      const data = await response.json();
      const doc = data?.data ?? {};
      downloadPDFFromBase64(doc.documentBase64, doc.documentOriginalName);
      toast.success(t("reports.documentDownloaded"));
    } catch (error) {
      toast.error(t("reports.failedToDownload"));
      console.error("Download error:", error);
    } finally {
      setIsDownloading(false);
    }
  };

  if (status === "loading" || isLoading) {
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
          <AlertDescription>{t("profile.signInToView")}</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-4">
          <Button variant="ghost" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t("common.back")}
          </Button>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {error || t("reports.reportNotFound")}
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t("reports.backToReports")}
          </Button>

          {canApprove && report.status === "PENDING" && (
            <div className="flex gap-2">
              <Button onClick={handleApproveReport}>
                <CheckCircle className="mr-2 h-4 w-4" />
                {t("reports.approveReport")}
              </Button>
              <Dialog
                open={rejectDialogOpen}
                onOpenChange={setRejectDialogOpen}
              >
                <DialogTrigger asChild>
                  <Button variant="destructive">
                    <XCircle className="mr-2 h-4 w-4" />
                    {t("reports.rejectReport")}
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{t("reports.confirmRejection")}</DialogTitle>
                    <DialogDescription>
                      {t("reports.confirmRejectionDesc")}
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={rejectForm.handleSubmit(handleRejectReport)}>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="reason">
                          {t("reports.reasonLabel")}
                        </Label>
                        <Textarea
                          id="reason"
                          placeholder={t("reports.reasonPlaceholder")}
                          {...rejectForm.register("reason")}
                          rows={3}
                        />
                        {rejectForm.formState.errors.reason && (
                          <p className="text-sm text-destructive">
                            {rejectForm.formState.errors.reason.message}
                          </p>
                        )}
                      </div>
                    </div>
                    <DialogFooter>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setRejectDialogOpen(false)}
                      >
                        {t("common.cancel")}
                      </Button>
                      <Button type="submit" variant="destructive">
                        {t("reports.rejectReport")}
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          )}
        </div>

        {/* Report Header */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <CardTitle className="text-2xl">
                  {t("reports.reportDetails")} #
                  {report.id ? report.id.slice(-8) : "N/A"}
                </CardTitle>
                <div className="flex items-center gap-4 text-sm text-muted-foreground font-semibold">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {t("reports.submittedOn")} {formatDate(report.createdAt, t)}
                  </div>
                  {report.ageAtReport && (
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      {t("reports.ageAtReport")}: {report.ageAtReport}
                    </div>
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
                  {t(`reports.${report.symptomSeverity.toLowerCase()}`)}{" "}
                  {t("reports.severity")}
                </Badge>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Status Information */}
        {(report.status === "APPROVED" || report.status === "REJECTED") && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Clock className="h-5 w-5" />
                {t("reports.statusInformation")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {report.status === "APPROVED" && (
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    <span className="font-medium text-black">
                      {t("reports.approvedBy")}:
                    </span>{" "}
                    {report.approvedBy?.name || report.approvedBy?.email}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    <span className="font-medium text-black">
                      {t("reports.approvedOn")}:
                    </span>{" "}
                    {report.approvedAt && formatDateTime(report.approvedAt, t)}
                  </p>
                </div>
              )}
              {report.status === "REJECTED" && report.rejectionReason && (
                <div className="space-y-2">
                  <p className="text-sm font-medium">
                    {t("reports.rejectionReason")}
                  </p>
                  <p className="text-sm bg-destructive/10 p-3 rounded-md">
                    {report.rejectionReason}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                {t("reports.patientInformation")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {report.ageAtReport && (
                <div>
                  <span className="text-sm font-medium">
                    {t("reports.ageAtReport")}:
                  </span>
                  <p className="text-sm text-muted-foreground">
                    {report.ageAtReport} {t("reports.years")}
                  </p>
                </div>
              )}
              {report.sex && (
                <div>
                  <span className="text-sm font-medium">
                    {t("reports.sex")}:
                  </span>
                  <p className="text-sm text-muted-foreground">
                    {t(`reports.${report.sex.toLowerCase()}`)}
                  </p>
                </div>
              )}
              {report.diagnosisDate && (
                <div>
                  <span className="text-sm font-medium">
                    {t("reports.diagnosisDate")}:
                  </span>
                  <p className="text-sm text-muted-foreground">
                    {formatDate(report.diagnosisDate, t)}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Location Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                {t("reports.locationInfo")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">
                  {[report.city, report.state, report.country]
                    .filter(Boolean)
                    .join(", ")}
                </p>
              </div>

              {/* Mapa da localização */}
              {report.lat && report.lng && (
                <div className="mt-4">
                  <SingleLocationMap
                    lat={report.lat}
                    lng={report.lng}
                    city={report.city}
                    state={report.state}
                    country={report.country}
                    height="300px"
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Medical Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Stethoscope className="h-5 w-5" />
              {t("reports.medicalInformation")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <span className="text-sm font-medium block mb-2">
                {t("reports.symptoms")}:
              </span>
              <div className="flex flex-wrap gap-2">
                {(report.symptoms || []).map((symptom) => (
                  <Badge key={symptom} variant="outline">
                    {symptom}
                  </Badge>
                ))}
              </div>
            </div>

            {report.medications && report.medications.length > 0 && (
              <div>
                <span className="text-sm font-medium block mb-2">
                  {t("reports.medications")}:
                </span>
                <div className="flex flex-wrap gap-2">
                  {report.medications.map((medication) => (
                    <Badge key={medication} variant="outline">
                      {medication}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {report.flareFrequencyPerYear && (
              <div>
                <span className="text-sm font-medium">
                  {t("reports.flareFrequency")}:
                </span>
                <p className="text-sm text-muted-foreground">
                  {report.flareFrequencyPerYear} {t("reports.timesPerYear")}
                </p>
              </div>
            )}

            {report.surgeryHistory && report.surgeryHistory.length > 0 && (
              <div>
                <span className="text-sm font-medium block mb-2">
                  {t("reports.surgeryHistory")}:
                </span>
                <div className="space-y-2">
                  {report.surgeryHistory.map((surgery, index) => (
                    <div key={index} className="bg-muted/50 p-3 rounded-md">
                      <p className="text-sm">
                        <span className="font-medium">{surgery.type}</span>
                        {surgery.year && (
                          <span className="text-muted-foreground">
                            {" "}
                            ({surgery.year})
                          </span>
                        )}
                      </p>
                      {surgery.notes && (
                        <p className="text-xs text-muted-foreground mt-1">
                          {surgery.notes}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {report.notes && (
              <div>
                <span className="text-sm font-medium block mb-2">
                  {t("reports.additionalNotes")}:
                </span>
                <div className="bg-muted/50 p-3 rounded-md">
                  <p className="text-sm text-muted-foreground">
                    {report.notes}
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Document Section */}
        {report.hasDocument && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                {t("reports.supportingDocument")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-4 border rounded-md">
                <div className="flex items-center gap-3">
                  <FileText className="h-8 w-8 text-red-500" />
                  <div>
                    <p className="font-medium">{report.documentOriginalName}</p>
                    <p className="text-sm text-muted-foreground">
                      {report.documentSizeBytes &&
                        formatFileSize(report.documentSizeBytes)}
                    </p>
                  </div>
                </div>
                {canViewDocument ? (
                  <Button
                    variant="default"
                    onClick={handleDownloadPDF}
                    disabled={isDownloading}
                  >
                    {isDownloading ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Download className="mr-2 h-4 w-4" />
                    )}
                    {isDownloading
                      ? t("reports.downloading")
                      : t("reports.downloadDocument")}
                  </Button>
                ) : (
                  <Badge variant="secondary">
                    {t("reports.documentNotAvailable")}
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
