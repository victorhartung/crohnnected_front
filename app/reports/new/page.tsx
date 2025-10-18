"use client";

import { useReportContext } from "@/components/report-context";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { useLanguage } from "@/components/language-provider";
import type { LocationData } from "@/components/location-picker";
import { MultiSelect, type Option } from "@/components/multi-select";
import { PDFUpload } from "@/components/pdf-upload";
import { Report } from "@/interfaces/report";
import { COMMON_MEDICATIONS, COMMON_SYMPTOMS } from "@/lib/constants";
import { reportSchema, type ReportInput } from "@/lib/validations";
import {
  Activity,
  AlertCircle,
  FileText,
  Loader2,
  MapPin,
  Send,
  Stethoscope,
  Upload,
} from "lucide-react";
import dynamic from "next/dynamic";
import { toast } from "sonner";

// Importa o LocationPicker dinamicamente para evitar problemas de SSR
const LocationPicker = dynamic(() => import("@/components/location-picker"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-[400px] border rounded-lg">
      <Loader2 className="h-8 w-8 animate-spin" />
    </div>
  ),
});

export default function NewReportPage() {
  const { data: session, status } = useSession();
  const { t } = useLanguage();
  const { refreshReports } = useReportContext();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [pdfFile, setPdfFile] = useState<{
    base64: string;
    originalName: string;
    mime: string;
    sizeBytes: number;
  } | null>(null);
  const [pdfError, setPdfError] = useState("");
  const [selectedLocation, setSelectedLocation] = useState<LocationData | null>(
    null
  );

  const form = useForm<ReportInput>({
    resolver: zodResolver(reportSchema(t)),
    defaultValues: {
      ageAtReport: undefined,
      sex: undefined,
      country: "",
      state: "",
      city: "",
      lat: undefined,
      lng: undefined,
      symptoms: [],
      symptomSeverity: undefined,
      medications: [],
      flareFrequencyPerYear: undefined,
      surgeryHistory: [],
      diagnosisDate: "",
      notes: "",
    },
  });

  // Prevent patients from creating more than one report: if they already have one,
  // redirect back to /reports.
  useEffect(() => {
    const checkExisting = async () => {
      if (session?.user?.role !== "PATIENT") return;
      try {
        const res = await fetch("/api/reports?limit=1");
        if (!res.ok) return;
        const data = await res.json();
        const activeReport = data?.data?.reports?.find(
          (report: Report) => report.status !== "REJECTED"
        );
        if (!!activeReport) {
          // Patient already has an active report, redirect
          router.push("/reports");
        }
      } catch (e) {
        console.error("Error checking active report:", error);
      }
    };

    checkExisting();
  }, [session, router]);

  // Atualiza os campos do formulário quando uma localização é selecionada
  useEffect(() => {
    if (selectedLocation) {
      form.setValue("country", selectedLocation.country, {
        shouldValidate: true,
      });
      form.setValue("state", selectedLocation.state || "", {
        shouldValidate: true,
      });
      form.setValue("city", selectedLocation.city || "", {
        shouldValidate: true,
      });
      form.setValue("lat", selectedLocation.lat, { shouldValidate: true });
      form.setValue("lng", selectedLocation.lng, { shouldValidate: true });
    }
  }, [selectedLocation, form]);

  const symptomOptions: Option[] = COMMON_SYMPTOMS.map((symptom) => ({
    label: symptom,
    value: symptom,
  }));

  const medicationOptions: Option[] = COMMON_MEDICATIONS.map((medication) => ({
    label: medication,
    value: medication,
  }));

  const watchedSymptoms = form.watch("symptoms") || [];
  const watchedMedications = form.watch("medications") || [];

  useEffect(() => {
    // Ensure RHF knows about these array fields so setValue and validation work reliably
    form.register("symptoms");
    form.register("medications");
  }, [form]);

  // Clear PDF validation error when a file is selected
  useEffect(() => {
    if (pdfFile) setPdfError("");
  }, [pdfFile]);

  const handleLocationSelect = (location: LocationData | null) => {
    setSelectedLocation(location);
    if (!location) {
      // Limpa os campos se a localização for removida
      form.setValue("country", "", { shouldValidate: true });
      form.setValue("state", "", { shouldValidate: true });
      form.setValue("city", "", { shouldValidate: true });
      form.setValue("lat", undefined, { shouldValidate: true });
      form.setValue("lng", undefined, { shouldValidate: true });
    }
  };

  const onSubmit = async (data: ReportInput) => {
    if (session?.user?.role !== "PATIENT") {
      setError(t("reports.onlyPatientsCanSubmit"));
      return;
    }

    // Valida que a localização foi selecionada
    if (!selectedLocation || !data.country) {
      setError(t("reports.pleaseSelectLocation"));
      return;
    }

    // Clear previous errors
    setPdfError("");
    setError("");

    // Require PDF/document for patient submissions
    if (!pdfFile) {
      setPdfError(t("reports.pleaseAttachDocument"));
      return;
    }

    setIsLoading(true);

    try {
      const payload = {
        ...data,
        documentBase64: pdfFile?.base64,
        documentOriginalName: pdfFile?.originalName,
        documentMime: pdfFile?.mime,
        documentSizeBytes: pdfFile?.sizeBytes,
      };

      const response = await fetch("/api/reports", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.message || t("common.error"));
        return;
      }

      refreshReports();
      toast.success(t("reports.reportSubmittedSuccess"));
      router.push("/reports");
    } catch (error) {
      setError(t("reports.unexpectedError"));
      console.error("Report submission error:", error);
    } finally {
      setIsLoading(false);
    }
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
          <AlertDescription>
            {t("reports.onlyPatientsCanSubmit")}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (session?.user?.role !== "PATIENT") {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {t("reports.onlyPatientsCanSubmitDesc")}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">{t("reports.submitNew")}</h1>
          <p className="text-muted-foreground">{t("reports.submitNewDesc")}</p>
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                {t("reports.personalInformation")}
              </CardTitle>
              <CardDescription>
                {t("reports.personalInformationDesc")}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="ageAtReport">
                    {t("reports.ageAtReportLabel")}
                  </Label>
                  <Input
                    id="ageAtReport"
                    type="number"
                    placeholder={t("reports.enterYourAge")}
                    {...form.register("ageAtReport", { valueAsNumber: true })}
                    disabled={isLoading}
                  />
                  {form.formState.errors.ageAtReport && (
                    <p className="text-sm text-destructive">
                      {form.formState.errors.ageAtReport.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sex">{t("reports.sexLabel")}</Label>
                  <Select
                    value={form.watch("sex") || ""}
                    onValueChange={(value) =>
                      form.setValue("sex", value as any)
                    }
                    disabled={isLoading}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t("reports.selectSex")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="FEMALE">
                        {t("reports.female")}
                      </SelectItem>
                      <SelectItem value="MALE">{t("reports.male")}</SelectItem>
                      <SelectItem value="INTERSEX">
                        {t("reports.intersex")}
                      </SelectItem>
                      <SelectItem value="OTHER">
                        {t("reports.other")}
                      </SelectItem>
                      <SelectItem value="UNSPECIFIED">
                        {t("reports.unspecified")}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="diagnosisDate">
                  {t("reports.diagnosisDateLabel")}
                </Label>
                <Input
                  id="diagnosisDate"
                  type="date"
                  {...form.register("diagnosisDate")}
                  disabled={isLoading}
                />
              </div>
            </CardContent>
          </Card>

          {/* Location Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                {t("reports.locationInformation")}
              </CardTitle>
              <CardDescription>
                {t("reports.locationInformationDesc")}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <LocationPicker
                onLocationSelect={handleLocationSelect}
                initialLocation={selectedLocation || undefined}
                height="400px"
              />

              {selectedLocation && (
                <div className="space-y-3 p-4 bg-muted rounded-lg">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">
                      {t("reports.selectedLocation")}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <Label className="text-xs text-muted-foreground">
                        {t("reports.country")} *
                      </Label>
                      <p className="font-medium">{selectedLocation.country}</p>
                    </div>
                    {selectedLocation.state && (
                      <div>
                        <Label className="text-xs text-muted-foreground">
                          {t("reports.stateProvince")}
                        </Label>
                        <p className="font-medium">{selectedLocation.state}</p>
                      </div>
                    )}
                    {selectedLocation.city && (
                      <div>
                        <Label className="text-xs text-muted-foreground">
                          {t("reports.city")}
                        </Label>
                        <p className="font-medium">{selectedLocation.city}</p>
                      </div>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {t("reports.coordinates")}:{" "}
                    {selectedLocation.lat.toFixed(6)},{" "}
                    {selectedLocation.lng.toFixed(6)}
                  </div>
                </div>
              )}

              {form.formState.errors.country && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    {form.formState.errors.country.message}
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* Medical Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                {t("reports.medicalInformation")}
              </CardTitle>
              <CardDescription>
                {t("reports.medicalInformationDesc")}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Symptoms */}
              <div className="space-y-2">
                <Label htmlFor="symptoms">{t("reports.symptomsLabel")}</Label>
                <MultiSelect
                  options={COMMON_SYMPTOMS.map((symptom) => ({
                    label: symptom,
                    value: symptom,
                  }))}
                  value={form.watch("symptoms") || []}
                  onChange={(values) => form.setValue("symptoms", values)}
                  placeholder={t("reports.selectSymptoms")}
                  searchPlaceholder={t("reports.searchSymptoms")}
                  emptyText={t("reports.noSymptomsFound")}
                  disabled={isLoading}
                />
                {form.formState.errors.symptoms && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.symptoms.message}
                  </p>
                )}
              </div>

              {/* Symptom Severity */}
              <div className="space-y-2">
                <Label htmlFor="symptomSeverity">
                  {t("reports.symptomSeverityLabel")}
                </Label>
                <Select
                  value={form.watch("symptomSeverity") || ""}
                  onValueChange={(value) =>
                    form.setValue("symptomSeverity", value as any)
                  }
                  disabled={isLoading}
                >
                  <SelectTrigger>
                    <SelectValue
                      placeholder={t("reports.selectSeverityPlaceholder")}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MILD">{t("reports.mild")}</SelectItem>
                    <SelectItem value="MODERATE">
                      {t("reports.moderate")}
                    </SelectItem>
                    <SelectItem value="SEVERE">
                      {t("reports.severe")}
                    </SelectItem>
                  </SelectContent>
                </Select>
                {form.formState.errors.symptomSeverity && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.symptomSeverity.message}
                  </p>
                )}
              </div>

              {/* Medications */}
              <div className="space-y-2">
                <Label htmlFor="medications">
                  {t("reports.currentMedications")}
                </Label>
                <MultiSelect
                  options={COMMON_MEDICATIONS.map((med) => ({
                    label: med,
                    value: med,
                  }))}
                  value={form.watch("medications") || []}
                  onChange={(values) => form.setValue("medications", values)}
                  placeholder={t("reports.selectMedications")}
                  searchPlaceholder={t("reports.searchMedications")}
                  emptyText={t("reports.noMedicationsFound")}
                  disabled={isLoading}
                />
              </div>

              {/* Flare Frequency */}
              <div className="space-y-2">
                <Label htmlFor="flareFrequencyPerYear">
                  {t("reports.flareFrequencyLabel")}
                </Label>
                <Input
                  id="flareFrequencyPerYear"
                  type="number"
                  placeholder={t("reports.flareFrequencyPlaceholder")}
                  {...form.register("flareFrequencyPerYear", {
                    valueAsNumber: true,
                  })}
                  disabled={isLoading}
                />
              </div>

              {/* Additional Notes */}
              <div className="space-y-2">
                <Label htmlFor="notes">
                  {t("reports.additionalNotesLabel")}
                </Label>
                <Textarea
                  id="notes"
                  placeholder={t("reports.additionalNotesPlaceholder")}
                  {...form.register("notes")}
                  disabled={isLoading}
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>

          {/* Supporting Documentation */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                {t("reports.supportingDocumentation")}
              </CardTitle>
              <CardDescription>
                {t("reports.supportingDocumentationDesc")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PDFUpload
                onFileChange={(file) => {
                  setPdfFile(file);
                  setPdfError("");
                }}
                currentFile={
                  pdfFile
                    ? {
                        originalName: pdfFile.originalName,
                        sizeBytes: pdfFile.sizeBytes,
                      }
                    : null
                }
                disabled={isLoading}
              />
              {pdfError && (
                <Alert variant="destructive" className="mt-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{pdfError}</AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* Error Display */}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Submit Button */}
          <div className="flex justify-end">
            <Button type="submit" size="lg" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t("common.submitting")}
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  {t("reports.submitReport")}
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
