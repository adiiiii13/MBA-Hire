import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { applicationStorage } from '../lib/storage';
import toast from 'react-hot-toast';
import { User, Mail, GraduationCap, Target, Briefcase, ArrowRight, Upload, FileText } from 'lucide-react';

const applicationSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  college: z.string().min(2, 'College name is required'),
  specialization: z.string().min(1, 'Please select a specialization'),
  graduation_year: z.string().min(4, 'Graduation year is required'),
  cgpa: z.string().min(1, 'CGPA is required'),
  skills: z.string().min(10, 'Please describe your skills (at least 10 characters)'),
  experience: z.string().min(20, 'Please describe your experience (at least 20 characters)'),
});

type ApplicationFormData = z.infer<typeof applicationSchema>;

export function ApplicationForm() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch
  } = useForm<ApplicationFormData>({
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

  const onSubmit = async (data: ApplicationFormData) => {
    setIsSubmitting(true);
    
    try {
      // Save application to local storage
      applicationStorage.add(data);
      
      toast.success('Application submitted successfully!');
      navigate('/success');
    } catch (error) {
      console.error('Error submitting application:', error);
      toast.error('Failed to submit application. Please try again.');
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
                    <option value="2023">2023</option>
                    <option value="2024">2024</option>
                    <option value="2025">2025</option>
                    <option value="2026">2026</option>
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
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-amber-400 transition-colors">
                  <div className="space-y-1 text-center">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="flex text-sm text-gray-600">
                      <label className="relative cursor-pointer bg-white rounded-md font-medium text-amber-600 hover:text-amber-500">
                        <span>Upload a file</span>
                        <input
                          type="file"
                          className="sr-only"
                          accept=".pdf,.doc,.docx"
                          onChange={(e) => {
                            if (e.target.files?.[0]) {
                              toast.success(`Resume "${e.target.files[0].name}" uploaded successfully!`);
                            }
                          }}
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">PDF, DOC, DOCX up to 10MB</p>
                  </div>
                </div>
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
    </div>
  );
}
