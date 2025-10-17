
import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import { withAuth } from '@/lib/auth';
import { rejectReportSchema } from '@/lib/validation';
import { User } from '@/lib/types';
import { UserRole, ReportStatus } from '@prisma/client';
import { ZodError } from 'zod';

export const dynamic = 'force-dynamic';

// REJECT report (doctors only)
export const PATCH = withAuth(
  async (request: NextRequest, user: User, { params }: { params: { id: string } }) => {
    try {
      const reportId = params.id;

      if (!reportId) {
        return Response.json(
          { success: false, error: 'Report ID is required' },
          { status: 400 }
        );
      }

      const body = await request.json();
      
      // Validate input
      const validatedData = rejectReportSchema.parse(body);
      const { reason } = validatedData;

      // Find the report
      const existingReport = await prisma.report.findUnique({
        where: { id: reportId },
        select: { id: true, status: true, patientId: true },
      });

      if (!existingReport) {
        return Response.json(
          { success: false, error: 'Report not found' },
          { status: 404 }
        );
      }

      if (existingReport.status !== ReportStatus.PENDING) {
        return Response.json(
          { success: false, error: 'Only pending reports can be rejected' },
          { status: 400 }
        );
      }

      // Update report
      const updatedReport = await prisma.report.update({
        where: { id: reportId },
        data: {
          status: ReportStatus.REJECTED,
          rejectionReason: reason,
          approvedById: null, // Clear any previous approval
          approvedAt: null,
        },
        select: {
          id: true,
          status: true,
          rejectionReason: true,
          patient: {
            select: {
              id: true,
              email: true,
              name: true,
            },
          },
        },
      });

      // Create audit log
      await prisma.auditLog.create({
        data: {
          actorId: user.id,
          action: 'REJECT_REPORT',
          entity: 'Report',
          entityId: reportId,
          meta: {
            reportId,
            patientId: existingReport.patientId,
            rejectionReason: reason,
          },
        },
      });

      return Response.json({
        success: true,
        data: {
          report: updatedReport,
        },
        message: 'Report rejected successfully',
      });

    } catch (error) {
      console.error('Reject report error:', error);

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
        { success: false, error: 'Failed to reject report' },
        { status: 500 }
      );
    }
  },
  [UserRole.DOCTOR, UserRole.ADMIN] // Allow doctors and admins to reject reports
);
