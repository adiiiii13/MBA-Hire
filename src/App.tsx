import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { HomePage } from './pages/HomePage';
import { ApplicationForm } from './pages/ApplicationForm';
import { SuccessPage } from './pages/SuccessPage';
import { AdminLogin } from './pages/AdminLogin';
import { AdminDashboard } from './pages/AdminDashboard';
import { CandidateDetails } from './pages/CandidateDetails';
import { ProtectedRoute } from './components/ProtectedRoute';

function AppContent() {
  const location = useLocation();
  // Hide header only for admin dashboard and candidate details, but show for admin login
  const hideHeaderAndFooter = location.pathname === '/admin/dashboard' || location.pathname.startsWith('/admin/candidate');

  return (
    <div className="min-h-screen bg-white">
      {!hideHeaderAndFooter && <Header />}
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/apply" element={<ApplicationForm />} />
          <Route path="/success" element={<SuccessPage />} />
          <Route path="/admin" element={<AdminLogin />} />
          <Route 
            path="/admin/dashboard" 
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/candidate/:id" 
            element={
              <ProtectedRoute>
                <CandidateDetails />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </main>
      {!hideHeaderAndFooter && <Footer />}
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#fff',
            color: '#374151',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
          },
        }}
      />
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;