import { withAuth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { MAX_PDF_SIZE, User } from "@/lib/types";
import {
  updateReportDocumentSchema,
  validateBase64PDF,
} from "@/lib/validation";
import { ReportStatus, UserRole } from "@prisma/client";
import { NextRequest } from "next/server";
import { ZodError } from "zod";

export const dynamic = "force-dynamic";

// GET document (patients own, doctors/moderators/admins all)
export const GET = withAuth(
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

      // Researchers cannot access PDF documents
      if (user.role === UserRole.RESEARCHER) {
        return Response.json(
          {
            success: false,
            error: "Pesquisadores não podem acessar documentos PDF",
          },
          { status: 403 }
        );
      }

      // Build where conditions based on user role
      let where: any = { id: reportId };

      if (user.role === UserRole.PATIENT) {
        // Patients can only access their own reports
        where.patientId = user.id;
      }
      // Doctors, moderators, and admins can access all reports

      // Get report with document
      const report = await prisma.report.findFirst({
        where,
        select: {
          id: true,
          patientId: true,
          documentBase64: true,
          documentOriginalName: true,
          documentMime: true,
          documentSizeBytes: true,
          status: true,
        },
      });

      if (!report) {
        return Response.json(
          { success: false, error: "Relatório não encontrado" },
          { status: 404 }
        );
      }

      if (
        !report.documentBase64 ||
        !report.documentOriginalName ||
        !report.documentMime
      ) {
        return Response.json(
          {
            success: false,
            error: "Nenhum documento encontrado para o relatório",
          },
          { status: 404 }
        );
      }

      // Create audit log for document access
      await prisma.auditLog.create({
        data: {
          actorId: user.id,
          action: "ACCESS_DOCUMENT",
          entity: "Report",
          entityId: reportId,
          meta: {
            reportId,
            patientId: report.patientId,
            documentName: report.documentOriginalName,
          },
        },
      });

      return Response.json({
        success: true,
        data: {
          documentBase64: report.documentBase64,
          documentOriginalName: report.documentOriginalName,
          documentMime: report.documentMime,
          documentSizeBytes: report.documentSizeBytes,
        },
      });
    } catch (error) {
      console.error("Get document error:", error);

      return Response.json(
        { success: false, error: "Falha ao buscar documento" },
        { status: 500 }
      );
    }
  }
);

// PATCH document (patients only, must own report, status must be PENDING)
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

      // Only patients can update documents
      if (user.role !== UserRole.PATIENT) {
        return Response.json(
          {
            success: false,
            error: "Apenas pacientes podem atualizar documentos",
          },
          { status: 403 }
        );
      }

      const body = await request.json();

      // Validate input
      const validatedData = updateReportDocumentSchema(() => "").parse(body);
      const {
        documentBase64,
        documentOriginalName,
        documentMime,
        documentSizeBytes,
      } = validatedData;

      // Additional PDF validation
      const pdfValidation = validateBase64PDF(
        documentBase64,
        MAX_PDF_SIZE,
        () => ""
      );
      if (!pdfValidation.valid) {
        return Response.json(
          { success: false, error: pdfValidation.error },
          { status: 400 }
        );
      }

      // Find the report (must be owned by patient and pending)
      const existingReport = await prisma.report.findFirst({
        where: {
          id: reportId,
          patientId: user.id,
          status: ReportStatus.PENDING,
        },
        select: { id: true, status: true },
      });

      if (!existingReport) {
        return Response.json(
          {
            success: false,
            error: "Relatório não encontrado ou não pode ser modificado",
          },
          { status: 404 }
        );
      }

      // Update report document
      const updatedReport = await prisma.report.update({
        where: { id: reportId },
        data: {
          documentBase64,
          documentOriginalName,
          documentMime,
          documentSizeBytes: documentSizeBytes || pdfValidation.size,
        },
        select: {
          id: true,
          documentOriginalName: true,
          documentMime: true,
          documentSizeBytes: true,
          updatedAt: true,
        },
      });

      // Create audit log
      await prisma.auditLog.create({
        data: {
          actorId: user.id,
          action: "UPDATE_DOCUMENT",
          entity: "Report",
          entityId: reportId,
          meta: {
            reportId,
            documentName: documentOriginalName,
            documentSize: pdfValidation.size,
          },
        },
      });

      return Response.json({
        success: true,
        data: {
          report: {
            ...updatedReport,
            hasDocument: true,
          },
        },
        message: "Documento atualizado com sucesso",
      });
    } catch (error) {
      console.error("Update document error:", error);

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
        { success: false, error: "Falha ao atualizar documento" },
        { status: 500 }
      );
    }
  }
);
