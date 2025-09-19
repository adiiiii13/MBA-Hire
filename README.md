# 🎓 YugaYatra MBA Talent Platform

A comprehensive MBA talent platform connecting top business students with YugaYatra Retail (OPC) Private Limited for internship, career opportunities, and skill development through advanced mock testing systems.

## ✨ Key Features

### 🎯 For Students
- **Interactive Homepage** with smooth scrolling navigation and golden theme
- **Advanced Mock Test System** with progressive unlocking and anti-cheating protection
- **Comprehensive Internship Portal** with filtering by specialization
- **Application Management** with form validation and status tracking
- **Mobile-responsive** design optimized for all devices
- **Success tracking** for applications and test completions

### � Mock Test System
- **3-Level Progression**: Easy → Medium → Hard with sequential unlocking
- **Individual Test Progression**: Tests within each level unlock sequentially
- **Anti-Cheating Protection**: Full-screen mode, tab switching detection
- **Comprehensive Question Banks**: 100+ questions across 4 categories
  - Quantitative Aptitude (25 questions)
  - English Language (30 questions) 
  - Logical Reasoning (25 questions)
  - General Knowledge (20 questions)
- **Visual Progress Tracking**: Beautiful progression chains with lock/unlock states
- **Secure Exam Interface**: Timer, question navigation, results calculation

### 👨‍💼 For Administrators
- **Admin Dashboard** with comprehensive candidate management
- **Application Status Management** (pending, shortlisted, approved, rejected)
- **Mock Test Analytics** and performance tracking
- **Resume Management** with viewing and download capabilities
- **Data Export** functionality for analysis
- **Protected Routes** with secure authentication

## 🎨 Design & UI

- **Golden Premium Theme** throughout the application
- **Animated Mock Test Button** with spectacular firework effects in navbar
- **Progressive UI Elements** with lock/unlock visual feedback
- **Responsive Typography** and professional spacing
- **Enhanced Visual Hierarchy** with gradient backgrounds
- **Polished Progression Chains** with status indicators and smooth transitions

## 🛠️ Technology Stack

### Frontend
- **React 18** + **TypeScript** for type-safe development
- **Vite** for fast development and optimized builds
- **Tailwind CSS** for utility-first styling
- **React Router DOM** for seamless navigation
- **React Hook Form** + **Zod** for robust form validation
- **Lucide React** for beautiful icons
- **React Hot Toast** for user notifications

### Backend & Storage
- **Node.js** + **Express** API server
- **MySQL** database with comprehensive schemas
- **JWT Authentication** for secure admin access
- **Local Storage** for client-side state management

## 📁 Enhanced Project Structure

```
src/
├── components/
│   ├── layout/
│   │   ├── Header.tsx          # Enhanced navbar with Mock Test button & animations
│   │   └── Footer.tsx          # Contact information and branding
│   └── ProtectedRoute.tsx      # Route protection for admin areas
├── pages/
│   ├── HomePage.tsx            # Enhanced homepage with internship redirect
│   ├── ApplicationForm.tsx     # Comprehensive application form
│   ├── SuccessPage.tsx         # Application confirmation
│   ├── MockTestPage.tsx        # Progressive test selection interface
│   ├── ExamInterface.tsx       # Secure exam delivery system
│   ├── AdminLogin.tsx          # Admin authentication
│   ├── AdminDashboard.tsx      # Enhanced admin panel
│   ├── ContactPage.tsx         # Dedicated contact page
│   └── HirePage.tsx           # Hiring process information
├── lib/
│   └── storage.ts              # Enhanced storage utilities
├── types/
│   └── index.ts                # Comprehensive TypeScript definitions
└── App.tsx                     # Main application with routing
```

## 🚀 Getting Started

### Prerequisites
- **Node.js 18+** and **npm**
- **MySQL** database server
- **Git** for version control

### Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/adiiiii13/MBA-Hire.git
   cd MBA-Hire
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Database Setup**
   ```bash
   # Create MySQL database
   # Import schema from database/schema.sql
   # Update connection settings in backend/config
   ```

4. **Environment Configuration**
   ```bash
   cp .env.example .env
   # Configure database connections, JWT secrets, etc.
   ```

5. **Start Development Servers**
   ```bash
   # Frontend (Vite dev server)
   npm run dev
   
   # Backend API server
   cd backend && npm run dev
   ```

6. **Access Application**
   - **Frontend**: http://localhost:5173
   - **Backend API**: http://localhost:3001

### Production Build
```bash
npm run build
npm run preview
```

## 🔐 Authentication & Access

### Admin Access
- **Default Email**: admin@mbatalent.com
- **Default Password**: admin123
- **Features**: Complete dashboard, candidate management, test analytics

### Student Access
- **Open Registration**: Available through application form
- **Mock Tests**: Progressive unlocking system
- **Application Tracking**: Status updates and notifications

## 📱 Navigation & User Journey

### Main Navigation (Smooth Scrolling)
- **Home** → Hero section with company overview
- **About** → YugaYatra company information
- **Services** → MBA services and offerings
- **Internships** → Available opportunities with direct application
- **Mock Tests** → Advanced testing system with progression
- **Contact** → Contact form and company details

### Student Experience Flow
1. **Homepage** → Learn about opportunities
2. **Mock Tests** → Take progressive skill assessments
3. **Internships** → Browse and filter opportunities
4. **Application** → Submit comprehensive application
5. **Success** → Confirmation and next steps

### Admin Experience Flow
1. **Admin Login** → Secure authentication
2. **Dashboard** → Overview of all applications and test results
3. **Candidate Management** → Detailed profile reviews
4. **Analytics** → Performance tracking and insights

## 🎯 Advanced Features

### Mock Test System
- **Progressive Difficulty**: Tests unlock based on previous completions
- **Visual Progress Tracking**: Beautiful chains showing unlock status
- **Anti-Cheating Measures**: Full-screen enforcement, tab monitoring
- **Comprehensive Analytics**: Performance tracking and insights
- **Question Bank Management**: Extensive database of quality questions

### Enhanced UI/UX
- **Animated Elements**: Spectacular button animations and visual feedback
- **Responsive Design**: Optimized for desktop, tablet, and mobile
- **Professional Aesthetics**: Golden theme with premium feel
- **Accessibility**: WCAG compliant design principles

### Security Features
- **JWT Authentication**: Secure token-based authentication
- **Input Validation**: Comprehensive form validation and sanitization
- **Protected Routes**: Role-based access control
- **Environment Security**: No hardcoded secrets or credentials

## 📊 Recent Updates & Improvements

### Version 2.5.0 (September 2025)
- ✅ **Enhanced Mock Test UI**: Simplified and polished progression chains
- ✅ **Internship Redirect**: Direct navigation from internship cards to application form
- ✅ **Visual Improvements**: Better lock icons and status indicators
- ✅ **Performance Optimization**: Reduced animations for better user experience
- ✅ **Mobile Responsiveness**: Enhanced mobile experience across all features

### Key Improvements
- **Simplified Design**: Clean, professional progression indicators
- **Enhanced Navigation**: Seamless transitions between sections
- **Better Accessibility**: Improved contrast and readability
- **Optimized Performance**: Faster loading and smoother interactions

## 🔧 Configuration & Customization

The platform supports extensive customization:
- **Theme Modifications**: Easy color scheme updates via Tailwind
- **Question Bank Management**: Add/remove test questions and categories
- **Progression Logic**: Configurable unlock requirements
- **Admin Permissions**: Role-based access control
- **Branding Elements**: Logo, colors, and messaging customization

## 📈 Analytics & Reporting

- **Student Performance**: Individual and aggregate test results
- **Application Metrics**: Conversion rates and application status
- **System Usage**: Platform engagement and feature utilization
- **Export Capabilities**: Data export for external analysis

## 🌟 Future Roadmap

- **AI-Powered Matching**: Enhanced candidate-opportunity matching
- **Video Interviews**: Integrated video interview capabilities
- **Advanced Analytics**: Machine learning insights
- **Mobile App**: Native mobile application development
- **Integration APIs**: Third-party system integrations

## 🤝 Contributing

This is a proprietary project for YugaYatra Retail (OPC) Private Limited.

## 📞 Support & Contact

For technical support, feature requests, or business inquiries:
- **Development Team**: technical@yugayatra.com
- **Business Inquiries**: business@yugayatra.com
- **General Support**: support@yugayatra.com

## 📄 License

This project is proprietary to YugaYatra Retail (OPC) Private Limited. All rights reserved.

---

**🚀 Built with cutting-edge technology and ❤️ for YugaYatra Retail (OPC) Private Limited**

*Empowering MBA talent through innovative technology and comprehensive career development platforms.*
