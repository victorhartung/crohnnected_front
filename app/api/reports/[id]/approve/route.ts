
import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import { withAuth } from '@/lib/auth';
import { approveReportSchema } from '@/lib/validation';
import { User } from '@/lib/types';
import { UserRole, ReportStatus } from '@prisma/client';
import { ZodError } from 'zod';

export const dynamic = 'force-dynamic';

// APPROVE report (doctors only)
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
      const validatedData = approveReportSchema.parse(body);
      const { notes } = validatedData;

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
          { success: false, error: 'Only pending reports can be approved' },
          { status: 400 }
        );
      }

      // Update report
      const updatedReport = await prisma.report.update({
        where: { id: reportId },
        data: {
          status: ReportStatus.APPROVED,
          approvedById: user.id,
          approvedAt: new Date(),
          rejectionReason: null, // Clear any previous rejection reason
        },
        select: {
          id: true,
          status: true,
          approvedById: true,
          approvedAt: true,
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
          action: 'APPROVE_REPORT',
          entity: 'Report',
          entityId: reportId,
          meta: {
            reportId,
            patientId: existingReport.patientId,
            approverNotes: notes,
            approvedAt: updatedReport.approvedAt,
          },
        },
      });

      return Response.json({
        success: true,
        data: {
          report: updatedReport,
        },
        message: 'Report approved successfully',
      });

    } catch (error) {
      console.error('Approve report error:', error);

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
        { success: false, error: 'Failed to approve report' },
        { status: 500 }
      );
    }
  },
  [UserRole.DOCTOR] // Only doctors can approve reports
);
