import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { applicationService, type ApplicationFormData } from '../lib/api';
import toast from 'react-hot-toast';
import { 
  User, 
  Mail, 
  Phone,
  MapPin,
  GraduationCap, 
  Target, 
  Briefcase, 
  ArrowRight, 
  Upload, 
  FileText, 
  Eye, 
  X, 
  CheckCircle, 
  AlertCircle,
  Download,
  RefreshCw
} from 'lucide-react';

const applicationSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(10, 'Please enter a valid phone number').max(15, 'Phone number is too long'),
  location: z.string().min(2, 'Please enter your location/city'),
  college: z.string().min(2, 'College name is required'),
  specialization: z.string().min(1, 'Please select a specialization'),
  graduation_year: z.string().min(4, 'Graduation year is required'),
  cgpa: z.string().min(1, 'CGPA is required'),
  skills: z.string().min(10, 'Please describe your skills (at least 10 characters)'),
  experience: z.string().min(20, 'Please describe your experience (at least 20 characters)'),
});

type FormData = z.infer<typeof applicationSchema>;

export function ApplicationForm() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [resumeFile, setResumeFile] = React.useState<File | null>(null);
  const [isUploading, setIsUploading] = React.useState(false);
  const [uploadProgress, setUploadProgress] = React.useState(0);
  const [showPreview, setShowPreview] = React.useState(false);
  const [isDragging, setIsDragging] = React.useState(false);
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch
  } = useForm<FormData>({
    resolver: zodResolver(applicationSchema)
  });

  const watchedSpecialization = watch('specialization');

  const specializations = [
    'Finance',
    'Marketing',
    'Human Resources',
    'Operations',
    'Strategy & Consulting',
    'Data Analytics',
    'Digital Marketing',
    'Supply Chain',
    'Entrepreneurship',
    'International Business'
  ];

  // File validation function
  const validateFile = (file: File): string | null => {
    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    const allowedExtensions = ['.pdf', '.doc', '.docx'];
    
    if (file.size > maxSize) {
      return 'File size must be less than 10MB';
    }
    
    const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
    if (!allowedTypes.includes(file.type) && !allowedExtensions.includes(fileExtension)) {
      return 'Please upload a PDF, DOC, or DOCX file';
    }
    
    return null;
  };

  // Simulate upload progress animation
  const simulateUpload = () => {
    setIsUploading(true);
    setUploadProgress(0);
    
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 100);
  };

  // Handle file upload
  const handleFileUpload = (file: File) => {
    const error = validateFile(file);
    if (error) {
      toast.error(error);
      return;
    }

    setResumeFile(file);
    simulateUpload();
    
    // Create preview URL for PDF files
    if (file.type === 'application/pdf') {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    } else {
      setPreviewUrl(null);
    }
    
    toast.success(`Resume "${file.name}" uploaded successfully!`);
  };

  // Handle file removal
  const handleFileRemove = () => {
    setResumeFile(null);
    setUploadProgress(0);
    setIsUploading(false);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    setShowPreview(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    toast.success('File removed successfully');
  };

  // Handle drag and drop events
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  // Handle preview
  const handlePreview = () => {
    if (previewUrl) {
      setShowPreview(true);
    } else if (resumeFile?.type === 'application/pdf') {
      const url = URL.createObjectURL(resumeFile);
      setPreviewUrl(url);
      setShowPreview(true);
    } else {
      toast.error('Preview is only available for PDF files');
    }
  };

  // Cleanup preview URL on unmount
  React.useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    
    try {
      // Convert form data to API format
      const applicationData: ApplicationFormData = {
        name: data.name,
        email: data.email,
        phone: data.phone,
        location: data.location,
        college: data.college,
        specialization: data.specialization,
        graduation_year: data.graduation_year,
        cgpa: data.cgpa,
        skills: data.skills,
        experience: data.experience,
        motivation: undefined // Optional field
      };

      // Submit application using API service
      const result = await applicationService.submit(applicationData, resumeFile || undefined);
      
      if (result.success) {
        toast.success(result.message || 'Application submitted successfully!');
        navigate('/success');
      } else {
        toast.error(result.message || 'Failed to submit application. Please try again.');
      }
    } catch (error: any) {
      console.error('Error submitting application:', error);
      toast.error(error.message || 'Failed to submit application. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-100 via-amber-50 to-yellow-100 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Apply for MBA Internship at YugaYatra
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
            Join YugaYatra Retail (OPC) Private Limited and kickstart your career in retail innovation.
          </p>
        </div>

        <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-2xl shadow-xl p-6 sm:p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Personal Information */}
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-gray-900 flex items-center">
                <User className="h-6 w-6 mr-2 text-amber-600" />
                Personal Information
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    {...register('name')}
                    type="text"
                    id="name"
                    placeholder="Enter your full name"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Mail className="h-4 w-4 inline mr-1" />
                    Email Address *
                  </label>
                  <input
                    {...register('email')}
                    type="email"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
                    placeholder="your.email@example.com"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Phone className="h-4 w-4 inline mr-1" />
                    Phone Number *
                  </label>
                  <input
                    {...register('phone')}
                    type="tel"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
                    placeholder="+1 (555) 123-4567"
                  />
                  {errors.phone && (
                    <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <MapPin className="h-4 w-4 inline mr-1" />
                    Location (City, State/Country) *
                  </label>
                  <input
                    {...register('location')}
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
                    placeholder="New York, NY, USA"
                  />
                  {errors.location && (
                    <p className="mt-1 text-sm text-red-600">{errors.location.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Academic Information */}
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-gray-900 flex items-center">
                <GraduationCap className="h-6 w-6 mr-2 text-amber-600" />
                Academic Background
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    College/University *
                  </label>
                  <input
                    {...register('college')}
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
                    placeholder="Harvard Business School"
                  />
                  {errors.college && (
                    <p className="mt-1 text-sm text-red-600">{errors.college.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Target className="h-4 w-4 inline mr-1" />
                    Specialization *
                  </label>
                  <select
                    {...register('specialization')}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
                  >
                    <option value="">Select specialization</option>
                    {specializations.map(spec => (
                      <option key={spec} value={spec}>{spec}</option>
                    ))}
                  </select>
                  {errors.specialization && (
                    <p className="mt-1 text-sm text-red-600">{errors.specialization.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Graduation Year *
                  </label>
                  <select
                    {...register('graduation_year')}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
                  >
                    <option value="">Select year</option>
                    {(() => {
                      const currentYear = new Date().getFullYear();
                      const years = [];
                      // Generate years from 2013 to current year + 3 (for future graduates)
                      for (let year = 2013; year <= currentYear + 3; year++) {
                        years.push(
                          <option key={year} value={year.toString()}>
                            {year}
                          </option>
                        );
                      }
                      return years;
                    })()}
                  </select>
                  {errors.graduation_year && (
                    <p className="mt-1 text-sm text-red-600">{errors.graduation_year.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    CGPA *
                  </label>
                  <input
                    {...register('cgpa')}
                    type="number"
                    step="0.01"
                    min="0"
                    max="10"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
                    placeholder="8.5"
                  />
                  {errors.cgpa && (
                    <p className="mt-1 text-sm text-red-600">{errors.cgpa.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Professional Information */}
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-gray-900 flex items-center">
                <Briefcase className="h-6 w-6 mr-2 text-amber-600" />
                Professional Profile
              </h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Key Skills *
                </label>
                <textarea
                  {...register('skills')}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
                  placeholder="List your key skills separated by commas (e.g., Financial Modeling, Strategic Planning, Team Leadership, Data Analysis...)"
                />
                {errors.skills && (
                  <p className="mt-1 text-sm text-red-600">{errors.skills.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Experience & Achievements *
                </label>
                <textarea
                  {...register('experience')}
                  rows={5}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
                  placeholder="Describe your professional experience, internships, projects, leadership roles, and key achievements..."
                />
                {errors.experience && (
                  <p className="mt-1 text-sm text-red-600">{errors.experience.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FileText className="h-4 w-4 inline mr-1" />
                  Resume Upload (Optional)
                </label>
                
                {!resumeFile ? (
                  <div 
                    className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-lg transition-all duration-300 ${
                      isDragging 
                        ? 'border-amber-400 bg-amber-50 scale-105 shadow-md' 
                        : 'border-gray-300 hover:border-amber-400 hover:bg-amber-25'
                    }`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                  >
                    <div className="space-y-1 text-center">
                      <div className="relative">
                        <Upload className={`mx-auto h-12 w-12 transition-all duration-300 ${
                          isDragging ? 'text-amber-500 scale-110' : 'text-gray-400'
                        }`} />
                        {isDragging && (
                          <div className="absolute -inset-2 bg-amber-200 rounded-full animate-ping opacity-75"></div>
                        )}
                      </div>
                      <div className="flex text-sm text-gray-600">
                        <label className="relative cursor-pointer bg-white rounded-md font-medium text-amber-600 hover:text-amber-500 transition-colors">
                          <span>Upload a file</span>
                          <input
                            ref={fileInputRef}
                            type="file"
                            className="sr-only"
                            accept=".pdf,.doc,.docx"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                handleFileUpload(file);
                              }
                            }}
                          />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500">PDF, DOC, DOCX up to 10MB</p>
                      {isDragging && (
                        <p className="text-sm text-amber-600 font-medium animate-bounce">Drop your file here!</p>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="mt-1 border-2 border-green-200 rounded-lg bg-green-50 p-4 animate-fadeIn">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0">
                          {isUploading ? (
                            <RefreshCw className="h-8 w-8 text-amber-500 animate-spin" />
                          ) : (
                            <CheckCircle className="h-8 w-8 text-green-500" />
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-green-800">
                            {resumeFile.name}
                          </p>
                          <p className="text-xs text-green-600">
                            {(resumeFile.size / 1024 / 1024).toFixed(2)} MB • 
                            {resumeFile.type === 'application/pdf' ? 'PDF Document' : 'Word Document'}
                          </p>
                          {isUploading && (
                            <div className="mt-2">
                              <div className="w-full bg-green-200 rounded-full h-2">
                                <div 
                                  className="bg-green-500 h-2 rounded-full transition-all duration-300 ease-out"
                                  style={{ width: `${uploadProgress}%` }}
                                ></div>
                              </div>
                              <p className="text-xs text-green-600 mt-1">Uploading... {Math.round(uploadProgress)}%</p>
                            </div>
                          )}
                        </div>
                      </div>
                      {!isUploading && (
                        <div className="flex items-center space-x-2">
                          {resumeFile.type === 'application/pdf' && (
                            <button
                              type="button"
                              onClick={handlePreview}
                              className="inline-flex items-center px-3 py-1 border border-blue-200 rounded-md text-xs font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 transition-colors"
                            >
                              <Eye className="h-3 w-3 mr-1" />
                              Preview
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={handleFileRemove}
                            className="inline-flex items-center px-3 py-1 border border-red-200 rounded-md text-xs font-medium text-red-700 bg-red-50 hover:bg-red-100 transition-colors"
                          >
                            <X className="h-3 w-3 mr-1" />
                            Remove
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* AI Prediction Preview */}
            {watchedSpecialization && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-amber-900 mb-2">
                  🤖 AI Analysis Preview
                </h3>
                <p className="text-amber-800">
                  Based on your {watchedSpecialization} specialization, our AI will analyze your profile 
                  and predict the best-fit roles such as {watchedSpecialization} Analyst, {watchedSpecialization} Manager, 
                  or related positions in your field. This analysis will be completed after submission.
                </p>
              </div>
            )}

            {/* Submit Button */}
            <div className="text-center">
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-amber-600 hover:bg-amber-700 disabled:bg-amber-400 text-white px-12 py-4 rounded-lg font-semibold text-lg transition-colors duration-200 flex items-center justify-center mx-auto"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Processing Application...
                  </>
                ) : (
                  <>
                    Submit Application
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
      
      {/* PDF Preview Modal */}
      {showPreview && previewUrl && (
        <div className="fixed inset-0 z-50 overflow-y-auto animate-fadeIn">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div 
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity animate-fadeIn"
              onClick={() => setShowPreview(false)}
            ></div>
            
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            
            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-6xl sm:w-full sm:p-6 animate-slideInUp">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900 flex items-center">
                  <Eye className="h-5 w-5 mr-2 text-blue-600" />
                  Resume Preview
                </h3>
                <div className="flex items-center space-x-2">
                  <a
                    href={previewUrl}
                    download={resumeFile?.name}
                    className="inline-flex items-center px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                  >
                    <Download className="h-4 w-4 mr-1" />
                    Download
                  </a>
                  <button
                    onClick={() => setShowPreview(false)}
                    className="inline-flex items-center p-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
              
              <div className="w-full h-[80vh] border border-gray-200 rounded-lg overflow-hidden">
                <iframe
                  src={previewUrl}
                  className="w-full h-full"
                  title="Resume Preview"
                >
                  <p className="p-4 text-center text-gray-500">
                    Your browser doesn't support PDF preview. 
                    <a href={previewUrl} className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
                      Click here to open in a new tab
                    </a>
                  </p>
                </iframe>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
