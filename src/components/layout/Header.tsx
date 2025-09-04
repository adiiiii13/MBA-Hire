import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { GraduationCap, Menu, X } from 'lucide-react';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
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
    </header>
  );
}