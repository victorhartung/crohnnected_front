
import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import { withAuth } from '@/lib/auth';
import { exportQuerySchema } from '@/lib/validation';
import { User } from '@/lib/types';
import { UserRole, ReportStatus } from '@prisma/client';
import { ZodError } from 'zod';

export const dynamic = 'force-dynamic';

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
          surgeryHistory: true,
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
          createdAt: 'desc',
        },
      });

      // Create audit log
      await prisma.auditLog.create({
        data: {
          actorId: user.id,
          action: 'EXPORT_DATA',
          entity: 'Report',
          entityId: 'bulk_export',
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

      if (query.format === 'csv') {
        // Generate CSV
        const headers = [
          'id',
          'ageAtReport',
          'sex',
          'country',
          'state',
          'city',
          'symptoms',
          'symptomSeverity',
          'medications',
          'flareFrequencyPerYear',
          'surgeryHistory',
          'diagnosisDate',
          'status',
          'approvedAt',
          'createdAt'
        ];

        const csvRows = [
          headers.join(','),
          ...reports.map(report => {
            return [
              report.id,
              report.ageAtReport || '',
              report.sex || '',
              report.country || '',
              report.state || '',
              report.city || '',
              `"${Array.isArray(report.symptoms) ? (report.symptoms as string[]).join('; ') : ''}"`,
              report.symptomSeverity,
              `"${Array.isArray(report.medications) ? (report.medications as string[]).join('; ') : ''}"`,
              report.flareFrequencyPerYear || '',
              `"${Array.isArray(report.surgeryHistory) ? JSON.stringify(report.surgeryHistory) : ''}"`,
              report.diagnosisDate ? new Date(report.diagnosisDate).toISOString().split('T')[0] : '',
              report.status,
              report.approvedAt ? new Date(report.approvedAt).toISOString() : '',
              new Date(report.createdAt).toISOString()
            ].join(',');
          })
        ];

        const csvContent = csvRows.join('\n');
        const timestamp = new Date().toISOString().split('T')[0];
        
        return new Response(csvContent, {
          status: 200,
          headers: {
            'Content-Type': 'text/csv',
            'Content-Disposition': `attachment; filename="crohnnected-reports-${timestamp}.csv"`,
          },
        });

      } else {
        // Return JSON
        const timestamp = new Date().toISOString().split('T')[0];
        
        return Response.json({
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
        }, {
          headers: {
            'Content-Disposition': `attachment; filename="crohnnected-reports-${timestamp}.json"`,
          },
        });
      }

    } catch (error) {
      console.error('Export reports error:', error);

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
        { success: false, error: 'Failed to export reports' },
        { status: 500 }
      );
    }
  },
  [UserRole.RESEARCHER, UserRole.DOCTOR, UserRole.MODERATOR, UserRole.ADMIN] // Allow researchers and higher roles
);
