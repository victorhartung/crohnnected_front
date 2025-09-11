
import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import { withAuth, checkRateLimit, getRateLimitKey } from '@/lib/auth';
import { createReportSchema, reportQuerySchema, parsePaginationParams } from '@/lib/validation';
import { User } from '@/lib/types';
import { UserRole, ReportStatus } from '@prisma/client';
import { ZodError } from 'zod';

export const dynamic = 'force-dynamic';

// CREATE Report
export const POST = withAuth(async (request: NextRequest, user: User) => {
  try {
    // Only patients can create reports
    if (user.role !== UserRole.PATIENT) {
      return Response.json(
        { success: false, error: 'Only patients can create reports' },
        { status: 403 }
      );
    }

    // Rate limiting for report creation
    const rateLimitKey = getRateLimitKey(request, 'create-report');
    if (!checkRateLimit(rateLimitKey, 5, 60 * 60 * 1000)) { // 5 reports per hour
      return Response.json(
        { success: false, error: 'Too many report creation attempts. Please try again later.' },
        { status: 429 }
      );
    }

    const body = await request.json();
    
    // Validate input
    const validatedData = createReportSchema.parse(body);

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
        action: 'CREATE_REPORT',
        entity: 'Report',
        entityId: report.id,
        meta: {
          reportId: report.id,
          hasDocument: !!report.documentBase64,
        },
      },
    });

    return Response.json({
      success: true,
      data: {
        report: {
          ...report,
          hasDocument: !!report.documentBase64,
          // Don't return the base64 data in the response
          documentBase64: undefined,
        },
      },
    }, { status: 201 });

  } catch (error) {
    console.error('Create report error:', error);

    if (error instanceof ZodError) {
      return Response.json(
        { 
          success: false, 
          error: 'Validation failed',
          details: error.errors
        },
        { status: 400 }
      );
    }

    return Response.json(
      { success: false, error: 'Failed to create report' },
      { status: 500 }
    );
  }
});

// LIST Reports
export const GET = withAuth(async (request: NextRequest, user: User) => {
  try {
    const url = new URL(request.url);
    const queryParams = Object.fromEntries(url.searchParams.entries());
    
    // Validate query parameters
    const query = reportQuerySchema.parse(queryParams);
    const { page, limit, skip } = parsePaginationParams({ page: query.page.toString(), limit: query.limit.toString() });

    // Build where conditions based on user role
    let where: any = {};

    if (user.role === UserRole.PATIENT) {
      // Patients can only see their own reports
      where.patientId = user.id;
    } else if (user.role === UserRole.RESEARCHER) {
      // Researchers can only see approved reports
      where.status = ReportStatus.APPROVED;
    }
    // Doctors, moderators, and admins can see all reports

    // Apply filters
    if (query.status) {
      // Patients and researchers have restricted status access
      if (user.role === UserRole.PATIENT || 
          (user.role === UserRole.RESEARCHER && query.status !== ReportStatus.APPROVED)) {
        where.status = user.role === UserRole.RESEARCHER ? ReportStatus.APPROVED : query.status;
      } else {
        where.status = query.status;
      }
    }

    if (query.country) where.country = { contains: query.country, mode: 'insensitive' };
    if (query.state) where.state = { contains: query.state, mode: 'insensitive' };
    if (query.city) where.city = { contains: query.city, mode: 'insensitive' };
    
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

    // Period filter (match year or quarter)
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

    // Get reports and total count
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
          notes: user.role === UserRole.RESEARCHER ? false : true, // Hide notes from researchers
          diagnosisDate: true,
          status: true,
          approvedAt: true,
          rejectionReason: true,
          createdAt: true,
          updatedAt: true,
          // Document metadata only
          documentOriginalName: true,
          documentMime: true,
          documentSizeBytes: true,
          // Patient info for non-patients (pseudonymized for researchers)
          patient: user.role === UserRole.PATIENT ? false : {
            select: user.role === UserRole.RESEARCHER ? {
              // Pseudonymized data for researchers
              id: false,
              email: false,
              name: false,
            } : {
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
    const reportsWithMetadata = reports.map(report => ({
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
    console.error('List reports error:', error);

    if (error instanceof ZodError) {
      return Response.json(
        { 
          success: false, 
          error: 'Invalid query parameters',
          details: error.errors
        },
        { status: 400 }
      );
    }

    return Response.json(
      { success: false, error: 'Failed to fetch reports' },
      { status: 500 }
    );
  }
});
