# YugaYatra MBA Talent Platform

A comprehensive MBA talent platform connecting top business students with YugaYatra Retail (OPC) Private Limited for internship and career opportunities.

## 🚀 Features

### 🎯 For Students
- **Single-page application** with smooth scrolling navigation
- **Internship opportunities** showcase with filtering by specialization
- **Application form** with comprehensive validation
- **Mobile-responsive** design for all devices
- **Success tracking** for application submissions

### 👨‍💼 For Administrators
- **Admin dashboard** with candidate management
- **Candidate details** page with comprehensive profile view
- **Application status** management (pending, shortlisted, approved, rejected)
- **Resume viewing** and download capabilities (UI ready)
- **Export functionality** for application data
- **Protected routes** with authentication

## 🎨 Design
- **Golden theme** throughout the application for premium feel
- **YugaYatra branding** with consistent visual identity
- **Responsive typography** and spacing
- **Gradient backgrounds** with yellowish effects
- **Professional UI** components with Tailwind CSS

## 🛠️ Technology Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM
- **Forms**: React Hook Form + Zod validation
- **Icons**: Lucide React
- **Notifications**: React Hot Toast
- **Date Handling**: date-fns
- **Storage**: Local Storage (browser-based)

## 📁 Project Structure

```
src/
├── components/
│   ├── layout/
│   │   ├── Header.tsx          # Navigation with smooth scrolling
│   │   └── Footer.tsx          # Footer with contact information
│   └── ProtectedRoute.tsx      # Route protection for admin
├── pages/
│   ├── HomePage.tsx            # Main single-page with all sections
│   ├── ApplicationForm.tsx     # Student application form
│   ├── SuccessPage.tsx         # Application confirmation
│   ├── AdminLogin.tsx          # Admin authentication
│   ├── AdminDashboard.tsx      # Admin candidate management
│   └── CandidateDetails.tsx    # Detailed candidate view
├── lib/
│   └── storage.ts              # Local storage utilities
├── types/
│   └── index.ts                # TypeScript type definitions
└── App.tsx                     # Main application component
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/adiiiii13/MBA-Hire.git
   cd MBA-Hire
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env file with your actual values
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

### Build for Production
```bash
npm run build
npm run preview
```

## 🔐 Admin Access

Default admin credentials:
- **Email**: admin@mbatalent.com
- **Password**: admin123

## 📱 Navigation

The application uses smooth scrolling navigation:
- **Home** → Hero section
- **About** → Company information
- **Services** → Our services showcase
- **Internships** → Available opportunities
- **Contact** → Contact form and information

## 🎯 Key Pages

### Student Journey
1. **Homepage** - Learn about opportunities
2. **Application Form** - Submit application
3. **Success Page** - Confirmation and next steps

### Admin Journey
1. **Admin Login** - Secure authentication
2. **Admin Dashboard** - View all applications
3. **Candidate Details** - Comprehensive candidate profile

## 📊 Features Overview

### Application Management
- Real-time application tracking
- Status management (pending, shortlisted, approved, rejected)
- Export capabilities for data analysis
- Search and filter functionality

### User Experience
- Mobile-first responsive design
- Smooth animations and transitions
- Intuitive navigation
- Professional branding

### Security
- Protected admin routes
- Input validation and sanitization
- Environment variable configuration
- No hardcoded secrets

## 🌟 Customization

The application is built with customization in mind:
- Easy theme modifications via Tailwind CSS
- Configurable navigation sections
- Modular component architecture
- Type-safe development

## 📄 License

This project is proprietary to YugaYatra Retail (OPC) Private Limited.

## 🤝 Contributing

This is a private project for YugaYatra Retail (OPC) Private Limited.

## 📞 Support

For technical support or questions, please contact the development team.

---

**Built with ❤️ for YugaYatra Retail (OPC) Private Limited**
