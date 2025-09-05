import React from 'react';
import { applicationService, authService, adminService, type Student } from '../lib/api';
import { LogOut, Search, Download, Eye, Check, X, Star, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

export function AdminDashboard() {
  const navigate = useNavigate();
  const [students, setStudents] = React.useState<Student[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [refreshing, setRefreshing] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState<string>('all');
  const [specializationFilter, setSpecializationFilter] = React.useState<string>('all');
  const [stats, setStats] = React.useState({
    total: 0,
    pending: 0,
    approved: 0,
    shortlisted: 0,
    rejected: 0
  });

  const fetchStudents = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      
      // Build filters for API call
      const filters: any = {};
      if (statusFilter !== 'all') filters.status = statusFilter;
      if (specializationFilter !== 'all') filters.specialization = specializationFilter;
      if (searchTerm) filters.search = searchTerm;
      
      const applications = await applicationService.getAll(filters);
      setStudents(applications);
      
      // Calculate stats
      const total = applications.length;
      const pending = applications.filter(s => s.status === 'pending').length;
      const approved = applications.filter(s => s.status === 'approved').length;
      const shortlisted = applications.filter(s => s.status === 'shortlisted').length;
      const rejected = applications.filter(s => s.status === 'rejected').length;
      
      setStats({ total, pending, approved, shortlisted, rejected });
      
      if (isRefresh) {
        toast.success('Dashboard refreshed successfully!');
      }
    } catch (error) {
      console.error('Error fetching students:', error);
      toast.error('Failed to load applications');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Handle refresh button click
  const handleRefresh = () => {
    fetchStudents(true);
  };

  // Debounce search to avoid too many API calls
  React.useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchStudents();
    }, 300); // 300ms delay

    return () => clearTimeout(timeoutId);
  }, [statusFilter, specializationFilter, searchTerm]);

  const handleLogout = async () => {
    try {
      await authService.logout();
      navigate('/admin');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Logout failed');
    }
  };

  const updateStudentStatus = async (id: string, status: Student['status']) => {
    try {
      const success = await applicationService.updateStatus(id, status);
      
      if (success) {
        setStudents(prev => prev.map(s => s.id === id ? { ...s, status } : s));
        toast.success(`Application ${status} successfully`);
        
        // Update stats
        const updatedApplications = students.map(s => s.id === id ? { ...s, status } : s);
        const total = updatedApplications.length;
        const pending = updatedApplications.filter(s => s.status === 'pending').length;
        const approved = updatedApplications.filter(s => s.status === 'approved').length;
        const shortlisted = updatedApplications.filter(s => s.status === 'shortlisted').length;
        const rejected = updatedApplications.filter(s => s.status === 'rejected').length;
        setStats({ total, pending, approved, shortlisted, rejected });
      } else {
        toast.error('Failed to update application status');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update application status');
    }
  };

  const viewCandidateDetails = (student: Student) => {
    navigate(`/admin/candidate/${student.id}`);
  };

  const exportData = async () => {
    try {
      const csvContent = "data:text/csv;charset=utf-8,"
        + "Name,Email,College,Specialization,Status,Applied Date\n"
        + students.map(s => 
            `${s.name},${s.email},${s.college},${s.specialization},${s.status},${format(new Date(s.created_at), 'yyyy-MM-dd')}`
          ).join("\n");
      
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", "mba_applications.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success('Data exported successfully');
    } catch (error) {
      console.error('Export failed:', error);
      toast.error('Failed to export data');
    }
  };

  // Use students directly since filtering is now done on the backend
  const filteredStudents = students;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-100 via-amber-50 to-yellow-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-100 via-amber-50 to-yellow-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-600 to-orange-700 shadow-lg border-b border-amber-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold text-white">YugaYatra Admin Dashboard</h1>
            <button
              onClick={handleLogout}
              className="flex items-center text-amber-100 hover:text-white transition-colors"
            >
              <LogOut className="h-5 w-5 mr-2" />
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-lg shadow-lg p-6">
            <div className="text-3xl font-bold text-amber-600">{stats.total}</div>
            <div className="text-gray-700">Total Applications</div>
          </div>
          <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-lg shadow-lg p-6">
            <div className="text-3xl font-bold text-yellow-600">{stats.pending}</div>
            <div className="text-gray-700">Pending Review</div>
          </div>
          <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-lg shadow-lg p-6">
            <div className="text-3xl font-bold text-orange-600">{stats.shortlisted}</div>
            <div className="text-gray-700">Shortlisted</div>
          </div>
          <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-lg shadow-lg p-6">
            <div className="text-3xl font-bold text-green-600">{stats.approved}</div>
            <div className="text-gray-700">Approved</div>
          </div>
          <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-lg shadow-lg p-6">
            <div className="text-3xl font-bold text-red-600">{stats.rejected}</div>
            <div className="text-gray-700">Rejected</div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-lg shadow-lg p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search students..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="shortlisted">Shortlisted</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>

            <select
              value={specializationFilter}
              onChange={(e) => setSpecializationFilter(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
            >
              <option value="all">All Specializations</option>
              <option value="Finance">Finance</option>
              <option value="Marketing">Marketing</option>
              <option value="Human Resources">Human Resources</option>
              <option value="Operations">Operations</option>
              <option value="Strategy & Consulting">Strategy & Consulting</option>
            </select>

            <div className="flex space-x-2">
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className={`px-4 py-3 rounded-lg font-medium transition-all duration-200 flex items-center ${
                  refreshing 
                    ? 'bg-gray-400 cursor-not-allowed text-white' 
                    : 'bg-blue-600 hover:bg-blue-700 text-white hover:shadow-md'
                }`}
                title="Refresh dashboard data"
              >
                <RefreshCw className={`h-5 w-5 mr-2 ${
                  refreshing ? 'animate-spin' : ''
                }`} />
                {refreshing ? 'Refreshing...' : 'Refresh'}
              </button>
              
              <button
                onClick={exportData}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-3 rounded-lg font-medium transition-colors flex items-center"
                title="Export applications to CSV"
              >
                <Download className="h-5 w-5 mr-2" />
                Export
              </button>
            </div>
          </div>
        </div>

        {/* Applications Table */}
        <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-lg shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gradient-to-r from-amber-600 to-orange-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Candidate
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    College & Specialization
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    CGPA
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    AI Score
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Applied Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredStudents.map((student) => (
                  <tr key={student.id} className="hover:bg-amber-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div 
                          className="text-sm font-medium text-blue-600 hover:text-blue-800 cursor-pointer hover:underline transition-colors"
                          onClick={() => viewCandidateDetails(student)}
                        >
                          {student.name}
                        </div>
                        <div className="text-sm text-gray-500">{student.email}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{student.college}</div>
                      <div className="text-sm text-gray-500">{student.specialization}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{student.cgpa || 'N/A'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {student.ai_score ? (
                          <div className="flex items-center">
                            <div className={`text-sm font-semibold ${
                              student.ai_score >= 80 ? 'text-green-600' :
                              student.ai_score >= 60 ? 'text-orange-600' :
                              'text-red-600'
                            }`}>
                              {student.ai_score}/100
                            </div>
                            <div className={`ml-2 w-2 h-2 rounded-full ${
                              student.ai_analysis_status === 'completed' ? 'bg-green-500' :
                              student.ai_analysis_status === 'processing' ? 'bg-yellow-500 animate-pulse' :
                              student.ai_analysis_status === 'failed' ? 'bg-red-500' :
                              'bg-gray-400'
                            }`} title={`Analysis ${student.ai_analysis_status || 'pending'}`}></div>
                          </div>
                        ) : (
                          <div className="flex items-center text-sm text-gray-500">
                            <span>Analyzing...</span>
                            <div className="ml-2 w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        student.status === 'approved' ? 'bg-green-100 text-green-800' :
                        student.status === 'rejected' ? 'bg-red-100 text-red-800' :
                        student.status === 'shortlisted' ? 'bg-orange-100 text-orange-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {student.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {format(new Date(student.created_at), 'MMM dd, yyyy')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => viewCandidateDetails(student)}
                          className="text-blue-600 hover:text-blue-800 transition-colors"
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => updateStudentStatus(student.id, 'shortlisted')}
                          className="text-orange-600 hover:text-orange-800 transition-colors"
                          title="Shortlist"
                        >
                          <Star className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => updateStudentStatus(student.id, 'approved')}
                          className="text-green-600 hover:text-green-800 transition-colors"
                          title="Approve"
                        >
                          <Check className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => updateStudentStatus(student.id, 'rejected')}
                          className="text-red-600 hover:text-red-800 transition-colors"
                          title="Reject"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredStudents.length === 0 && (
            <div className="text-center py-12">
              <Eye className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No applications found matching your criteria.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
