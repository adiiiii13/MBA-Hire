// API base URL - change this to your backend server URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// API response interface
interface ApiResponse<T = any> {
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

// Types
interface ApplicationFormData {
  name: string;
  email: string;
  phone: string; // Made required
  location: string; // Added location field
  college: string;
  specialization: string;
  graduation_year: string;
  cgpa: string;
  skills: string;
  experience: string;
  motivation?: string;
}

interface Student {
  id: string;
  name: string;
  email: string;
  phone: string; // Made required
  location: string; // Added location field
  college: string;
  specialization: string;
  graduation_year: number;
  cgpa: number;
  skills: string[] | string; // Allow both formats for flexibility
  experience: string;
  motivation?: string;
  resume_url?: string;
  ai_prediction?: string;
  status: 'pending' | 'approved' | 'rejected' | 'shortlisted';
  created_at: string;
  updated_at: string;
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface AuthResponse {
  token: string;
  admin: {
    id: number;
    email: string;
    name: string;
    role: string;
  };
}

// Token management
class TokenManager {
  private static TOKEN_KEY = 'auth_token';

  static getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  static setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  static removeToken(): void {
    localStorage.removeItem(this.TOKEN_KEY);
  }

  static isAuthenticated(): boolean {
    return !!this.getToken();
  }
}

// HTTP client with authentication
class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    const token = TokenManager.getToken();

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error(`API request failed: ${endpoint}`, error);
      throw error;
    }
  }

  private async requestWithFormData<T>(
    endpoint: string,
    formData: FormData,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    const token = TokenManager.getToken();

    const headers: HeadersInit = {
      ...options.headers,
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, {
        method: 'POST',
        ...options,
        headers,
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error(`API request failed: ${endpoint}`, error);
      throw error;
    }
  }

  // Authentication methods
  async login(credentials: LoginCredentials): Promise<ApiResponse<AuthResponse>> {
    return this.request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async logout(): Promise<ApiResponse> {
    return this.request('/auth/logout', {
      method: 'POST',
    });
  }

  async getMe(): Promise<ApiResponse> {
    return this.request('/auth/me');
  }

  // Application methods
  async submitApplication(
    applicationData: ApplicationFormData,
    resumeFile?: File
  ): Promise<ApiResponse> {
    const formData = new FormData();

    // Add form fields
    Object.entries(applicationData).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, value.toString());
      }
    });

    // Add resume file if provided
    if (resumeFile) {
      formData.append('resume', resumeFile);
    }

    return this.requestWithFormData('/applications', formData);
  }

  async getApplications(params?: {
    status?: string;
    specialization?: string;
    search?: string;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }): Promise<ApiResponse<Student[]>> {
    const queryParams = new URLSearchParams();
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value.toString());
        }
      });
    }

    const queryString = queryParams.toString();
    const endpoint = `/applications${queryString ? `?${queryString}` : ''}`;

    return this.request<Student[]>(endpoint);
  }

  async getApplicationById(id: string): Promise<ApiResponse<Student>> {
    return this.request<Student>(`/applications/${id}`);
  }

  async updateApplicationStatus(
    id: string,
    status: Student['status'],
    aiPrediction?: string
  ): Promise<ApiResponse> {
    return this.request(`/applications/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({
        status,
        ai_prediction: aiPrediction,
      }),
    });
  }

  async deleteApplication(id: string): Promise<ApiResponse> {
    return this.request(`/applications/${id}`, {
      method: 'DELETE',
    });
  }

  // Admin methods
  async getDashboardStats(): Promise<ApiResponse> {
    return this.request('/admin/stats');
  }

  async getRecentApplications(limit?: number): Promise<ApiResponse> {
    const queryParams = limit ? `?limit=${limit}` : '';
    return this.request(`/admin/applications/recent${queryParams}`);
  }

  async exportApplications(format: 'json' | 'csv' = 'json'): Promise<ApiResponse> {
    return this.request(`/admin/export?format=${format}`);
  }

  async getAnalytics(): Promise<ApiResponse> {
    return this.request('/admin/applications/analytics');
  }
}

// Create API client instance
const apiClient = new ApiClient(API_BASE_URL);

// Auth service
export const authService = {
  async login(credentials: LoginCredentials): Promise<boolean> {
    try {
      const response = await apiClient.login(credentials);
      if (response.success && response.data?.token) {
        TokenManager.setToken(response.data.token);
        return true;
      }
      return false;
    } catch (error) {
      console.warn('Backend not available, using fallback authentication');
      // Fallback authentication - check against default credentials
      if (credentials.email === 'admin@yugayatra.com' && credentials.password === 'admin123') {
        // Store a dummy token to indicate authenticated state
        TokenManager.setToken('fallback-token-' + Date.now());
        return true;
      }
      return false;
    }
  },

  async logout(): Promise<void> {
    try {
      await apiClient.logout();
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      TokenManager.removeToken();
    }
  },

  isAuthenticated(): boolean {
    return TokenManager.isAuthenticated();
  },

  async getMe() {
    try {
      const response = await apiClient.getMe();
      return response.success ? response.data : null;
    } catch (error) {
      console.error('Get me failed:', error);
      return null;
    }
  },
};

// Fallback localStorage functions (when backend is not available)
const localStorage_fallback = {
  getAll(): Student[] {
    const stored = localStorage.getItem('mba_applications');
    return stored ? JSON.parse(stored) : [];
  },
  
  add(data: ApplicationFormData): Student {
    const applications = this.getAll();
    const now = new Date(); // Use actual current time
    const newApplication: Student = {
      id: Date.now().toString(36) + Math.random().toString(36).substr(2),
      name: data.name || '',
      email: data.email || '',
      phone: data.phone || '',
      location: data.location || '', // Add location field
      college: data.college || '',
      specialization: data.specialization || '',
      graduation_year: parseInt(data.graduation_year) || new Date().getFullYear(),
      cgpa: parseFloat(data.cgpa) || 0,
      skills: data.skills ? data.skills.split(',').map(skill => skill.trim()).filter(Boolean) : [],
      experience: data.experience || '',
      motivation: data.motivation,
      resume_url: undefined,
      ai_prediction: undefined,
      status: 'pending' as const,
      created_at: now.toISOString(), // Accurate timestamp
      updated_at: now.toISOString(), // Accurate timestamp
    };
    applications.push(newApplication);
    localStorage.setItem('mba_applications', JSON.stringify(applications));
    return newApplication;
  },
  
  update(id: string, updates: Partial<Student>): Student | null {
    const applications = this.getAll();
    const index = applications.findIndex(app => app.id === id);
    if (index === -1) return null;
    applications[index] = { ...applications[index], ...updates, updated_at: new Date().toISOString() };
    localStorage.setItem('mba_applications', JSON.stringify(applications));
    return applications[index];
  }
};

// Application service
export const applicationService = {
  async submit(
    applicationData: ApplicationFormData,
    resumeFile?: File
  ): Promise<{ success: boolean; message: string; data?: any }> {
    try {
      const response = await apiClient.submitApplication(applicationData, resumeFile);
      return {
        success: response.success,
        message: response.message,
        data: response.data,
      };
    } catch (error: any) {
      console.warn('Backend not available, using localStorage fallback');
      try {
        const student = localStorage_fallback.add(applicationData);
        return {
          success: true,
          message: 'Application submitted successfully (offline mode)',
          data: student,
        };
      } catch (fallbackError) {
        return {
          success: false,
          message: 'Failed to submit application',
        };
      }
    }
  },

  async getAll(filters?: {
    status?: string;
    specialization?: string;
    search?: string;
    page?: number;
    limit?: number;
  }): Promise<Student[]> {
    try {
      const response = await apiClient.getApplications(filters);
      if (response.success && response.data) {
        // Normalize data from API response
        return response.data.map(student => this.normalizeStudentData(student));
      }
      return [];
    } catch (error) {
      console.warn('Backend not available, using localStorage fallback');
      try {
        let applications = localStorage_fallback.getAll();
        
        // Normalize data from localStorage
        applications = applications.map(app => this.normalizeStudentData(app));
        
        // Apply filters locally
        if (filters?.status && filters.status !== 'all') {
          applications = applications.filter(app => app.status === filters.status);
        }
        if (filters?.specialization && filters.specialization !== 'all') {
          applications = applications.filter(app => app.specialization === filters.specialization);
        }
        if (filters?.search) {
          const searchLower = filters.search.toLowerCase();
          applications = applications.filter(app => 
            app.name.toLowerCase().includes(searchLower) ||
            app.email.toLowerCase().includes(searchLower) ||
            app.college.toLowerCase().includes(searchLower)
          );
        }
        
        // Sort by created_at descending
        applications.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        
        return applications;
      } catch (fallbackError) {
        console.error('Fallback also failed:', fallbackError);
        return [];
      }
    }
  },

  async getById(id: string): Promise<Student | null> {
    try {
      const response = await apiClient.getApplicationById(id);
      if (response.success && response.data) {
        // Normalize data from API response
        return this.normalizeStudentData(response.data);
      }
      return null;
    } catch (error) {
      console.warn('Backend not available, using localStorage fallback');
      try {
        const applications = localStorage_fallback.getAll();
        const student = applications.find(app => app.id === id);
        return student ? this.normalizeStudentData(student) : null;
      } catch (fallbackError) {
        console.error('Failed to fetch application:', fallbackError);
        return null;
      }
    }
  },

  // Helper function to normalize student data from different sources
  normalizeStudentData(rawData: any): Student {
    return {
      id: rawData.id || '',
      name: rawData.name || '',
      email: rawData.email || '',
      phone: rawData.phone || '',
      location: rawData.location || '', // Add location field
      college: rawData.college || '',
      specialization: rawData.specialization || '',
      graduation_year: typeof rawData.graduation_year === 'number' 
        ? rawData.graduation_year 
        : parseInt(rawData.graduation_year) || new Date().getFullYear(),
      cgpa: typeof rawData.cgpa === 'number'
        ? rawData.cgpa
        : parseFloat(rawData.cgpa) || 0,
      skills: Array.isArray(rawData.skills)
        ? rawData.skills.filter(Boolean)
        : typeof rawData.skills === 'string' && rawData.skills.trim()
        ? rawData.skills.split(',').map(s => s.trim()).filter(Boolean)
        : [],
      experience: rawData.experience || '',
      motivation: rawData.motivation || undefined,
      resume_url: rawData.resume_url || undefined,
      ai_prediction: rawData.ai_prediction || undefined,
      status: rawData.status || 'pending',
      created_at: rawData.created_at || new Date().toISOString(),
      updated_at: rawData.updated_at || new Date().toISOString(),
    };
  },

  async updateStatus(
    id: string,
    status: Student['status'],
    aiPrediction?: string
  ): Promise<boolean> {
    try {
      const response = await apiClient.updateApplicationStatus(id, status, aiPrediction);
      return response.success;
    } catch (error) {
      console.warn('Backend not available, using localStorage fallback');
      try {
        const updated = localStorage_fallback.update(id, { status, ai_prediction: aiPrediction });
        return !!updated;
      } catch (fallbackError) {
        console.error('Failed to update application status:', fallbackError);
        return false;
      }
    }
  },

  async delete(id: string): Promise<boolean> {
    try {
      const response = await apiClient.deleteApplication(id);
      return response.success;
    } catch (error) {
      console.error('Failed to delete application:', error);
      return false;
    }
  },
};

// Admin service
export const adminService = {
  async getStats() {
    try {
      const response = await apiClient.getDashboardStats();
      return response.success ? response.data : null;
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error);
      return null;
    }
  },

  async getRecentApplications(limit = 10) {
    try {
      const response = await apiClient.getRecentApplications(limit);
      return response.success ? response.data : [];
    } catch (error) {
      console.error('Failed to fetch recent applications:', error);
      return [];
    }
  },

  async exportData(format: 'json' | 'csv' = 'json') {
    try {
      const response = await apiClient.exportApplications(format);
      return response.success ? response.data : null;
    } catch (error) {
      console.error('Failed to export data:', error);
      return null;
    }
  },

  async getAnalytics() {
    try {
      const response = await apiClient.getAnalytics();
      return response.success ? response.data : null;
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
      return null;
    }
  },
};

// Export types for use in components
export type { Student, ApplicationFormData, LoginCredentials };
