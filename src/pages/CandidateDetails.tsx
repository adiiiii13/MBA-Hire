import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { applicationStorage } from '../lib/storage';
import { Student } from '../types';
import { 
  ArrowLeft, 
  Mail, 
  GraduationCap, 
  Briefcase, 
  Calendar, 
  Download, 
  Eye, 
  Check, 
  Star,
  Phone,
  MapPin,
  User
} from 'lucide-react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

export function CandidateDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [student, setStudent] = React.useState<Student | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (id) {
      const application = applicationStorage.getById(id);
      if (application) {
        setStudent(application);
      } else {
        toast.error('Candidate not found');
        navigate('/admin/dashboard');
      }
    }
    setLoading(false);
  }, [id, navigate]);

  const updateStudentStatus = async (status: Student['status']) => {
    if (!student) return;
    
    try {
      const updatedStudent = applicationStorage.update(student.id, { status });
      if (updatedStudent) {
        setStudent(updatedStudent);
        toast.success(`Application ${status} successfully`);
      }
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update application status');
    }
  };

  const handleViewResume = () => {
    toast.success('Resume viewer feature - Demo mode');
    // In real implementation, this would open the resume file
  };

  const handleDownloadResume = () => {
    toast.success('Resume downloaded successfully');
    // In real implementation, this would download the actual resume file
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

  if (!student) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-100 via-amber-50 to-yellow-100 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Candidate Not Found</h2>
          <button
            onClick={goBack}
            className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Go Back to Dashboard
          </button>
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
                    Remote
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
                    {student.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-amber-100 text-amber-800 text-sm font-medium rounded-full border border-amber-200"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
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
                  <span className={`px-4 py-2 inline-flex text-sm font-semibold rounded-full ${
                    student.status === 'approved' ? 'bg-green-100 text-green-800 border border-green-200' :
                    student.status === 'shortlisted' ? 'bg-orange-100 text-orange-800 border border-orange-200' :
                    'bg-yellow-100 text-yellow-800 border border-yellow-200'
                  }`}>
                    {student.status.charAt(0).toUpperCase() + student.status.slice(1)}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Applied On</label>
                  <p className="text-gray-900 font-medium">
                    {format(new Date(student.created_at), 'MMMM dd, yyyy')}
                  </p>
                  <p className="text-sm text-gray-500">
                    at {format(new Date(student.created_at), 'HH:mm')}
                  </p>
                </div>
              </div>
            </div>

            {/* Resume Actions */}
            <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Resume</h3>
              <div className="space-y-3">
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
            </div>

            {/* Action Buttons */}
            <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Actions</h3>
              <div className="space-y-3">
                <button
                  onClick={() => updateStudentStatus('shortlisted')}
                  className="w-full bg-orange-600 hover:bg-orange-700 text-white px-4 py-3 rounded-lg font-medium transition-colors flex items-center justify-center"
                  disabled={student.status === 'shortlisted'}
                >
                  <Star className="h-5 w-5 mr-2" />
                  Shortlist Candidate
                </button>
                <button
                  onClick={() => updateStudentStatus('approved')}
                  className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg font-medium transition-colors flex items-center justify-center"
                  disabled={student.status === 'approved'}
                >
                  <Check className="h-5 w-5 mr-2" />
                  Approve Application
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-3 text-center">
                Status changes are saved automatically
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
