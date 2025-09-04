import { Student, ApplicationFormData } from '../types';

// Local storage keys
const STORAGE_KEYS = {
  APPLICATIONS: 'mba_applications',
  ADMIN_SESSION: 'admin_session',
} as const;

// Mock admin credentials
const ADMIN_CREDENTIALS = {
  email: 'admin@mbatalent.com',
  password: 'admin123',
};

// Generate unique ID
function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Application storage functions
export const applicationStorage = {
  // Get all applications
  getAll(): Student[] {
    const stored = localStorage.getItem(STORAGE_KEYS.APPLICATIONS);
    return stored ? JSON.parse(stored) : [];
  },

  // Add new application
  add(formData: ApplicationFormData): Student {
    const applications = this.getAll();
    const newApplication: Student = {
      id: generateId(),
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      college: formData.college,
      specialization: formData.specialization,
      graduation_year: parseInt(formData.graduation_year) || 2024,
      cgpa: parseFloat(formData.cgpa) || 0,
      skills: formData.skills.split(',').map(skill => skill.trim()),
      experience: formData.experience,
      motivation: formData.motivation,
      resume_url: formData.resume ? 'resume-uploaded.pdf' : undefined,
      ai_prediction: undefined, // Will be set by AI analysis
      status: 'pending',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    applications.push(newApplication);
    localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(applications));
    return newApplication;
  },

  // Update application
  update(id: string, updates: Partial<Student>): Student | null {
    const applications = this.getAll();
    const index = applications.findIndex(app => app.id === id);
    
    if (index === -1) return null;
    
    applications[index] = {
      ...applications[index],
      ...updates,
      updated_at: new Date().toISOString(),
    };
    
    localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(applications));
    return applications[index];
  },

  // Get application by ID
  getById(id: string): Student | null {
    const applications = this.getAll();
    return applications.find(app => app.id === id) || null;
  },
};

// Admin authentication functions
export const adminAuth = {
  // Login
  login(email: string, password: string): boolean {
    if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
      const session = {
        email,
        loginTime: new Date().toISOString(),
      };
      localStorage.setItem(STORAGE_KEYS.ADMIN_SESSION, JSON.stringify(session));
      return true;
    }
    return false;
  },

  // Logout
  logout(): void {
    localStorage.removeItem(STORAGE_KEYS.ADMIN_SESSION);
  },

  // Check if logged in
  isAuthenticated(): boolean {
    const session = localStorage.getItem(STORAGE_KEYS.ADMIN_SESSION);
    return !!session;
  },

  // Get current session
  getSession() {
    const session = localStorage.getItem(STORAGE_KEYS.ADMIN_SESSION);
    return session ? JSON.parse(session) : null;
  },
};

// AI Analysis function
export async function analyzeApplication(studentData: Student): Promise<string> {
  try {
    const prompt = `Analyze this MBA student's profile and predict their best-fit role:

Name: ${studentData.name}
College: ${studentData.college}
Specialization: ${studentData.specialization}
Skills: ${studentData.skills.join(', ')}
Experience: ${studentData.experience}

Based on their specialization, skills, and experience, what specific role would be the best fit for them? 

Respond with only a concise job title (2-4 words max) that represents their ideal role. Examples:
- "Finance Analyst"
- "Marketing Manager" 
- "Strategy Consultant"
- "Operations Director"
- "HR Business Partner"
- "Data Analytics Manager"

Focus on roles that align with their MBA specialization and demonstrated skills.`;

    const response = await fetch('https://api.x.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.XAI_API_KEY || 'your-api-key-here'}`,
      },
      body: JSON.stringify({
        messages: [
          {
            role: 'system',
            content: 'You are an expert HR analyst specializing in MBA talent assessment. Provide concise, accurate role predictions based on candidate profiles.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        model: 'grok-beta',
        stream: false,
        temperature: 0.1
      }),
    });

    if (response.ok) {
      const data = await response.json();
      let prediction = data.choices?.[0]?.message?.content?.trim() || 'Role Analysis Pending';
      
      // Clean up the prediction to ensure it's concise
      if (prediction.length > 50) {
        prediction = prediction.substring(0, 50).trim() + '...';
      }
      
      return prediction;
    } else {
      console.error('Grok API error:', await response.text());
      return 'Analysis Failed';
    }
  } catch (error) {
    console.error('AI analysis error:', error);
    return 'Analysis Failed';
  }
}