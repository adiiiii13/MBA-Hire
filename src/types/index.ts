export interface Student {
  id: string;
  name: string;
  email: string;
  phone?: string;
  college: string;
  specialization: string;
  graduation_year: number;
  cgpa: number;
  experience_years?: number;
  skills: string[];
  experience: string;
  motivation?: string;
  resume_url?: string;
  ai_prediction?: string;
  status: 'pending' | 'approved' | 'rejected' | 'shortlisted';
  created_at: string;
  updated_at: string;
}

export interface Admin {
  id: number;
  username: string;
  email: string;
  role: string;
}

export interface ApplicationFormData {
  name: string;
  email: string;
  phone?: string;
  college: string;
  specialization: string;
  graduation_year: string;
  cgpa: string;
  skills: string;
  experience: string;
  motivation?: string;
  resume?: FileList;
}