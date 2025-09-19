import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { GraduationCap, Menu, X, Star, Sparkles } from 'lucide-react';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [showMockTestPopup, setShowMockTestPopup] = React.useState(false);
  const location = useLocation();

  const navigation = [
    { name: 'Home', href: 'home', isSection: true },
    { name: 'About', href: 'about', isSection: true },
    { name: 'Services', href: 'services', isSection: true },
    { name: 'Internships', href: 'internships', isSection: true },
    { name: 'Blog', href: 'blog', isSection: true },
    { name: 'Contact', href: 'contact', isSection: true },
  ];

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleNavClick = (item: typeof navigation[0]) => {
    if (location.pathname !== '/') {
      // If not on home page, navigate to home first then scroll
      if (item.href === 'home') {
        window.location.href = '/';
      } else {
        window.location.href = `/#${item.href}`;
      }
      return;
    }
    
    if (item.isSection) {
      scrollToSection(item.href);
    }
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <GraduationCap className="h-8 w-8 text-amber-600" />
            <span className="text-xl font-bold text-gray-900">YugaYatra</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navigation.map((item) => (
              <button
                key={item.name}
                onClick={() => handleNavClick(item)}
                className={`px-3 py-2 text-sm font-medium transition-colors duration-200 cursor-pointer ${
                  location.pathname === '/' && item.href === 'home'
                    ? 'text-amber-600 border-b-2 border-amber-600'
                    : 'text-gray-700 hover:text-amber-600'
                }`}
              >
                {item.name}
              </button>
            ))}
          </nav>

          <div className="hidden md:flex items-center space-x-4">
            {/* Mock Test Button - Golden Firework Special */}
            <button
              onClick={() => setShowMockTestPopup(true)}
              className="group relative overflow-hidden bg-gradient-to-r from-yellow-400 via-amber-500 to-orange-500 hover:from-yellow-300 hover:via-amber-400 hover:to-orange-400 text-white px-6 py-2.5 rounded-xl font-bold text-sm transition-all duration-500 transform hover:scale-110 hover:shadow-2xl hover:shadow-amber-500/50 animate-pulse hover:animate-none border-2 border-yellow-300 hover:border-yellow-200"
            >
              {/* Golden animated background overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-300 via-amber-400 to-orange-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              {/* Multiple shimmer effects for firework feel */}
              <div className="absolute inset-0 -top-px overflow-hidden rounded-xl">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-200/30 to-transparent skew-x-12 translate-x-full group-hover:-translate-x-full transition-transform duration-900 ease-out delay-100"></div>
              </div>
              
              {/* Firework particles effect */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute top-1 left-2 w-1 h-1 bg-yellow-200 rounded-full animate-ping"></div>
                <div className="absolute top-2 right-3 w-1 h-1 bg-amber-200 rounded-full animate-ping" style={{animationDelay: '0.2s'}}></div>
                <div className="absolute bottom-2 left-4 w-1 h-1 bg-orange-200 rounded-full animate-ping" style={{animationDelay: '0.4s'}}></div>
                <div className="absolute bottom-1 right-2 w-1 h-1 bg-yellow-300 rounded-full animate-ping" style={{animationDelay: '0.6s'}}></div>
                <div className="absolute top-3 left-1/2 w-1 h-1 bg-amber-300 rounded-full animate-ping" style={{animationDelay: '0.8s'}}></div>
              </div>
              
              {/* Button content */}
              <span className="relative z-20 flex items-center space-x-2">
                <span className="text-lg animate-bounce">🎯</span>
                <span className="tracking-wide">Mock Test</span>
                <span className="inline-block transition-transform duration-300 group-hover:rotate-12 group-hover:scale-125">💥</span>
              </span>
              
              {/* Multi-layer glow effects */}
              <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400 via-amber-500 to-orange-500 rounded-xl blur opacity-40 group-hover:opacity-100 transition-opacity duration-500 -z-10"></div>
              <div className="absolute -inset-2 bg-gradient-to-r from-yellow-300 via-amber-400 to-orange-400 rounded-xl blur-lg opacity-20 group-hover:opacity-60 transition-opacity duration-700 -z-20"></div>
              
              {/* Explosive ring effect on hover */}
              <div className="absolute inset-0 rounded-xl border-2 border-transparent group-hover:border-yellow-200 group-hover:scale-125 transition-all duration-300 opacity-0 group-hover:opacity-100"></div>
            </button>

            <Link
              to="/apply"
              className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
            >
              Apply Now
            </Link>
            <Link
              to="/admin"
              className="text-gray-700 hover:text-amber-600 px-3 py-2 text-sm font-medium transition-colors duration-200"
            >
              Admin
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="h-6 w-6 text-gray-700" />
            ) : (
              <Menu className="h-6 w-6 text-gray-700" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100">
            <div className="flex flex-col space-y-2">
              {navigation.map((item) => (
                <button
                  key={item.name}
                  onClick={() => {
                    handleNavClick(item);
                    setIsMenuOpen(false);
                  }}
                  className={`px-3 py-2 text-sm font-medium transition-colors duration-200 text-left ${
                    location.pathname === '/' && item.href === 'home'
                      ? 'text-amber-600 bg-amber-50'
                      : 'text-gray-700 hover:text-amber-600 hover:bg-gray-50'
                  }`}
                >
                  {item.name}
                </button>
              ))}
              <div className="pt-2 border-t border-gray-100 mt-2">
                {/* Mock Test Button - Golden Firework Mobile */}
                <button
                  onClick={() => {
                    setShowMockTestPopup(true);
                    setIsMenuOpen(false);
                  }}
                  className="group block w-full mb-3 relative overflow-hidden bg-gradient-to-r from-yellow-400 via-amber-500 to-orange-500 hover:from-yellow-300 hover:via-amber-400 hover:to-orange-400 active:from-yellow-500 active:via-amber-600 active:to-orange-600 text-white px-3 py-3 rounded-lg font-bold text-center transition-all duration-500 transform hover:scale-105 active:scale-95 border-2 border-yellow-300"
                >
                  {/* Golden glow effect */}
                  <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400 via-amber-500 to-orange-500 rounded-lg blur opacity-50 -z-10"></div>
                  
                  {/* Firework particles for mobile */}
                  <div className="absolute inset-0 opacity-0 group-active:opacity-100 transition-opacity duration-300">
                    <div className="absolute top-2 left-4 w-1 h-1 bg-yellow-200 rounded-full animate-ping"></div>
                    <div className="absolute top-3 right-6 w-1 h-1 bg-amber-200 rounded-full animate-ping" style={{animationDelay: '0.3s'}}></div>
                    <div className="absolute bottom-3 left-6 w-1 h-1 bg-orange-200 rounded-full animate-ping" style={{animationDelay: '0.6s'}}></div>
                    <div className="absolute bottom-2 right-4 w-1 h-1 bg-yellow-300 rounded-full animate-ping" style={{animationDelay: '0.9s'}}></div>
                  </div>
                  
                  <span className="flex items-center justify-center space-x-2 relative z-10">
                    <span className="text-lg animate-bounce">🎯</span>
                    <span className="tracking-wide">Mock Test</span>
                    <span className="group-active:rotate-12 group-active:scale-125 transition-transform duration-300">💥</span>
                  </span>
                </button>
                
                <Link
                  to="/apply"
                  className="block bg-amber-600 hover:bg-amber-700 text-white px-3 py-2 rounded-lg font-medium text-center mb-2 transition-colors duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Apply Now
                </Link>
                <Link
                  to="/admin"
                  className="block text-gray-700 hover:text-amber-600 px-3 py-2 text-sm font-medium transition-colors duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Admin
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Mock Test Feature Popup */}
      {showMockTestPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 relative overflow-hidden">
            {/* Decorative background */}
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50"></div>
            
            {/* Header with sparkles */}
            <div className="relative z-10 text-center p-6 border-b border-amber-100">
              <div className="flex justify-center mb-4">
                <div className="bg-gradient-to-r from-yellow-400 via-amber-500 to-orange-500 p-3 rounded-full">
                  <Sparkles className="h-8 w-8 text-white" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">🎉 New Feature Alert!</h2>
              <div className="flex items-center justify-center space-x-1 text-amber-600">
                <Star className="h-4 w-4 fill-current" />
                <span className="font-semibold">Yuga Yatra Mock Tests</span>
                <Star className="h-4 w-4 fill-current" />
              </div>
            </div>

            {/* Content */}
            <div className="relative z-10 p-6 text-center">
              <p className="text-gray-700 text-lg mb-4 leading-relaxed">
                We're excited to introduce our <span className="font-semibold text-amber-600">Mock Test feature</span>! 
                Practice and prepare for your MBA journey with our comprehensive test series.
              </p>
              
              <div className="bg-gradient-to-r from-green-100 to-emerald-100 border border-green-200 rounded-lg p-4 mb-6">
                <p className="text-green-800 font-semibold flex items-center justify-center">
                  <span className="text-2xl mr-2">🎁</span>
                  Completely FREE for Everyone!
                </p>
              </div>

              <p className="text-gray-600 mb-6">
                Keep enjoying this amazing feature and boost your preparation with our expertly crafted mock tests.
              </p>

              {/* Action buttons */}
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowMockTestPopup(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                >
                  Maybe Later
                </button>
                <Link
                  to="/mock-test"
                  onClick={() => setShowMockTestPopup(false)}
                  className="flex-1 bg-gradient-to-r from-yellow-400 via-amber-500 to-orange-500 hover:from-yellow-300 hover:via-amber-400 hover:to-orange-400 text-white px-4 py-2 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg text-center"
                >
                  Start Testing! 🚀
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}