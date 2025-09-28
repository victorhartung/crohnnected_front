import { z } from "zod";

// Auth validation schemas
export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const registerSchema = z
  .object({
    email: z.string().email("Invalid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Password must contain at least one lowercase letter, one uppercase letter, and one number"
      ),
    confirmPassword: z
      .string()
      .min(8, "Password must be at least 8 characters"),
    name: z.string().min(2, "Name must be at least 2 characters"),
    role: z
      .enum(["PATIENT", "DOCTOR", "RESEARCHER"] as const)
      .default("PATIENT"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

// Profile validation schemas
export const patientProfileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  birthDate: z.string().optional(),
  sex: z
    .enum(["FEMALE", "MALE", "INTERSEX", "OTHER", "UNSPECIFIED"] as const)
    .optional(),
  country: z.string().optional(),
  state: z.string().optional(),
  city: z.string().optional(),
  diagnosisDate: z.string().optional(),
});

export const doctorProfileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  licenseNumber: z.string().min(1, "License number is required"),
  specialty: z.string().optional(),
  country: z.string().optional(),
  state: z.string().optional(),
  city: z.string().optional(),
});

// Reports validation schemas
export const reportSchema = z.object({
  ageAtReport: z.number().min(0).max(150).optional(),
  sex: z
    .enum(["FEMALE", "MALE", "INTERSEX", "OTHER", "UNSPECIFIED"] as const)
    .optional(),
  country: z.string().min(1, "Country is required"),
  state: z.string().optional(),
  city: z.string().optional(),
  lat: z.number().optional(),
  lng: z.number().optional(),
  symptoms: z.array(z.string()).min(1, "At least one symptom is required"),
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

export const rejectReportSchema = z.object({
  reason: z.string().min(1, "Rejection reason is required"),
});

// File validation
export const fileSchema = z.object({
  file: z.any().refine((file) => {
    return file instanceof File && file.type === "application/pdf";
  }, "Must be a PDF file"),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type PatientProfileInput = z.infer<typeof patientProfileSchema>;
export type DoctorProfileInput = z.infer<typeof doctorProfileSchema>;
export type ReportInput = z.infer<typeof reportSchema>;
export type ApproveReportInput = z.infer<typeof approveReportSchema>;
export type RejectReportInput = z.infer<typeof rejectReportSchema>;
