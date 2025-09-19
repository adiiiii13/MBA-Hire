export interface ApplicationData {
  id?: string;
  name: string;
  email: string;
  phone?: string;
  location?: string; // Add location field
  college: string;
  specialization: string;
  graduation_year: number;
  cgpa: number;
  skills: string;
  experience: string;
  motivation?: string;
  resume_url?: string;
  ai_prediction?: string;
  ai_strengths?: string;
  ai_weaknesses?: string;
  status: 'pending' | 'approved' | 'rejected' | 'shortlisted';
  created_at?: string;
  updated_at?: string;
}

export interface AdminData {
  id?: number;
  email: string;
  password?: string;
  name: string;
  role: 'admin' | 'super_admin';
  created_at?: string;
  updated_at?: string;
}

export interface ApplicationFileData {
  id?: number;
  application_id: string;
  file_name: string;
  file_path: string;
  file_type: string;
  file_size: number;
  uploaded_at?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface JwtPayload {
  id: number;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface QueryFilters {
  status?: string;
  specialization?: string;
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface UploadedFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  destination: string;
  filename: string;
  path: string;
}

import { Request } from 'express';

// Request types with user authentication
export interface AuthenticatedRequest extends Request {
  user?: {
    id: number;
    email: string;
    role: string;
  };
}

// Database result types
export interface DatabaseResult {
  affectedRows: number;
  insertId: number;
  warningCount: number;
}

// Statistics interface for dashboard
export interface ApplicationStats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  shortlisted: number;
  bySpecialization: Array<{
    specialization: string;
    count: number;
  }>;
  recentApplications: number; // last 7 days
}
