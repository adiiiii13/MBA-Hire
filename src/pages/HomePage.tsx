import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Users, Target, Award, TrendingUp, MapPin, Clock, Building, Mail, Phone, MessageSquare, Send, GraduationCap, Zap, Trophy, ExternalLink, Briefcase } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  subject: z.string().min(5, 'Subject must be at least 5 characters'),
  message: z.string().min(20, 'Message must be at least 20 characters'),
});

type ContactFormData = z.infer<typeof contactSchema>;

const sampleInternships = [
  {
    id: 1,
    title: 'Finance Intern',
    company: 'YugaYatra Retail (OPC) Private Limited',
    location: 'Remote',
    type: 'Internship',
    duration: '3-6 months',
    specialization: 'Finance',
    description: 'Join our finance team to learn financial analysis, budgeting, and strategic planning in the retail industry.',
    requirements: ['MBA student (Finance)', 'Excel proficiency', 'Analytical mindset', 'Strong communication']
  },
  {
    id: 2,
    title: 'Digital Marketing Intern',
    company: 'YugaYatra Retail (OPC) Private Limited',
    location: 'Remote',
    type: 'Internship',
    duration: '4-6 months',
    specialization: 'Marketing',
    description: 'Lead digital marketing campaigns and brand strategy for our growing retail business.',
    requirements: ['MBA student (Marketing)', 'Social media expertise', 'Content creation', 'Campaign management']
  },
  {
    id: 3,
    title: 'Business Strategy Intern',
    company: 'YugaYatra Retail (OPC) Private Limited',
    location: 'Remote',
    type: 'Internship',
    duration: '6 months',
    specialization: 'Strategy & Consulting',
    description: 'Work on strategic initiatives and business expansion projects for our retail operations.',
    requirements: ['MBA student', 'Strategic thinking', 'Market research', 'Presentation skills']
  },
  {
    id: 4,
    title: 'Operations Management Intern',
    company: 'YugaYatra Retail (OPC) Private Limited',
    location: 'Remote',
    type: 'Internship',
    duration: '3-4 months',
    specialization: 'Operations',
    description: 'Optimize our supply chain and retail operations for improved efficiency and customer satisfaction.',
    requirements: ['MBA student (Operations)', 'Process improvement', 'Supply chain knowledge', 'Team collaboration']
  },
  {
    id: 5,
    title: 'Data Analytics Intern',
    company: 'YugaYatra Retail (OPC) Private Limited',
    location: 'Remote',
    type: 'Internship',
    duration: '4-5 months',
    specialization: 'Data Analytics',
    description: 'Analyze customer data and retail metrics to drive data-driven decision making.',
    requirements: ['MBA student', 'Python/R skills', 'Data visualization', 'Business intelligence']
  },
  {
    id: 6,
    title: 'HR Development Intern',
    company: 'YugaYatra Retail (OPC) Private Limited',
    location: 'Remote',
    type: 'Internship',
    duration: '3-6 months',
    specialization: 'Human Resources',
    description: 'Support HR initiatives including talent acquisition, employee engagement, and organizational development.',
    requirements: ['MBA student (HR)', 'People skills', 'Communication', 'HR processes']
  }
];

export function HomePage() {
  const [selectedSpecialization, setSelectedSpecialization] = React.useState<string>('all');
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema)
  });

  const specializations = ['all', 'Finance', 'Marketing', 'Strategy & Consulting', 'Operations', 'Data Analytics', 'Human Resources'];

  const filteredInternships = selectedSpecialization === 'all' 
    ? sampleInternships 
    : sampleInternships.filter(internship => internship.specialization === selectedSpecialization);

  // Handle URL hash navigation
  React.useEffect(() => {
    const hash = window.location.hash.replace('#', '');
    if (hash) {
      const element = document.getElementById(hash);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    }
  }, []);

  const onSubmit = async (_data: ContactFormData) => {
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('Message sent successfully! We\'ll get back to you soon.');
      reset();
    } catch (error) {
      toast.error('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section id="home" className="bg-gradient-to-br from-amber-600 via-yellow-600 to-orange-700 text-white py-12 sm:py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="text-center lg:text-left">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight mb-4 sm:mb-6">
                Transform Your MBA Journey with 
                <span className="text-yellow-200"> YugaYatra Retail</span>
              </h1>
              <p className="text-lg sm:text-xl text-amber-100 mb-6 sm:mb-8 leading-relaxed">
                YugaYatra Retail (OPC) Private Limited offers exceptional MBA internship and career opportunities, 
                creating perfect synergies between talent and retail innovation.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center">
                <Link
                  to="/apply"
                  className="bg-white hover:bg-gray-100 text-amber-700 px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold text-base sm:text-lg transition-all duration-200 flex items-center justify-center group shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  <Users className="mr-2 h-5 w-5" />
                  Apply as MBA Student
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <a
                  href="https://yugayatraretail.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border-2 border-white hover:bg-white hover:text-amber-700 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold text-base sm:text-lg transition-all duration-200 flex items-center justify-center shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  <ExternalLink className="mr-2 h-5 w-5" />
                  Visit YugaYatra
                </a>
              </div>
              <div className="mt-4 flex justify-center">
                <button
                  onClick={() => scrollToSection('services')}
                  className="border-2 border-yellow-200 hover:bg-yellow-200 hover:text-amber-700 text-yellow-200 px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold text-base sm:text-lg transition-all duration-200 flex items-center justify-center shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  <Briefcase className="mr-2 h-5 w-5" />
                  Our Services
                </button>
              </div>
            </div>
            <div className="mt-8 lg:mt-0">
              <div className="relative">
                <img
                  src="https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg"
                  alt="MBA professionals collaborating"
                  className="rounded-2xl shadow-2xl w-full h-64 sm:h-80 lg:h-auto object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-amber-900/20 to-transparent rounded-2xl"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section id="about" className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-orange-100 via-amber-50 to-yellow-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 sm:mb-6">
              Why Choose YugaYatra?
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              We leverage cutting-edge technology and deep retail expertise to match MBA students with their perfect career fit, 
              ensuring both students and our retail organization find their ideal synergy.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            <div className="text-center group p-4">
              <div className="bg-amber-100 w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-amber-200 transition-colors">
                <Users className="h-8 w-8 sm:h-10 sm:w-10 text-amber-600" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Top MBA Students</h3>
              <p className="text-sm sm:text-base text-gray-600">Access to the best MBA talent from premier business schools worldwide.</p>
            </div>

            <div className="text-center group p-4">
              <div className="bg-yellow-100 w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-yellow-200 transition-colors">
                <Target className="h-8 w-8 sm:h-10 sm:w-10 text-yellow-600" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">AI-Powered Matching</h3>
              <p className="text-sm sm:text-base text-gray-600">Our AI analyzes skills and predicts the best-fit roles for each candidate.</p>
            </div>

            <div className="text-center group p-4">
              <div className="bg-orange-100 w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-orange-200 transition-colors">
                <Award className="h-8 w-8 sm:h-10 sm:w-10 text-orange-600" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Quality Assurance</h3>
              <p className="text-sm sm:text-base text-gray-600">Rigorous screening process ensures only qualified candidates reach you.</p>
            </div>

            <div className="text-center group p-4">
              <div className="bg-amber-100 w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-amber-200 transition-colors">
                <TrendingUp className="h-8 w-8 sm:h-10 sm:w-10 text-amber-600" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Fast Results</h3>
              <p className="text-sm sm:text-base text-gray-600">Streamlined process gets you connected with top talent quickly.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 sm:py-16 bg-gradient-to-br from-orange-100 via-amber-50 to-yellow-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            <div className="text-center p-4">
              <div className="text-3xl sm:text-4xl font-bold text-amber-600 mb-2">300+</div>
              <div className="text-sm sm:text-base text-gray-600">MBA Interns Placed</div>
            </div>
            <div className="text-center p-4">
              <div className="text-3xl sm:text-4xl font-bold text-yellow-600 mb-2">25+</div>
              <div className="text-sm sm:text-base text-gray-600">Retail Locations</div>
            </div>
            <div className="text-center p-4">
              <div className="text-3xl sm:text-4xl font-bold text-orange-600 mb-2">98%</div>
              <div className="text-sm sm:text-base text-gray-600">Intern Satisfaction Rate</div>
            </div>
            <div className="text-center p-4">
              <div className="text-3xl sm:text-4xl font-bold text-amber-600 mb-2">5+</div>
              <div className="text-sm sm:text-base text-gray-600">Years of Excellence</div>
            </div>
          </div>
        </div>
      </section>

      {/* Hire Section */}
      <section id="hire" className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-amber-600 to-orange-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="text-center lg:text-left">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight mb-4 sm:mb-6">
                Join YugaYatra's 
                <span className="text-yellow-200"> Growing Retail Empire</span>
              </h2>
              <p className="text-xl text-amber-100 mb-8">
                Experience the future of retail at YugaYatra Retail (OPC) Private Limited. 
                We offer comprehensive MBA programs, internships, and career opportunities in retail innovation.
              </p>
              <Link
                to="/apply"
                className="bg-white hover:bg-gray-100 text-amber-700 px-8 py-4 rounded-lg font-semibold text-lg transition-colors duration-200 inline-flex items-center"
              >
                Apply for Internship
                <Target className="ml-2 h-5 w-5" />
              </Link>
            </div>
            <div className="hidden lg:block">
              <img
                src="https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg"
                alt="YugaYatra team meeting"
                className="rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20">
          <div className="text-center mb-16">
            <h3 className="text-3xl lg:text-4xl font-bold text-white mb-6">
              Why Hire Through Our Platform?
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-white/10 to-white/20 backdrop-blur-sm rounded-2xl p-8 text-center">
              <div className="bg-white/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Zap className="h-8 w-8 text-white" />
              </div>
              <h4 className="text-xl font-bold text-white mb-4">AI-Powered Matching</h4>
              <p className="text-amber-100">
                Our advanced algorithms analyze student profiles and predict their success in specific roles, 
                ensuring perfect matches every time.
              </p>
            </div>

            <div className="bg-gradient-to-br from-white/10 to-white/20 backdrop-blur-sm rounded-2xl p-8 text-center">
              <div className="bg-white/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Trophy className="h-8 w-8 text-white" />
              </div>
              <h4 className="text-xl font-bold text-white mb-4">Pre-Screened Talent</h4>
              <p className="text-amber-100">
                Every MBA student goes through our rigorous evaluation process, so you only see 
                the most qualified candidates.
              </p>
            </div>

            <div className="bg-gradient-to-br from-white/10 to-white/20 backdrop-blur-sm rounded-2xl p-8 text-center">
              <div className="bg-white/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Target className="h-8 w-8 text-white" />
              </div>
              <h4 className="text-xl font-bold text-white mb-4">Perfect Fit Guarantee</h4>
              <p className="text-amber-100">
                Our placement success rate speaks for itself. We guarantee you'll find the right 
                talent for your team's specific needs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Internships Section */}
      <section id="internships" className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-orange-100 via-amber-50 to-yellow-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 sm:mb-6">
              MBA Internship Opportunities
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
              Discover exciting internship opportunities at YugaYatra Retail (OPC) Private Limited. 
              Gain real-world experience and jumpstart your career with us.
            </p>
          </div>

          {/* Filter Section */}
          <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-lg shadow p-6 mb-8">
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <h3 className="text-lg font-semibold text-gray-900">Filter by Specialization:</h3>
              <div className="flex flex-wrap gap-2">
                {specializations.map(spec => (
                  <button
                    key={spec}
                    onClick={() => setSelectedSpecialization(spec)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      selectedSpecialization === spec
                        ? 'bg-amber-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-amber-100'
                    }`}
                  >
                    {spec === 'all' ? 'All Positions' : spec}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Internships Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {filteredInternships.map((internship) => (
              <div key={internship.id} className="bg-gradient-to-br from-amber-50 to-orange-100 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-amber-200">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <span className="bg-amber-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                      {internship.specialization}
                    </span>
                    <span className="bg-emerald-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                      {internship.type}
                    </span>
                  </div>

                  <h4 className="text-xl font-bold text-gray-900 mb-2">{internship.title}</h4>
                  
                  <div className="flex items-center text-gray-700 mb-2">
                    <Building className="h-4 w-4 mr-2" />
                    <span className="text-sm font-medium">{internship.company}</span>
                  </div>
                  
                  <div className="flex items-center text-gray-700 mb-2">
                    <MapPin className="h-4 w-4 mr-2" />
                    <span className="text-sm font-medium">{internship.location}</span>
                  </div>

                  <div className="flex items-center text-gray-700 mb-4">
                    <Clock className="h-4 w-4 mr-2" />
                    <span className="text-sm font-medium">{internship.duration}</span>
                  </div>

                  <p className="text-gray-700 mb-4 text-sm leading-relaxed">{internship.description}</p>

                  <div className="mb-4">
                    <h5 className="font-semibold text-gray-900 mb-2">Requirements:</h5>
                    <ul className="text-sm text-gray-700 space-y-1">
                      {internship.requirements.slice(0, 2).map((req, index) => (
                        <li key={index} className="flex items-center">
                          <div className="w-1.5 h-1.5 bg-amber-600 rounded-full mr-2"></div>
                          {req}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-4 border-t border-amber-200">
                    <button className="w-full bg-amber-600 hover:bg-amber-700 text-white font-medium text-sm py-2 px-4 rounded-lg flex items-center justify-center transition-colors">
                      Apply Now
                      <ArrowRight className="h-4 w-4 ml-1" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Internships CTA */}
          <div className="bg-gradient-to-r from-amber-600 to-orange-700 rounded-2xl p-8 text-center text-white">
            <h3 className="text-2xl lg:text-3xl font-bold mb-4">
              Ready to Start Your Career Journey?
            </h3>
            <p className="text-lg text-amber-100 mb-6 max-w-2xl mx-auto">
              Join YugaYatra Retail (OPC) Private Limited for an enriching internship experience. 
              Build your skills and shape the future of retail with us.
            </p>
            <Link
              to="/apply"
              className="bg-white hover:bg-gray-100 text-amber-600 px-8 py-3 rounded-lg font-semibold transition-colors duration-200 inline-flex items-center"
            >
              Apply for Internship
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-orange-100 via-amber-50 to-yellow-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 sm:mb-6">
              Our MBA Services
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
              YugaYatra Retail (OPC) Private Limited offers comprehensive services designed to 
              accelerate your MBA career journey and professional development.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-amber-50 to-orange-100 rounded-2xl p-8 text-center">
              <div className="bg-amber-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Target className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Career Placement</h3>
              <p className="text-gray-600">
                AI-powered matching system connects you with the perfect role based on your skills, 
                interests, and career aspirations in the retail industry.
              </p>
            </div>

            <div className="bg-gradient-to-br from-yellow-50 to-amber-100 rounded-2xl p-8 text-center">
              <div className="bg-yellow-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <GraduationCap className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Skill Development</h3>
              <p className="text-gray-600">
                Comprehensive training programs covering retail management, digital marketing, 
                supply chain optimization, and customer experience enhancement.
              </p>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-red-100 rounded-2xl p-8 text-center">
              <div className="bg-orange-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Award className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Mentorship Program</h3>
              <p className="text-gray-600">
                Get paired with industry veterans and successful alumni who guide your 
                professional growth and career advancement in retail business.
              </p>
            </div>

            <div className="bg-gradient-to-br from-emerald-50 to-green-100 rounded-2xl p-8 text-center">
              <div className="bg-emerald-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Network Building</h3>
              <p className="text-gray-600">
                Connect with a vibrant community of MBA professionals, industry leaders, 
                and potential collaborators in the retail ecosystem.
              </p>
            </div>

            <div className="bg-gradient-to-br from-indigo-50 to-blue-100 rounded-2xl p-8 text-center">
              <div className="bg-indigo-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Zap className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Innovation Labs</h3>
              <p className="text-gray-600">
                Work on cutting-edge retail technology projects, from AI-driven customer insights 
                to next-generation e-commerce solutions.
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-indigo-100 rounded-2xl p-8 text-center">
              <div className="bg-purple-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Trophy className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Leadership Development</h3>
              <p className="text-gray-600">
                Comprehensive leadership training focusing on retail operations, team management, 
                and strategic decision-making in dynamic business environments.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Blog Section */}
      <section id="blog" className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-orange-100 via-amber-50 to-yellow-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 sm:mb-6">
              Latest Insights & Updates
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
              Stay updated with the latest trends in retail, MBA career insights, and success stories 
              from our YugaYatra community.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <article className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <img 
                src="https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg" 
                alt="Retail trends" 
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <div className="flex items-center mb-3">
                  <span className="bg-amber-100 text-amber-800 px-2 py-1 rounded text-xs font-medium">Retail Trends</span>
                  <span className="text-gray-500 text-sm ml-auto">Dec 15, 2024</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  The Future of Retail: How AI is Transforming Customer Experience
                </h3>
                <p className="text-gray-600 mb-4">
                  Explore how artificial intelligence is revolutionizing the retail landscape and creating 
                  new opportunities for MBA professionals...
                </p>
                <a href="#" className="text-amber-600 hover:text-amber-800 font-medium text-sm flex items-center">
                  Read More <ArrowRight className="h-4 w-4 ml-1" />
                </a>
              </div>
            </article>

            <article className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <img 
                src="https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg" 
                alt="MBA success" 
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <div className="flex items-center mb-3">
                  <span className="bg-emerald-100 text-emerald-800 px-2 py-1 rounded text-xs font-medium">Success Story</span>
                  <span className="text-gray-500 text-sm ml-auto">Dec 10, 2024</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  From MBA Intern to Operations Manager: Priya's Journey
                </h3>
                <p className="text-gray-600 mb-4">
                  Discover how Priya leveraged her internship at YugaYatra to build a successful 
                  career in retail operations management...
                </p>
                <a href="#" className="text-amber-600 hover:text-amber-800 font-medium text-sm flex items-center">
                  Read More <ArrowRight className="h-4 w-4 ml-1" />
                </a>
              </div>
            </article>

            <article className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <img 
                src="https://images.pexels.com/photos/3184317/pexels-photo-3184317.jpeg" 
                alt="MBA tips" 
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <div className="flex items-center mb-3">
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">Career Tips</span>
                  <span className="text-gray-500 text-sm ml-auto">Dec 5, 2024</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Top 10 Skills Every MBA Graduate Needs in 2025
                </h3>
                <p className="text-gray-600 mb-4">
                  Essential skills that will set you apart in today's competitive job market and 
                  help you excel in your retail career...
                </p>
                <a href="#" className="text-amber-600 hover:text-amber-800 font-medium text-sm flex items-center">
                  Read More <ArrowRight className="h-4 w-4 ml-1" />
                </a>
              </div>
            </article>
          </div>

          <div className="text-center mt-12">
            <a href="#" className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors duration-200 inline-flex items-center">
              View All Articles
              <ArrowRight className="ml-2 h-5 w-5" />
            </a>
          </div>
        </div>
      </section>

      {/* Achievements Section */}
      <section id="achievements" className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-orange-100 via-amber-50 to-yellow-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 sm:mb-6">
              Our Achievements
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
              YugaYatra Retail (OPC) Private Limited has achieved remarkable milestones in 
              MBA talent development and retail innovation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            <div className="text-center">
              <div className="bg-gradient-to-br from-amber-100 to-orange-200 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trophy className="h-10 w-10 text-amber-700" />
              </div>
              <div className="text-3xl font-bold text-amber-600 mb-2">15+</div>
              <div className="text-gray-600 font-medium">Industry Awards</div>
              <div className="text-sm text-gray-500 mt-1">Excellence in Retail Innovation</div>
            </div>

            <div className="text-center">
              <div className="bg-gradient-to-br from-emerald-100 to-green-200 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-10 w-10 text-emerald-700" />
              </div>
              <div className="text-3xl font-bold text-emerald-600 mb-2">2500+</div>
              <div className="text-gray-600 font-medium">MBA Placements</div>
              <div className="text-sm text-gray-500 mt-1">Successful Career Launches</div>
            </div>

            <div className="text-center">
              <div className="bg-gradient-to-br from-blue-100 to-indigo-200 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="h-10 w-10 text-blue-700" />
              </div>
              <div className="text-3xl font-bold text-blue-600 mb-2">98%</div>
              <div className="text-gray-600 font-medium">Client Satisfaction</div>
              <div className="text-sm text-gray-500 mt-1">Happy Companies & Students</div>
            </div>

            <div className="text-center">
              <div className="bg-gradient-to-br from-purple-100 to-pink-200 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="h-10 w-10 text-purple-700" />
              </div>
              <div className="text-3xl font-bold text-purple-600 mb-2">50+</div>
              <div className="text-gray-600 font-medium">Corporate Partners</div>
              <div className="text-sm text-gray-500 mt-1">Leading Retail Companies</div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-amber-600 to-orange-700 rounded-2xl p-8 text-white">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-2xl font-bold mb-4">Recognition & Certifications</h3>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <Award className="h-5 w-5 mr-3 text-yellow-200" />
                    <span>Best MBA Placement Platform 2024 - Retail Industry Awards</span>
                  </li>
                  <li className="flex items-center">
                    <Award className="h-5 w-5 mr-3 text-yellow-200" />
                    <span>Top Innovation in HR Technology - Business Excellence Awards</span>
                  </li>
                  <li className="flex items-center">
                    <Award className="h-5 w-5 mr-3 text-yellow-200" />
                    <span>ISO 9001:2015 Certified - Quality Management</span>
                  </li>
                  <li className="flex items-center">
                    <Award className="h-5 w-5 mr-3 text-yellow-200" />
                    <span>NASSCOM Partner - Technology Excellence</span>
                  </li>
                </ul>
              </div>
              <div className="text-center lg:text-right">
                <img 
                  src="https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg" 
                  alt="Achievement celebration" 
                  className="rounded-xl shadow-lg max-w-sm mx-auto lg:mx-0"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-orange-100 via-amber-50 to-yellow-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 sm:mb-6">
              Get in Touch
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
              Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Contact Information */}
            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Contact Information</h3>
                <p className="text-gray-600 mb-8">
                  Reach out to us through any of the following channels, and our team will get back to you promptly.
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="bg-amber-100 p-3 rounded-full">
                    <Mail className="h-6 w-6 text-amber-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Email</h4>
                    <p className="text-gray-600">careers@yugayatra.com</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="bg-amber-100 p-3 rounded-full">
                    <Phone className="h-6 w-6 text-amber-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Phone</h4>
                    <p className="text-gray-600">+91 98765 43210</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="bg-amber-100 p-3 rounded-full">
                    <MapPin className="h-6 w-6 text-amber-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Head Office</h4>
                    <p className="text-gray-600">Business District, Andheri East<br />Mumbai, Maharashtra 400069</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="bg-amber-100 p-3 rounded-full">
                    <MessageSquare className="h-6 w-6 text-amber-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Support Hours</h4>
                    <p className="text-gray-600">Monday - Friday: 9:00 AM - 6:00 PM IST</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-gradient-to-br from-white to-amber-50 rounded-2xl p-8 shadow-lg border border-amber-100">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    {...register('name')}
                    type="text"
                    id="name"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    placeholder="Your full name"
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    {...register('email')}
                    type="email"
                    id="email"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    placeholder="your.email@example.com"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                    Subject
                  </label>
                  <input
                    {...register('subject')}
                    type="text"
                    id="subject"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    placeholder="What can we help you with?"
                  />
                  {errors.subject && (
                    <p className="mt-1 text-sm text-red-600">{errors.subject.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Message
                  </label>
                  <textarea
                    {...register('message')}
                    id="message"
                    rows={5}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    placeholder="Tell us more about your inquiry..."
                  />
                  {errors.message && (
                    <p className="mt-1 text-sm text-red-600">{errors.message.message}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-amber-600 hover:bg-amber-700 disabled:bg-amber-400 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200 flex items-center justify-center"
                >
                  {isSubmitting ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Sending...
                    </div>
                  ) : (
                    <>
                      Send Message
                      <Send className="ml-2 h-4 w-4" />
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 bg-gradient-to-r from-amber-600 to-orange-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">
            Ready to Start Your Retail Career Journey?
          </h2>
          <p className="text-xl text-amber-100 mb-8 max-w-2xl mx-auto">
            Whether you're an MBA student looking for internship opportunities or want to explore our services, 
            YugaYatra Retail (OPC) Private Limited is here to accelerate your career growth.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/apply"
              className="bg-white hover:bg-gray-100 text-amber-700 px-8 py-4 rounded-lg font-semibold text-lg transition-colors duration-200"
            >
              Apply for Internship
            </Link>
            <button
              onClick={() => scrollToSection('services')}
              className="border-2 border-white hover:bg-white hover:text-amber-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors duration-200"
            >
              Explore Our Services
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}