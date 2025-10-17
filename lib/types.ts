import { UserRole, Sex, SymptomSeverity, ReportStatus } from '@prisma/client';

export interface User {
  id: string;
  email: string;
  name?: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export interface PatientProfile {
  id: string;
  userId: string;
  birthDate?: Date;
  sex?: Sex;
  country?: string;
  state?: string;
  city?: string;
  lat?: number;
  lng?: number;
  diagnosisDate?: Date;
}

export interface DoctorProfile {
  id: string;
  userId: string;
  licenseNumber: string;
  specialty?: string;
  country?: string;
  state?: string;
  city?: string;
}

export interface Report {
  id: string;
  patientId: string;
  documentBase64?: string;
  documentOriginalName?: string;
  documentMime?: string;
  documentSizeBytes?: number;
  ageAtReport?: number;
  sex?: Sex;
  country?: string;
  state?: string;
  city?: string;
  lat?: number;
  lng?: number;
  symptoms: string[];
  symptomSeverity: SymptomSeverity;
  medications?: string[];
  flareFrequencyPerYear?: number;
  surgeryHistory?: SurgeryRecord[];
  notes?: string;
  diagnosisDate?: Date;
  status: ReportStatus;
  approvedById?: string;
  approvedAt?: Date;
  rejectionReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface SurgeryRecord {
  type: string;
  year?: number;
  notes?: string;
}

export interface HubContent {
  id: string;
  title: string;
  slug?: string;
  summary?: string;
  content: string;
  tags?: string[];
  isPublic: boolean;
  createdById: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IncidenceStat {
  id: string;
  regionCode: string;
  regionName: string;
  country?: string;
  state?: string;
  city?: string;
  lat: number;
  lng: number;
  period: string;
  cases: number;
  source?: string;
  updatedAt: Date;
}

export interface AuditLog {
  id: string;
  actorId: string;
  action: string;
  entity: string;
  entityId: string;
  meta?: any;
  createdAt: Date;
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface ReportListResponse {
  reports: (Report & {
    hasDocument: boolean;
    patient?: { name?: string };
  })[];
  total: number;
  page: number;
  limit: number;
}

export interface MapReportFeature {
  type: 'Feature';
  geometry: {
    type: 'Point';
    coordinates: [number, number]; // [lng, lat]
  };
  properties: {
    id: string;
    ageAtReport?: number;
    severity: SymptomSeverity;
    symptoms: string[];
    city?: string;
    state?: string;
    country?: string;
    createdAt: Date;
  };
}

export interface MapIncidenceData {
  period: string;
  regions: {
    regionCode: string;
    name: string;
    lat: number;
    lng: number;
    cases: number;
  }[];
}

// Authentication Types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name?: string;
  role?: UserRole;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
}

export interface JWTPayload {
  userId: string;
  email: string;
  role: UserRole;
  iat?: number;
  exp?: number;
}

// Validation Constants
export const MAX_PDF_SIZE = 10 * 1024 * 1024; // 10MB
export const ALLOWED_PDF_MIME = 'application/pdf';

export const COMMON_SYMPTOMS = [
  'Abdominal pain',
  'Diarrhea',
  'Fatigue',
  'Weight loss',
  'Nausea',
  'Vomiting',
  'Bloating',
  'Rectal bleeding',
  'Joint pain',
  'Skin problems',
  'Eye inflammation',
  'Mouth sores',
  'Loss of appetite',
  'Fever',
  'Night sweats'
];

export const COMMON_MEDICATIONS = [
  'Mesalamine',
  'Prednisone',
  'Azathioprine',
  'Methotrexate',
  'Infliximab',
  'Adalimumab',
  'Certolizumab',
  'Vedolizumab',
  'Ustekinumab',
  'Tofacitinib',
  'Budesonide',
  '6-Mercaptopurine',
  'Sulfasalazine',
  'Probiotics',
  'Iron supplements'
];