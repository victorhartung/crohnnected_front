import { withAuth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { User } from "@/lib/types";
import { exportQuerySchema } from "@/lib/validation";
import { ReportStatus, UserRole } from "@prisma/client";
import { NextRequest } from "next/server";
import { ZodError } from "zod";

export const dynamic = "force-dynamic";

// EXPORT reports for researchers (CSV/JSON)
export const GET = withAuth(
  async (request: NextRequest, user: User) => {
    try {
      const url = new URL(request.url);
      const queryParams = Object.fromEntries(url.searchParams.entries());

      // Validate query parameters
      const query = exportQuerySchema.parse(queryParams);

      // Build where conditions - researchers can only export approved reports
      let where: any = {
        status: ReportStatus.APPROVED, // Force approved only for researchers
      };

      // Apply filters
      if (query.country)
        where.country = { contains: query.country, mode: "insensitive" };
      if (query.state)
        where.state = { contains: query.state, mode: "insensitive" };
      if (query.city)
        where.city = { contains: query.city, mode: "insensitive" };

      if (query.minAge || query.maxAge) {
        where.ageAtReport = {};
        if (query.minAge) where.ageAtReport.gte = query.minAge;
        if (query.maxAge) where.ageAtReport.lte = query.maxAge;
      }

      if (query.symptoms && query.symptoms.length > 0) {
        where.symptoms = {
          array_contains: query.symptoms,
        };
      }

      if (query.severity) {
        where.symptomSeverity = query.severity;
      }

      // Period filter
      if (query.period) {
        const year = query.period.match(/^\d{4}$/);
        const quarter = query.period.match(/^(\d{4})Q([1-4])$/);

        if (year) {
          const startDate = new Date(`${year[0]}-01-01`);
          const endDate = new Date(`${parseInt(year[0]) + 1}-01-01`);
          where.createdAt = { gte: startDate, lt: endDate };
        } else if (quarter) {
          const yearNum = parseInt(quarter[1]);
          const quarterNum = parseInt(quarter[2]);
          const startMonth = (quarterNum - 1) * 3 + 1;
          const startDate = new Date(yearNum, startMonth - 1, 1);
          const endDate = new Date(yearNum, startMonth + 2, 1);
          where.createdAt = { gte: startDate, lt: endDate };
        }
      }

      // Get reports - pseudonymized data for researchers
      const reports = await prisma.report.findMany({
        where,
        select: {
          id: true,
          // Pseudonymized/aggregated demographics
          ageAtReport: true,
          sex: true,
          country: true,
          state: true,
          city: true,
          // No exact coordinates, just coarse location
          lat: false,
          lng: false,
          // Medical data
          symptoms: true,
          symptomSeverity: true,
          medications: true,
          flareFrequencyPerYear: true,
          diagnosisDate: true,
          // Workflow data
          status: true,
          approvedAt: true,
          createdAt: true,
          // NO personal identifiers
          // NO document access
          // NO notes (may contain personal info)
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      // Create audit log
      await prisma.auditLog.create({
        data: {
          actorId: user.id,
          action: "EXPORT_DATA",
          entity: "Report",
          entityId: "bulk_export",
          meta: {
            format: query.format,
            recordCount: reports.length,
            filters: {
              country: query.country,
              state: query.state,
              city: query.city,
              minAge: query.minAge,
              maxAge: query.maxAge,
              symptoms: query.symptoms,
              severity: query.severity,
              period: query.period,
            },
          },
        },
      });

      if (query.format === "csv") {
        let requestedFields: string[] = [];
        if (Array.isArray((query as any).fields)) {
          requestedFields = (query as any).fields as string[];
        } else if (
          typeof (query as any).fields === "string" &&
          (query as any).fields.length > 0
        ) {
          requestedFields = (query as any).fields
            .split(",")
            .map((s: string) => s.trim())
            .filter(Boolean);
        }

        // Definir colunas
        const allowedFields = [
          "ageAtReport",
          "sex",
          "country",
          "state",
          "city",
          "symptoms",
          "symptomSeverity",
          "medications",
          "flareFrequencyPerYear",
          "diagnosisDate",
          "status",
          "approvedAt",
          "createdAt",
        ];

        const selectedFields: string[] =
          requestedFields.length > 0
            ? requestedFields.filter((f: string) => allowedFields.includes(f))
            : allowedFields.slice();

        if (selectedFields.length === 0)
          selectedFields.push("country", "symptoms");

        const formatters: Record<string, (r: any) => string> = {
          ageAtReport: (r) => `${r.ageAtReport ?? ""}`,
          sex: (r) => `${r.sex ?? ""}`,
          country: (r) => `${r.country ?? ""}`,
          state: (r) => `${r.state ?? ""}`,
          city: (r) => `${r.city ?? ""}`,
          symptoms: (r) => {
            if (!r.symptoms) return "";
            return `"${
              Array.isArray(r.symptoms)
                ? (r.symptoms as string[]).join("; ")
                : String(r.symptoms)
            }"`;
          },
          symptomSeverity: (r) => `${r.symptomSeverity ?? ""}`,
          medications: (r) => {
            if (!r.medications) return "";
            return `"${
              Array.isArray(r.medications)
                ? (r.medications as string[]).join("; ")
                : String(r.medications)
            }"`;
          },
          flareFrequencyPerYear: (r) => `${r.flareFrequencyPerYear ?? ""}`,
          diagnosisDate: (r) =>
            r.diagnosisDate
              ? new Date(r.diagnosisDate).toISOString().split("T")[0]
              : "",
          status: (r) => `${r.status ?? ""}`,
          approvedAt: (r) =>
            r.approvedAt ? new Date(r.approvedAt).toISOString() : "",
          createdAt: (r) =>
            r.createdAt ? new Date(r.createdAt).toISOString() : "",
        };

        const headers = selectedFields;

        const csvRows = [
          headers.join(","),
          ...reports.map((report) => {
            return selectedFields
              .map((field) => {
                const fn = formatters[field];
                try {
                  return fn ? fn(report) : "";
                } catch (e) {
                  return "";
                }
              })
              .join(",");
          }),
        ];

        const csvContent = csvRows.join("\n");
        const timestamp = new Date().toISOString().split("T")[0];

        return new Response(csvContent, {
          status: 200,
          headers: {
            "Content-Type": "text/csv",
            "Content-Disposition": `attachment; filename="crohnnected-reports-${timestamp}.csv"`,
          },
        });
      } else {
        // Return JSON
        const timestamp = new Date().toISOString().split("T")[0];

        return Response.json(
          {
            success: true,
            data: {
              reports,
              exportInfo: {
                totalRecords: reports.length,
                exportDate: new Date().toISOString(),
                filters: {
                  country: query.country,
                  state: query.state,
                  city: query.city,
                  minAge: query.minAge,
                  maxAge: query.maxAge,
                  symptoms: query.symptoms,
                  severity: query.severity,
                  period: query.period,
                },
              },
            },
          },
          {
            headers: {
              "Content-Disposition": `attachment; filename="crohnnected-reports-${timestamp}.json"`,
            },
          }
        );
      }
    } catch (error) {
      console.error("Export reports error:", error);

      if (error instanceof ZodError) {
        return Response.json(
          {
            success: false,
            error: "Invalid query parameters",
            details: error.errors,
          },
          { status: 400 }
        );
      }

      return Response.json(
        { success: false, error: "Failed to export reports" },
        { status: 500 }
      );
    }
  },
  [UserRole.RESEARCHER, UserRole.DOCTOR, UserRole.MODERATOR, UserRole.ADMIN] // Allow researchers and higher roles
);
