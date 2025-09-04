import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { adminAuth } from '../lib/storage';
import toast from 'react-hot-toast';
import { Lock, Mail, Shield } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export function AdminLogin() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = React.useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema)
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    
    try {
      const success = adminAuth.login(data.email, data.password);
      
      if (!success) {
        throw new Error('Invalid credentials');
      }

      toast.success('Login successful!');
      navigate('/admin/dashboard');
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Invalid credentials. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-100 via-amber-50 to-yellow-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Shield className="h-16 w-16 text-amber-600 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Admin Login</h2>
          <p className="text-gray-600">Access the YugaYatra management dashboard</p>
        </div>

        <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Mail className="h-4 w-4 inline mr-1" />
                Email Address
              </label>
              <input
                {...register('email')}
                type="email"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
                placeholder="admin@yugayatra.com"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Lock className="h-4 w-4 inline mr-1" />
                Password
              </label>
              <input
                {...register('password')}
                type="password"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
                placeholder="Enter your password"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-amber-600 hover:bg-amber-700 disabled:bg-amber-400 text-white py-3 px-4 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Demo credentials: admin@mbatalent.com / admin123
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}