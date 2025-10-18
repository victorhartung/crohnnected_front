import { withAuth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { User } from "@/lib/types";
import { rejectReportSchema } from "@/lib/validation";
import { ReportStatus, UserRole } from "@prisma/client";
import { NextRequest } from "next/server";
import { ZodError } from "zod";

export const dynamic = "force-dynamic";

// REJECT report (doctors only)
export const PATCH = withAuth(
  async (
    request: NextRequest,
    user: User,
    { params }: { params: { id: string } }
  ) => {
    try {
      const reportId = params.id;

      if (!reportId) {
        return Response.json(
          { success: false, error: "ID do relatório é obrigatório" },
          { status: 400 }
        );
      }

      const body = await request.json();

      // Validate input
      const validatedData = rejectReportSchema(() => "").parse(body);
      const { reason } = validatedData;

      // Find the report
      const existingReport = await prisma.report.findUnique({
        where: { id: reportId },
        select: { id: true, status: true, patientId: true },
      });

      if (!existingReport) {
        return Response.json(
          { success: false, error: "Relatório não encontrado" },
          { status: 404 }
        );
      }

      if (existingReport.status !== ReportStatus.PENDING) {
        return Response.json(
          {
            success: false,
            error: "Apenas relatórios pendentes podem ser rejeitados",
          },
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
          action: "REJECT_REPORT",
          entity: "Report",
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
        message: "Relatório rejeitado com sucesso",
      });
    } catch (error) {
      console.error("Reject report error:", error);

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
        { success: false, error: "Falha ao rejeitar relatório" },
        { status: 500 }
      );
    }
  },
  [UserRole.DOCTOR, UserRole.ADMIN] // Allow doctors and admins to reject reports
);
