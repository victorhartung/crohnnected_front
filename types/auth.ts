
import { UserRole } from '@prisma/client'

export interface User {
  id: string
  email: string
  name?: string | null
  role: UserRole
  profile?: PatientProfile | DoctorProfile | null
}

export interface PatientProfile {
  id: string
  userId: string
  birthDate?: Date | null
  sex?: Sex | null
  country?: string | null
  state?: string | null
  city?: string | null
  lat?: number | null
  lng?: number | null
  diagnosisDate?: Date | null
}

export interface DoctorProfile {
  id: string
  userId: string
  licenseNumber: string
  specialty?: string | null
  country?: string | null
  state?: string | null
  city?: string | null
}

export enum Sex {
  FEMALE = 'FEMALE',
  MALE = 'MALE',
  INTERSEX = 'INTERSEX',
  OTHER = 'OTHER',
  UNSPECIFIED = 'UNSPECIFIED'
}
