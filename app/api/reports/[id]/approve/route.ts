import { withAuth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { User } from "@/lib/types";
import { approveReportSchema } from "@/lib/validation";
import { ReportStatus, UserRole } from "@prisma/client";
import { NextRequest } from "next/server";
import { ZodError } from "zod";

export const dynamic = "force-dynamic";

// APPROVE report (doctors only)
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
      const validatedData = approveReportSchema(() => "").parse(body);
      const { notes } = validatedData;

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
            error: "Apenas relatórios pendentes podem ser aprovados",
          },
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
          action: "APPROVE_REPORT",
          entity: "Report",
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
        message: "Relatório aprovado com sucesso",
      });
    } catch (error) {
      console.error("Approve report error:", error);

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
        { success: false, error: "Falha ao aprovar relatório" },
        { status: 500 }
      );
    }
  },
  [UserRole.DOCTOR, UserRole.ADMIN] // Allow doctors and admins to approve reports
);
