import { z } from "zod";

// Auth validation schemas
export const loginSchema = (t: (key: string) => string) =>
  z.object({
    email: z.string().email(t("validation.invalidEmail")),
    password: z.string().min(8, t("validation.passwordTooShortRegister")),
  });

export const registerSchema = (t: (key: string) => string) =>
  z
    .object({
      email: z.string().email(t("validation.invalidEmail")),
      password: z
        .string()
        .min(8, t("validation.passwordTooShortRegister"))
        .regex(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
          t("validation.passwordTooWeak")
        ),
      confirmPassword: z
        .string()
        .min(8, t("validation.passwordTooShortRegister")),
      name: z.string().min(2, t("validation.invalidName")),
      role: z
        .enum(["PATIENT", "DOCTOR", "RESEARCHER"] as const)
        .default("PATIENT"),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t("validation.passwordsDoNotMatch"),
      path: ["confirmPassword"],
    });

// Profile validation schemas
export const patientProfileSchema = (t: (key: string) => string) =>
  z.object({
    name: z.string().min(2, t("validation.invalidName")),
    birthDate: z.string().optional(),
    sex: z
      .enum(["FEMALE", "MALE", "INTERSEX", "OTHER", "UNSPECIFIED"] as const)
      .optional(),
    country: z.string().optional(),
    state: z.string().optional(),
    city: z.string().optional(),
    diagnosisDate: z.string().optional(),
  });

export const doctorProfileSchema = (t: (key: string) => string) =>
  z.object({
    name: z.string().min(2, t("validation.invalidName")),
    licenseNumber: z.string().min(1, t("validation.requiredLicenseNumber")),
    specialty: z.string().optional(),
    country: z.string().optional(),
    state: z.string().optional(),
    city: z.string().optional(),
  });

// Reports validation schemas
export const reportSchema = (t: (key: string) => string) =>
  z.object({
    ageAtReport: z.number().min(0).max(150).optional(),
    sex: z
      .enum(["FEMALE", "MALE", "INTERSEX", "OTHER", "UNSPECIFIED"] as const)
      .optional(),
    country: z.string().min(1, t("validation.requiredCountry")),
    state: z.string().optional(),
    city: z.string().optional(),
    lat: z.number().optional(),
    lng: z.number().optional(),
    symptoms: z.array(z.string()).min(1, t("validation.requiredSymptom")),
    symptomSeverity: z.enum(["MILD", "MODERATE", "SEVERE"] as const),
    medications: z.array(z.string()).optional(),
    flareFrequencyPerYear: z.number().min(0).optional(),
    surgeryHistory: z
      .array(
        z.object({
          type: z.string(),
          year: z.number().optional(),
          notes: z.string().optional(),
        })
      )
      .optional(),
    diagnosisDate: z.string().optional(),
    notes: z.string().optional(),
    documentBase64: z.string().optional(),
    documentOriginalName: z.string().optional(),
    documentMime: z.string().optional(),
    documentSizeBytes: z.number().optional(),
  });

export const approveReportSchema = z.object({
  notes: z.string().optional(),
});

export const rejectReportSchema = (t: (key: string) => string) =>
  z.object({
    reason: z.string().min(1, t("validation.requiredRejectionReason")),
  });

// File validation
export const fileSchema = (t: (key: string) => string) =>
  z.object({
    file: z.any().refine((file) => {
      return file instanceof File && file.type === "application/pdf";
    }, t("validation.requiredPDF")),
  });

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type PatientProfileInput = z.infer<typeof patientProfileSchema>;
export type DoctorProfileInput = z.infer<typeof doctorProfileSchema>;
export type ReportInput = z.infer<typeof reportSchema>;
export type ApproveReportInput = z.infer<typeof approveReportSchema>;
export type RejectReportInput = z.infer<typeof rejectReportSchema>;
