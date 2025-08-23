
export enum UserRole {
  PATIENT = 'PATIENT',
  HEALTHCARE_PROFESSIONAL = 'HEALTHCARE_PROFESSIONAL',
  FAMILY_SUPPORT_MEMBER = 'FAMILY_SUPPORT_MEMBER'
}

export interface User {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  dateOfBirth?: string;
  phoneNumber?: string;
  role: UserRole;
  isActive: boolean;
  isEmailVerified: boolean;
  bio?: string;
  location?: string;
  createdAt: string;
  updatedAt: string;
  lastLogin?: string;
}

export interface LoginRequest {
  usernameOrEmail: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  dateOfBirth?: string;
  phoneNumber?: string;
  role: UserRole;
  bio?: string;
  location?: string;
}

export interface AuthResponse {
  token: string;
  tokenType: string;
  user: User;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
}

export const getRoleDisplayName = (role: UserRole): string => {
  switch (role) {
    case UserRole.PATIENT:
      return 'Patient';
    case UserRole.HEALTHCARE_PROFESSIONAL:
      return 'Healthcare Professional';
    case UserRole.FAMILY_SUPPORT_MEMBER:
      return 'Family Support Member';
    default:
      return '';
  }
};

export const getRoleDescription = (role: UserRole): string => {
  switch (role) {
    case UserRole.PATIENT:
      return 'Individual with Crohn\'s disease';
    case UserRole.HEALTHCARE_PROFESSIONAL:
      return 'Medical practitioner or healthcare provider';
    case UserRole.FAMILY_SUPPORT_MEMBER:
      return 'Family member or caregiver providing support';
    default:
      return '';
  }
};
