import { Link } from 'react-router-dom';
import { CheckCircle, ArrowRight, Mail, Clock } from 'lucide-react';

export function SuccessPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="mb-8">
            <CheckCircle className="h-20 w-20 text-green-500 mx-auto mb-6" />
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Application Submitted Successfully! 
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Thank you for applying to our MBA talent network. Your application has been received 
              and is being processed by our AI system.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">What happens next?</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-blue-600">1</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">AI Analysis</h3>
                <p className="text-gray-600">
                  Our AI analyzes your profile and predicts the best-fit roles for your skills and background.
                </p>
              </div>

              <div className="text-center">
                <div className="bg-emerald-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-emerald-600">2</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Review Process</h3>
                <p className="text-gray-600">
                  Our team reviews your application along with AI insights to ensure the best matches.
                </p>
              </div>

              <div className="text-center">
                <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-orange-600">3</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Company Matching</h3>
                <p className="text-gray-600">
                  We connect you with companies looking for talent that matches your profile and career goals.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
            <div className="flex items-center justify-center mb-4">
              <Mail className="h-6 w-6 text-blue-600 mr-2" />
              <h3 className="text-lg font-semibold text-blue-900">Email Confirmation</h3>
            </div>
            <p className="text-blue-800 mb-4">
              A confirmation email has been sent to your registered email address with your application details.
            </p>
            <div className="flex items-center justify-center text-blue-700">
              <Clock className="h-5 w-5 mr-2" />
              <span className="font-medium">Expected response time: 24-48 hours</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center"
            >
              Back to Home
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link
              to="/jobs"
              className="border-2 border-blue-600 hover:bg-blue-600 hover:text-white text-blue-600 px-8 py-3 rounded-lg font-medium transition-colors duration-200"
            >
              Browse Open Positions
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}