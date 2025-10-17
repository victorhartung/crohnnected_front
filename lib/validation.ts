import { ReportStatus, Sex, SymptomSeverity, UserRole } from "@prisma/client";
import { z } from "zod";
import { ALLOWED_PDF_MIME, MAX_PDF_SIZE } from "./types";

// Base64 validation
const base64Regex = /^[A-Za-z0-9+/]*={0,2}$/;

export const base64Schema = z
  .string()
  .regex(base64Regex, "Invalid base64 format")
  .refine((val) => {
    try {
      // Test if it can be decoded
      const decoded = Buffer.from(val, "base64");
      return decoded.length > 0;
    } catch {
      return false;
    }
  }, "Invalid base64 string");

// PDF validation
export const pdfDocumentSchema = z
  .object({
    documentBase64: base64Schema,
    documentOriginalName: z.string().min(1, "Original filename is required"),
    documentMime: z.literal(ALLOWED_PDF_MIME),
    documentSizeBytes: z
      .number()
      .min(1, "File size must be greater than 0")
      .max(
        MAX_PDF_SIZE,
        `File size must be less than ${MAX_PDF_SIZE / 1024 / 1024}MB`
      )
      .optional(),
  })
  .refine(
    (data) => {
      // Validate that base64 size matches documentSizeBytes if provided
      if (data.documentSizeBytes) {
        const actualSize = Buffer.from(data.documentBase64, "base64").length;
        return Math.abs(actualSize - data.documentSizeBytes) <= 100; // Allow small variance for encoding
      }
      return true;
    },
    {
      message: "Document size mismatch",
    }
  );

// Authentication schemas
export const loginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const registerSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Password must contain at least one lowercase letter, one uppercase letter, and one number"
    ),
  name: z.string().min(1, "Name is required").optional(),
  role: z.nativeEnum(UserRole).optional(),
});

// User profile schemas
export const patientProfileSchema = z.object({
  birthDate: z.string().pipe(z.coerce.date()).optional(),
  sex: z.nativeEnum(Sex).optional(),
  country: z.string().optional(),
  state: z.string().optional(),
  city: z.string().optional(),
  lat: z.number().min(-90).max(90).optional(),
  lng: z.number().min(-180).max(180).optional(),
  diagnosisDate: z.string().pipe(z.coerce.date()).optional(),
});

export const doctorProfileSchema = z.object({
  licenseNumber: z.string().min(1, "License number is required"),
  specialty: z.string().optional(),
  country: z.string().optional(),
  state: z.string().optional(),
  city: z.string().optional(),
});

// Surgery history schema
export const surgerySchema = z.object({
  type: z.string().min(1, "Surgery type is required"),
  year: z.number().min(1900).max(new Date().getFullYear()).optional(),
  notes: z.string().optional(),
});

// Report schemas
export const createReportSchema = z.object({
  // Self data snapshot
  ageAtReport: z.number().min(1).max(120).optional(),
  sex: z.nativeEnum(Sex).optional(),
  country: z.string().min(1, "Country is required"),
  state: z.string().optional(),
  city: z.string().optional(),
  lat: z.number().min(-90).max(90).optional(),
  lng: z.number().min(-180).max(180).optional(),

  // Disease data
  symptoms: z
    .array(z.string().min(1))
    .min(1, "At least one symptom is required"),
  symptomSeverity: z.nativeEnum(SymptomSeverity),
  medications: z.array(z.string().min(1)).optional(),
  flareFrequencyPerYear: z.number().min(0).max(365).optional(),
  surgeryHistory: z.array(surgerySchema).optional(),
  diagnosisDate: z.string().pipe(z.coerce.date()).optional(),
  notes: z.string().max(5000, "Notes cannot exceed 5000 characters").optional(),

  // Document (optional on creation)
  documentBase64: base64Schema.optional(),
  documentOriginalName: z
    .string()
    .min(1, "Original filename is required")
    .optional(),
  documentMime: z.literal(ALLOWED_PDF_MIME).optional(),
  documentSizeBytes: z
    .number()
    .min(1, "File size must be greater than 0")
    .max(
      MAX_PDF_SIZE,
      `File size must be less than ${MAX_PDF_SIZE / 1024 / 1024}MB`
    )
    .optional(),
});

export const updateReportDocumentSchema = pdfDocumentSchema;

export const approveReportSchema = z.object({
  notes: z.string().max(1000, "Notes cannot exceed 1000 characters").optional(),
});

export const rejectReportSchema = z.object({
  reason: z
    .string()
    .min(1, "Rejection reason is required")
    .max(1000, "Reason cannot exceed 1000 characters"),
});

// Query parameter schemas
export const reportQuerySchema = z.object({
  status: z.nativeEnum(ReportStatus).optional(),
  country: z.string().optional(),
  state: z.string().optional(),
  city: z.string().optional(),
  minAge: z.string().pipe(z.coerce.number().min(1).max(120)).optional(),
  maxAge: z.string().pipe(z.coerce.number().min(1).max(120)).optional(),
  symptoms: z
    .string()
    .transform((val) => val.split(",").filter(Boolean))
    .optional(),
  medications: z
    .string()
    .transform((val) => val.split(",").filter(Boolean))
    .optional(),
  severity: z.nativeEnum(SymptomSeverity).optional(),
  period: z.string().optional(), // e.g., "2025Q1" or "2025"
  searchQuery: z.string().optional(), // General search across multiple fields
  page: z.string().pipe(z.coerce.number().min(1)).default("1"),
  limit: z.string().pipe(z.coerce.number().min(1).max(100)).default("20"),
  sortBy: z
    .enum(["createdAt", "updatedAt", "ageAtReport"])
    .default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

export const exportQuerySchema = z.object({
  format: z.enum(["csv", "json"]).default("csv"),
  status: z.nativeEnum(ReportStatus).optional(),
  country: z.string().optional(),
  state: z.string().optional(),
  city: z.string().optional(),
  minAge: z.string().pipe(z.coerce.number().min(1).max(120)).optional(),
  maxAge: z.string().pipe(z.coerce.number().min(1).max(120)).optional(),
  symptoms: z
    .string()
    .transform((val) => val.split(",").filter(Boolean))
    .optional(),
  severity: z.nativeEnum(SymptomSeverity).optional(),
  period: z.string().optional(),
  fields: z.string().optional(),
});

// Hub content schemas
export const hubContentBaseSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(200, "Title cannot exceed 200 characters"),
  summary: z
    .string()
    .max(500, "Summary cannot exceed 500 characters")
    .optional(),
  content: z.string().min(1, "Content is required"),
  tags: z.array(z.string().min(1)).optional(),
  isPublic: z.boolean().default(true),
});

export const createArticleSchema = hubContentBaseSchema.extend({
  slug: z
    .string()
    .max(100, "Slug cannot exceed 100 characters")
    .regex(
      /^[a-z0-9-]*$/,
      "Slug can only contain lowercase letters, numbers, and hyphens"
    )
    .optional()
    .or(z.literal('')),
});

export const createProtocolSchema = hubContentBaseSchema.extend({
  slug: z
    .string()
    .min(1, "Slug is required")
    .max(100, "Slug cannot exceed 100 characters")
    .regex(
      /^[a-z0-9-]+$/,
      "Slug can only contain lowercase letters, numbers, and hyphens"
    ),
});

export const createStorySchema = hubContentBaseSchema;

// Map query schemas
export const mapQuerySchema = z.object({
  country: z.string().optional(),
  state: z.string().optional(),
  city: z.string().optional(),
  minAge: z.string().pipe(z.coerce.number().min(1).max(120)).optional(),
  maxAge: z.string().pipe(z.coerce.number().min(1).max(120)).optional(),
  symptoms: z
    .string()
    .transform((val) => val.split(",").filter(Boolean))
    .optional(),
  severity: z.nativeEnum(SymptomSeverity).optional(),
  approvedOnly: z
    .string()
    .transform((val) => val === "true")
    .default("true"),
});

export const incidenceQuerySchema = z.object({
  period: z.string().optional(),
  country: z.string().optional(),
  state: z.string().optional(),
});

// Pagination helpers
export interface PaginationParams {
  page: number;
  limit: number;
  skip: number;
}

export function parsePaginationParams(query: {
  page?: string;
  limit?: string;
}): PaginationParams {
  const page = Math.max(1, parseInt(query.page || "1", 10));
  const limit = Math.min(100, Math.max(1, parseInt(query.limit || "20", 10)));
  const skip = (page - 1) * limit;

  return { page, limit, skip };
}

// Common validation helpers
export function validateBase64PDF(
  base64: string,
  maxSize: number = MAX_PDF_SIZE
): { valid: boolean; error?: string; size?: number } {
  try {
    if (!base64Regex.test(base64)) {
      return { valid: false, error: "Invalid base64 format" };
    }

    const buffer = Buffer.from(base64, "base64");
    const size = buffer.length;

    if (size > maxSize) {
      return {
        valid: false,
        error: `File size exceeds ${maxSize / 1024 / 1024}MB limit`,
      };
    }

    // Basic PDF header check
    const pdfHeader = buffer.subarray(0, 4).toString();
    if (pdfHeader !== "%PDF") {
      return { valid: false, error: "Invalid PDF format" };
    }

    return { valid: true, size };
  } catch {
    return { valid: false, error: "Invalid base64 string" };
  }
}

export function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, "") // Remove potential HTML tags
    .substring(0, 1000); // Limit length
}

export function sanitizeSearchQuery(query: string): string {
  return query
    .trim()
    .toLowerCase()
    .replace(/[^\w\s-]/g, "") // Keep only word characters, spaces, and hyphens
    .substring(0, 100); // Limit length
}

// Export type for inferred schemas
export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type CreateReportInput = z.infer<typeof createReportSchema>;
export type ReportQueryInput = z.infer<typeof reportQuerySchema>;
export type ExportQueryInput = z.infer<typeof exportQuerySchema>;
export type CreateArticleInput = z.infer<typeof createArticleSchema>;
export type CreateProtocolInput = z.infer<typeof createProtocolSchema>;
export type CreateStoryInput = z.infer<typeof createStorySchema>;
