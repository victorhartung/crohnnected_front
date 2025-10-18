import { checkRateLimit, getRateLimitKey, withAuth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { User } from "@/lib/types";
import {
  createReportSchema,
  parsePaginationParams,
  reportQuerySchema,
} from "@/lib/validation";
import { ReportStatus, UserRole } from "@prisma/client";
import { NextRequest } from "next/server";
import { ZodError } from "zod";

export const dynamic = "force-dynamic";

// CREATE Report
export const POST = withAuth(async (request: NextRequest, user: User) => {
  try {
    // Only patients can create reports
    if (user.role !== UserRole.PATIENT) {
      return Response.json(
        { success: false, error: "Apenas pacientes podem gerar relatórios" },
        { status: 403 }
      );
    }

    // Check if patient already has an active report (anything that is not REJECTED)
    const existing = await prisma.report.findFirst({
      where: {
        patientId: user.id,
        status: {
          not: ReportStatus.REJECTED,
        },
      },
    });
    if (existing) {
      return Response.json(
        { success: false, error: "Paciente já tem um relatório ativo" },
        { status: 400 }
      );
    }

    // Rate limiting for report creation
    const rateLimitKey = getRateLimitKey(request, "create-report");
    if (!checkRateLimit(rateLimitKey, 5, 60 * 60 * 1000)) {
      // 5 reports per hour
      return Response.json(
        {
          success: false,
          error:
            "Muitas tentativas de geração de relatório. Por favor, tente mais tarde.",
        },
        { status: 429 }
      );
    }

    const body = await request.json();

    // Validate input
    const validatedData = createReportSchema(() => "").parse(body);

    // For patient-created reports, require a supporting document
    if (user.role === UserRole.PATIENT) {
      const hasDocument =
        !!validatedData.documentBase64 &&
        !!validatedData.documentOriginalName &&
        !!validatedData.documentMime;
      if (!hasDocument) {
        return Response.json(
          { success: false, error: "Documento de apoio (PDF) é obrigatório" },
          { status: 400 }
        );
      }
    }

    // Create report
    const report = await prisma.report.create({
      data: {
        patientId: user.id,
        status: ReportStatus.PENDING,
        ...validatedData,
      },
    });

    // Create audit log
    await prisma.auditLog.create({
      data: {
        actorId: user.id,
        action: "CREATE_REPORT",
        entity: "Report",
        entityId: report.id,
        meta: {
          reportId: report.id,
          hasDocument: !!report.documentBase64,
        },
      },
    });

    return Response.json(
      {
        success: true,
        data: {
          report: {
            ...report,
            hasDocument: !!report.documentBase64,
            // Don't return the base64 data in the response
            documentBase64: undefined,
          },
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create report error:", error);

    if (error instanceof ZodError) {
      return Response.json(
        {
          success: false,
          error: "Validação falhou",
          details: error.errors,
        },
        { status: 400 }
      );
    }

    return Response.json(
      { success: false, error: "Falha ao gerar relatório" },
      { status: 500 }
    );
  }
});

function buildBaseWhere(user: User, query: any) {
  const conditions: any[] = [];
  const roleWhere: any = {};
  let symptomSearchTerms: string[] = [];
  let medicationSearchTerms: string[] = [];
  let searchQueryTerms: string[] = [];

  // Role-based filtering
  if (user.role === UserRole.PATIENT) {
    roleWhere.patientId = user.id;
  } else if (user.role === UserRole.RESEARCHER) {
    roleWhere.status = ReportStatus.APPROVED;
  }

  // Status filter (only if not researcher, as researcher already has status filter)
  if (query.status && user.role !== UserRole.RESEARCHER) {
    conditions.push({ status: query.status });
  }

  // Location filters - use AND logic
  if (query.country) {
    conditions.push({
      country: { contains: query.country, mode: "insensitive" },
    });
  }

  if (query.state) {
    conditions.push({ state: { contains: query.state, mode: "insensitive" } });
  }

  if (query.city) {
    conditions.push({ city: { contains: query.city, mode: "insensitive" } });
  }

  // Age filter
  if (query.minAge || query.maxAge) {
    const ageCondition: any = {};
    if (query.minAge) ageCondition.gte = query.minAge;
    if (query.maxAge) ageCondition.lte = query.maxAge;
    conditions.push({ ageAtReport: ageCondition });
  }

  // Severity filter
  if (query.severity) {
    conditions.push({ symptomSeverity: query.severity });
  }

  // Period filter
  if (query.period) {
    const year = query.period.match(/^\d{4}$/);
    const quarter = query.period.match(/^(\d{4})Q([1-4])$/);
    let dateRange: any = null;

    if (year) {
      const startDate = new Date(`${year[0]}-01-01`);
      const endDate = new Date(`${parseInt(year[0]) + 1}-01-01`);
      dateRange = { gte: startDate, lt: endDate };
    } else if (quarter) {
      const yearNum = parseInt(quarter[1]);
      const quarterNum = parseInt(quarter[2]);
      const startMonth = (quarterNum - 1) * 3;
      const startDate = new Date(yearNum, startMonth, 1);
      const endDate = new Date(yearNum, startMonth + 3, 1);
      dateRange = { gte: startDate, lt: endDate };
    }

    if (dateRange) conditions.push({ createdAt: dateRange });
  }

  // Handle specific symptoms filter
  if (query.symptoms && query.symptoms.length > 0) {
    symptomSearchTerms = query.symptoms;
  }

  // Handle specific medications filter
  if (query.medications && query.medications.length > 0) {
    medicationSearchTerms = query.medications;
  }

  // Handle general search query - search across multiple fields
  if (query.searchQuery && query.searchQuery.trim()) {
    searchQueryTerms.push(query.searchQuery.trim());
  }

  return {
    roleWhere,
    conditions,
    symptomSearchTerms,
    medicationSearchTerms,
    searchQueryTerms,
  };
}

// LIST Reports
export const GET = withAuth(async (request: NextRequest, user: User) => {
  try {
    const url = new URL(request.url);
    const queryParams = Object.fromEntries(url.searchParams.entries());

    const query = reportQuerySchema.parse(queryParams);
    const { page, limit, skip } = parsePaginationParams({
      page: query.page.toString(),
      limit: query.limit.toString(),
    });

    const {
      roleWhere,
      conditions,
      symptomSearchTerms,
      medicationSearchTerms,
      searchQueryTerms,
    } = buildBaseWhere(user, query);

    let where: any;

    // Build base where with AND logic for all conditions
    if (conditions.length === 0) {
      where = roleWhere;
    } else {
      where = { AND: [roleWhere, ...conditions] };
    }

    // Handle specific symptoms filter
    if (symptomSearchTerms.length > 0) {
      const symptomIds = await prisma.$queryRawUnsafe<{ id: number }[]>(
        `
        SELECT DISTINCT id FROM reports
        WHERE ${symptomSearchTerms
          .map(
            (_, i) => `
              EXISTS (
                SELECT 1 FROM jsonb_array_elements_text("symptoms") elem
                WHERE elem ILIKE '%' || $${i + 1} || '%'
              )
            `
          )
          .join(" OR ")}
        `,
        ...symptomSearchTerms
      );

      const ids = symptomIds.map((r) => r.id);
      if (ids.length > 0) {
        where = { AND: [where, { id: { in: ids } }] };
      } else {
        where = { id: { in: [] } };
      }
    }

    // Handle specific medications filter
    if (medicationSearchTerms.length > 0) {
      const medicationIds = await prisma.$queryRawUnsafe<{ id: number }[]>(
        `
        SELECT DISTINCT id FROM reports
        WHERE ${medicationSearchTerms
          .map(
            (_, i) =>
              `EXISTS (
                SELECT 1 FROM jsonb_array_elements_text("medications") elem
                WHERE elem ILIKE '%' || $${i + 1} || '%'
              )`
          )
          .join(" OR ")}
        `,
        ...medicationSearchTerms
      );

      const ids = medicationIds.map((r) => r.id);
      if (ids.length > 0) {
        where = { AND: [where, { id: { in: ids } }] };
      } else {
        where = { id: { in: [] } };
      }
    }

    // Handle general search query - search across multiple fields
    if (searchQueryTerms.length > 0) {
      const searchIds = await prisma.$queryRawUnsafe<{ id: number }[]>(
        `
        SELECT DISTINCT id FROM reports
        WHERE ${searchQueryTerms
          .map(
            (_, i) => `(
              notes ILIKE '%' || $${i + 1} || '%' OR
              country ILIKE '%' || $${i + 1} || '%' OR
              state ILIKE '%' || $${i + 1} || '%' OR
              city ILIKE '%' || $${i + 1} || '%' OR
              EXISTS (
                SELECT 1 FROM jsonb_array_elements_text("symptoms") elem
                WHERE elem ILIKE '%' || $${i + 1} || '%'
              ) OR
              EXISTS (
                SELECT 1 FROM jsonb_array_elements_text("medications") elem
                WHERE elem ILIKE '%' || $${i + 1} || '%'
              )
            )`
          )
          .join(" AND ")}
        `,
        ...searchQueryTerms
      );

      const ids = searchIds.map((r) => r.id);
      if (ids.length > 0) {
        where = { AND: [where, { id: { in: ids } }] };
      } else {
        where = { id: { in: [] } };
      }
    }

    const [reports, total] = await Promise.all([
      prisma.report.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          [query.sortBy]: query.sortOrder,
        },
        select: {
          id: true,
          ageAtReport: true,
          sex: true,
          country: true,
          state: true,
          city: true,
          lat: true,
          lng: true,
          symptoms: true,
          symptomSeverity: true,
          medications: true,
          flareFrequencyPerYear: true,
          surgeryHistory: true,
          notes: user.role === UserRole.RESEARCHER ? false : true,
          diagnosisDate: true,
          status: true,
          approvedAt: true,
          rejectionReason: true,
          createdAt: true,
          updatedAt: true,
          documentOriginalName: true,
          documentMime: true,
          documentSizeBytes: true,
          patient:
            user.role === UserRole.PATIENT
              ? false
              : {
                  select:
                    user.role === UserRole.RESEARCHER
                      ? {
                          id: true,
                          email: false,
                          name: false,
                        }
                      : {
                          id: true,
                          email: true,
                          name: true,
                        },
                },
        },
      }),
      prisma.report.count({ where }),
    ]);

    // Add hasDocument flag
    const reportsWithMetadata = reports.map((report) => ({
      ...report,
      hasDocument: !!(report.documentOriginalName && report.documentMime),
    }));

    return Response.json({
      success: true,
      data: {
        reports: reportsWithMetadata,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("List reports error:", error);

    if (error instanceof ZodError) {
      return Response.json(
        {
          success: false,
          error: "Parâmetros de busca inválidos",
          details: error.errors,
        },
        { status: 400 }
      );
    }

    return Response.json(
      { success: false, error: "Falha ao buscar relatórios" },
      { status: 500 }
    );
  }
});
