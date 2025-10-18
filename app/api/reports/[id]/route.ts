import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { withAuth } from "@/lib/auth";
import { User } from "@/lib/types";
import { UserRole, ReportStatus } from "@prisma/client";

export const dynamic = "force-dynamic";

// GET specific report
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

      // Build where conditions based on user role
      let where: any = { id: reportId };

      if (user.role === UserRole.PATIENT) {
        // Patients can only see their own reports
        where.patientId = user.id;
      } else if (user.role === UserRole.RESEARCHER) {
        // Researchers can only see approved reports
        where.status = ReportStatus.APPROVED;
      }
      // Doctors, moderators, and admins can see all reports

      // Get report
      const report = await prisma.report.findFirst({
        where,
        select: {
          id: true,
          patientId: true,
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
          approvedById: true,
          approvedAt: true,
          rejectionReason: true,
          createdAt: true,
          updatedAt: true,
          // Document metadata only (not the actual base64)
          documentOriginalName: true,
          documentMime: true,
          documentSizeBytes: true,
          // Patient info for non-patients (pseudonymized for researchers)
          patient:
            user.role === UserRole.PATIENT
              ? false
              : {
                  select:
                    user.role === UserRole.RESEARCHER
                      ? {
                          // Pseudonymized data for researchers
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
          // Approver info
          approvedBy: {
            select: {
              id: true,
              name: true,
              email: user.role === UserRole.RESEARCHER ? false : true,
            },
          },
        },
      });

      if (!report) {
        return Response.json(
          { success: false, error: "Relatório não encontrado" },
          { status: 404 }
        );
      }

      // Add hasDocument flag
      const reportWithMetadata = {
        ...report,
        hasDocument: !!(report.documentOriginalName && report.documentMime),
      };

      return Response.json({
        success: true,
        data: {
          report: reportWithMetadata,
        },
      });
    } catch (error) {
      console.error("Get report error:", error);

      return Response.json(
        { success: false, error: "Falha ao buscar relatório" },
        { status: 500 }
      );
    }
  }
);
