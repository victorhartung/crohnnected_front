import { withAuth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { User } from "@/lib/types";
import { ReportStatus, UserRole } from "@prisma/client";
import { NextRequest } from "next/server";
import { z } from "zod";

export const dynamic = "force-dynamic";

// --- SCHEMA CORRIGIDO (com coerção automática) ---
export const reportQuerySchema = z.object({
  status: z.nativeEnum(ReportStatus).optional(),
  country: z.string().optional(),
  state: z.string().optional(),
  city: z.string().optional(),
  minAge: z.coerce.number().optional(),
  maxAge: z.coerce.number().optional(),
  symptoms: z
    .preprocess(
      (val) =>
        typeof val === "string"
          ? val
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean)
          : val,
      z.array(z.string())
    )
    .optional(),
  medications: z
    .preprocess(
      (val) =>
        typeof val === "string"
          ? val
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean)
          : val,
      z.array(z.string())
    )
    .optional(),
  severity: z.string().optional(),
  period: z.string().optional(),
  searchQuery: z.string().optional(),
});

// --- FUNÇÃO DE CONSTRUÇÃO DO WHERE ---
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

// --- HANDLER PRINCIPAL ---
export const GET = withAuth(async (request: NextRequest, user: User) => {
  try {
    const url = new URL(request.url);
    const queryParams = Object.fromEntries(url.searchParams.entries());
    const query = reportQuerySchema.partial().parse(queryParams);

    const {
      roleWhere,
      conditions,
      symptomSearchTerms,
      medicationSearchTerms,
      searchQueryTerms,
    } = buildBaseWhere(user, query);

    let baseWhere: any;

    // Combine filters using AND logic
    if (conditions.length === 0) {
      baseWhere = roleWhere;
    } else {
      baseWhere = { AND: [roleWhere, ...conditions] };
    }

    // Symptoms filter (matches any of the provided symptom terms)
    if (symptomSearchTerms.length > 0) {
      const symptomIds = await prisma.$queryRawUnsafe<{ id: number }[]>(
        `
        SELECT DISTINCT id FROM reports
        WHERE ${symptomSearchTerms
          .map(
            (_, i) =>
              `EXISTS (
                SELECT 1 FROM jsonb_array_elements_text("symptoms") elem
                WHERE elem ILIKE '%' || $${i + 1} || '%'
              )`
          )
          .join(" OR ")}
        `,
        ...symptomSearchTerms
      );

      const ids = symptomIds.map((r) => r.id);
      if (ids.length > 0) {
        baseWhere = { AND: [baseWhere, { id: { in: ids } }] };
      } else {
        baseWhere = { id: { in: [] } };
      }
    }

    // Medications filter (matches any of the provided medication terms)
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
        baseWhere = { AND: [baseWhere, { id: { in: ids } }] };
      } else {
        baseWhere = { id: { in: [] } };
      }
    }

    // General search across multiple fields (all terms must match somewhere => AND between terms)
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
        baseWhere = { AND: [baseWhere, { id: { in: ids } }] };
      } else {
        baseWhere = { id: { in: [] } };
      }
    }

    if (user.role === UserRole.RESEARCHER) {
      const approvedCount = await prisma.report.count({ where: baseWhere });
      return Response.json({
        success: true,
        data: {
          all: approvedCount,
          pending: 0,
          approved: approvedCount,
          rejected: 0,
        },
      });
    }

    // Build baseNoStatus by removing any status conditions so we can compute per-status counts
    let baseNoStatus: any = { ...roleWhere };

    // Rebuild the where clause without status filter
    const conditionsWithoutStatus = conditions.filter(
      (cond: any) => !cond.status
    );
    if (conditionsWithoutStatus.length > 0) {
      baseNoStatus = { AND: [roleWhere, ...conditionsWithoutStatus] };
    }

    // Apply symptoms filter to baseNoStatus
    if (symptomSearchTerms.length > 0) {
      const symptomIds = await prisma.$queryRawUnsafe<{ id: number }[]>(
        `
        SELECT DISTINCT id FROM reports
        WHERE ${symptomSearchTerms
          .map(
            (_, i) =>
              `EXISTS (
                SELECT 1 FROM jsonb_array_elements_text("symptoms") elem
                WHERE elem ILIKE '%' || $${i + 1} || '%'
              )`
          )
          .join(" OR ")}
        `,
        ...symptomSearchTerms
      );

      const ids = symptomIds.map((r) => r.id);
      if (ids.length > 0) {
        baseNoStatus = { AND: [baseNoStatus, { id: { in: ids } }] };
      } else {
        baseNoStatus = { id: { in: [] } };
      }
    }

    // Apply medications filter to baseNoStatus
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
        baseNoStatus = { AND: [baseNoStatus, { id: { in: ids } }] };
      } else {
        baseNoStatus = { id: { in: [] } };
      }
    }

    // Apply search query filter to baseNoStatus
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
        baseNoStatus = { AND: [baseNoStatus, { id: { in: ids } }] };
      } else {
        baseNoStatus = { id: { in: [] } };
      }
    }

    // Count all reports with the current filters (including status if specified)
    const allCount = await prisma.report.count({ where: baseWhere });

    // Count by status using baseNoStatus (without status filter)
    const [pending, approved, rejected] = await Promise.all([
      prisma.report.count({
        where: { AND: [baseNoStatus, { status: ReportStatus.PENDING }] },
      }),
      prisma.report.count({
        where: { AND: [baseNoStatus, { status: ReportStatus.APPROVED }] },
      }),
      prisma.report.count({
        where: { AND: [baseNoStatus, { status: ReportStatus.REJECTED }] },
      }),
    ]);

    return Response.json({
      success: true,
      data: { allCount, pending, approved, rejected },
    });
  } catch (error) {
    console.error("Reports counts error:", error);
    return Response.json(
      { success: false, error: "Falha ao buscar contagem de relatórios" },
      { status: 500 }
    );
  }
});
