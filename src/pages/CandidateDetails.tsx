import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { applicationService, type Student } from '../lib/api';
import { 
  ArrowLeft, 
  Mail, 
  GraduationCap, 
  Briefcase, 
  Calendar, 
  Download, 
  Eye, 
  Check, 
  X,
  Star,
  Phone,
  MapPin,
  User
} from 'lucide-react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

// Helper: derive a safe base URL for serving files (e.g., resumes)
function getFileBaseUrl() {
  const env = (import.meta as any)?.env?.VITE_API_URL as string | undefined;
  if (env) {
    try {
      const u = new URL(env);
      // Use origin (protocol + host[:port]) so we don't keep the "/api" path segment
      return u.origin;
    } catch {
      // Fallback: strip trailing /api if present
      return env.replace(/\/?api\/?$/, '');
    }
  }
  if (typeof window !== 'undefined' && window.location?.origin) return window.location.origin;
  return 'http://localhost:5000';
}

function buildResumeUrl(path: string | undefined) {
  if (!path) return null;
  if (/^https?:\/\//i.test(path)) return path;
  const base = getFileBaseUrl();
  if (path.startsWith('/')) return `${base}${path}`;
  return `${base}/${path}`;
}

export function CandidateDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [student, setStudent] = React.useState<Student | null>(null);
  const [loading, setLoading] = React.useState(true);

  // Normalize skills into a string[] regardless of backend/localStorage variations
  const normalizedSkills = React.useMemo<string[]>(() => {
    if (!student) return [];
    try {
      if (Array.isArray(student.skills)) return student.skills.filter(Boolean);
      if (typeof student.skills === 'string' && student.skills.trim()) {
        return student.skills.split(',').map((s: string) => s.trim()).filter((s: string) => s.length > 0);
      }
    } catch (e) {
      console.error('Failed to normalize skills:', e);
    }
    return [];
  }, [student]);

  React.useEffect(() => {
    const fetchStudent = async () => {
      if (!id) {
        console.error('No ID provided for candidate details');
        toast.error('Invalid candidate ID');
        navigate('/admin/dashboard');
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        console.log('Fetching candidate with ID:', id);
        const application = await applicationService.getById(id);
        
        if (application && typeof application === 'object') {
          console.log('Candidate data received:', application);
          setStudent(application);
        } else {
          console.warn('No application found for ID:', id);
          toast.error('Candidate not found');
          navigate('/admin/dashboard');
        }
      } catch (error) {
        console.error('Error fetching candidate:', error);
        toast.error('Failed to load candidate details. Please try again.');
        navigate('/admin/dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchStudent();
  }, [id, navigate]);

  const updateStudentStatus = async (status: Student['status']) => {
    if (!student) return;
    
    try {
      const success = await applicationService.updateStatus(student.id, status);
      if (success) {
        setStudent(prev => prev ? { ...prev, status } : null);
        toast.success(`Application ${status} successfully`);
      } else {
        toast.error('Failed to update application status');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update application status');
    }
  };

  const handleViewResume = () => {
    const url = buildResumeUrl(student?.resume_url);
    if (url) {
      window.open(url, '_blank');
    } else {
      toast.error('No resume uploaded for this candidate');
    }
  };

  const handleDownloadResume = () => {
    const url = buildResumeUrl(student?.resume_url);
    if (url && student) {
      const link = document.createElement('a');
      link.href = url;
      link.download = `${student.name.replace(/\s+/g, '_')}_Resume.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success('Resume downloaded successfully');
    } else {
      toast.error('No resume uploaded for this candidate');
    }
  };

  const goBack = () => {
    navigate('/admin/dashboard');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-100 via-amber-50 to-yellow-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading candidate details...</p>
        </div>
      </div>
    );
  }

  if (!student || !student.id || !student.name) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-100 via-amber-50 to-yellow-100 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Candidate Not Found</h2>
          <p className="text-gray-600 mb-4">
            The candidate data could not be loaded. This might be due to an invalid ID or network issue.
          </p>
          <div className="space-y-2">
            <button
              onClick={goBack}
              className="w-full bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Go Back to Dashboard
            </button>
            <button
              onClick={() => window.location.reload()}
              className="w-full bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Reload Page
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-100 via-amber-50 to-yellow-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-600 to-orange-700 shadow-lg border-b border-amber-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <button
                onClick={goBack}
                className="flex items-center text-amber-100 hover:text-white transition-colors mr-4"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back to Dashboard
              </button>
              <h1 className="text-2xl font-bold text-white">Candidate Details</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information */}
            <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <User className="h-6 w-6 mr-3 text-amber-600" />
                Personal Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Full Name</label>
                  <p className="text-lg font-semibold text-gray-900">{student.name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Email Address</label>
                  <p className="text-gray-900 flex items-center">
                    <Mail className="h-4 w-4 mr-2 text-amber-600" />
                    {student.email}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Phone Number</label>
                  <p className="text-gray-900 flex items-center">
                    <Phone className="h-4 w-4 mr-2 text-amber-600" />
                    {student.phone || 'Not provided'}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Location</label>
                  <p className="text-gray-900 flex items-center">
                    <MapPin className="h-4 w-4 mr-2 text-amber-600" />
                    {student.location || 'Not provided'}
                  </p>
                </div>
              </div>
            </div>

            {/* Academic Background */}
            <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <GraduationCap className="h-6 w-6 mr-3 text-amber-600" />
                Academic Background
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">College/University</label>
                  <p className="text-lg font-semibold text-gray-900">{student.college}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Specialization</label>
                  <p className="text-gray-900">{student.specialization}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Graduation Year</label>
                  <p className="text-gray-900">{student.graduation_year || 'Not specified'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">CGPA</label>
                  <p className="text-gray-900 font-semibold">
                    {student.cgpa ? `${student.cgpa}/10.0` : 'Not provided'}
                  </p>
                </div>
              </div>
            </div>

            {/* Professional Profile */}
            <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <Briefcase className="h-6 w-6 mr-3 text-amber-600" />
                Professional Profile
              </h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-3">Skills & Expertise</label>
                  <div className="flex flex-wrap gap-2">
                    {normalizedSkills.map((skill: string, index: number) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-amber-100 text-amber-800 text-sm font-medium rounded-full border border-amber-200"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                  {normalizedSkills.length === 0 && (
                    <p className="text-gray-500 italic">No skills specified</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-3">Experience & Achievements</label>
                  <div className="bg-white rounded-lg p-4 border border-amber-200">
                    <p className="text-gray-900 leading-relaxed whitespace-pre-line">
                      {student.experience || 'No experience details provided.'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Status & Actions */}
          <div className="space-y-6">
            {/* Application Status */}
            <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <Calendar className="h-5 w-5 mr-2 text-amber-600" />
                Application Status
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Current Status</label>
                  <div className="flex items-center space-x-2">
                    <span className={`px-4 py-2 inline-flex text-sm font-semibold rounded-full ${
                      student.status === 'approved' ? 'bg-green-100 text-green-800 border border-green-200 shadow-md' :
                      student.status === 'rejected' ? 'bg-red-100 text-red-800 border border-red-200 shadow-md' :
                      student.status === 'shortlisted' ? 'bg-orange-100 text-orange-800 border border-orange-200 shadow-md' :
                      'bg-yellow-100 text-yellow-800 border border-yellow-200 shadow-md'
                    }`}>
                      {student.status === 'approved' && <Check className="h-4 w-4 mr-1" />}
                      {student.status === 'rejected' && <X className="h-4 w-4 mr-1" />}
                      {student.status === 'shortlisted' && <Star className="h-4 w-4 mr-1" />}
                      {student.status === 'pending' && <div className="w-2 h-2 bg-yellow-600 rounded-full mr-2 animate-pulse"></div>}
                      {student.status.charAt(0).toUpperCase() + student.status.slice(1)}
                    </span>
                    {student.status !== 'pending' && (
                      <div className="text-xs text-gray-500">
                        • Action completed
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Applied On</label>
                  <p className="text-gray-900 font-medium">
                    {(() => {
                      try {
                        return format(new Date(student.created_at), 'MMMM dd, yyyy');
                      } catch (error) {
                        console.error('Error formatting date:', error);
                        return new Date(student.created_at).toLocaleDateString();
                      }
                    })()}
                  </p>
                  <p className="text-sm text-gray-500">
                    at {(() => {
                      try {
                        return format(new Date(student.created_at), 'HH:mm');
                      } catch (error) {
                        console.error('Error formatting time:', error);
                        return new Date(student.created_at).toLocaleTimeString();
                      }
                    })()}
                  </p>
                </div>
              </div>
            </div>

            {/* Resume Actions */}
            <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Resume</h3>
              {student.resume_url ? (
                <div className="space-y-3">
                  <div className="mb-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-sm text-green-800 flex items-center">
                      <Check className="h-4 w-4 mr-2" />
                      Resume uploaded
                    </p>
                  </div>
                  <button
                    onClick={handleViewResume}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg font-medium transition-colors flex items-center justify-center"
                  >
                    <Eye className="h-5 w-5 mr-2" />
                    View Resume
                  </button>
                  <button
                    onClick={handleDownloadResume}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-3 rounded-lg font-medium transition-colors flex items-center justify-center"
                  >
                    <Download className="h-5 w-5 mr-2" />
                    Download Resume
                  </button>
                </div>
              ) : (
                <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg text-center">
                  <p className="text-gray-600 mb-2">No resume uploaded</p>
                  <p className="text-sm text-gray-500">The candidate did not upload a resume with their application.</p>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Actions</h3>
              <div className="space-y-3">
                <button
                  onClick={() => updateStudentStatus('shortlisted')}
                  className={`w-full px-4 py-3 rounded-lg font-medium transition-all duration-200 flex items-center justify-center ${
                    student.status === 'shortlisted'
                      ? 'bg-orange-600 text-white shadow-lg transform scale-105 border-2 border-orange-400'
                      : student.status !== 'pending'
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed opacity-50'
                      : 'bg-orange-600 hover:bg-orange-700 text-white hover:shadow-lg hover:transform hover:scale-105'
                  }`}
                  disabled={student.status !== 'pending' && student.status !== 'shortlisted'}
                >
                  <Star className="h-5 w-5 mr-2" />
                  {student.status === 'shortlisted' ? '✓ Shortlisted' : 'Shortlist Candidate'}
                </button>
                
                <button
                  onClick={() => updateStudentStatus('approved')}
                  className={`w-full px-4 py-3 rounded-lg font-medium transition-all duration-200 flex items-center justify-center ${
                    student.status === 'approved'
                      ? 'bg-green-600 text-white shadow-lg transform scale-105 border-2 border-green-400'
                      : student.status !== 'pending' && student.status !== 'shortlisted'
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed opacity-50'
                      : 'bg-green-600 hover:bg-green-700 text-white hover:shadow-lg hover:transform hover:scale-105'
                  }`}
                  disabled={student.status === 'rejected'}
                >
                  <Check className="h-5 w-5 mr-2" />
                  {student.status === 'approved' ? '✓ Approved' : 'Approve Application'}
                </button>
                
                <button
                  onClick={() => updateStudentStatus('rejected')}
                  className={`w-full px-4 py-3 rounded-lg font-medium transition-all duration-200 flex items-center justify-center ${
                    student.status === 'rejected'
                      ? 'bg-red-600 text-white shadow-lg transform scale-105 border-2 border-red-400'
                      : student.status === 'approved'
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed opacity-50'
                      : 'bg-red-600 hover:bg-red-700 text-white hover:shadow-lg hover:transform hover:scale-105'
                  }`}
                  disabled={student.status === 'approved'}
                >
                  <X className="h-5 w-5 mr-2" />
                  {student.status === 'rejected' ? '✓ Rejected' : 'Reject Application'}
                </button>
                
                {/* Reset to Pending Button - only show if not pending */}
                {student.status !== 'pending' && (
                  <button
                    onClick={() => updateStudentStatus('pending')}
                    className="w-full bg-gray-600 hover:bg-gray-700 text-white px-4 py-3 rounded-lg font-medium transition-colors flex items-center justify-center mt-4 border-t border-gray-200 pt-4"
                  >
                    <ArrowLeft className="h-5 w-5 mr-2" />
                    Reset to Pending
                  </button>
                )}
              </div>
              
              <div className="mt-4 pt-3 border-t border-amber-200">
                <p className="text-xs text-gray-500 text-center mb-2">
                  Status changes are saved automatically
                </p>
                <div className="text-xs text-gray-400 text-center">
                  <span className="inline-block w-2 h-2 bg-orange-400 rounded-full mr-1"></span> Shortlisted candidates can be approved or rejected
                  <br />
                  <span className="inline-block w-2 h-2 bg-green-400 rounded-full mr-1"></span> Approved candidates cannot be rejected
                  <br />
                  <span className="inline-block w-2 h-2 bg-red-400 rounded-full mr-1"></span> Rejected candidates cannot be approved
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
