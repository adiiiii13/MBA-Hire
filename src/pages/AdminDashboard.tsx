import React from 'react';
import { applicationStorage, adminAuth } from '../lib/storage';
import { Student } from '../types';
import { LogOut, Search, Download, Eye, Check, X, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

export function AdminDashboard() {
  const navigate = useNavigate();
  const [students, setStudents] = React.useState<Student[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState<string>('all');
  const [specializationFilter, setSpecializationFilter] = React.useState<string>('all');

  const fetchStudents = async () => {
    try {
      const applications = applicationStorage.getAll();
      // Sort by created_at descending
      const sortedApplications = applications.sort((a, b) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
      setStudents(sortedApplications);
    } catch (error) {
      console.error('Error fetching students:', error);
      toast.error('Failed to load applications');
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchStudents();
  }, []);

  const handleLogout = async () => {
    try {
      adminAuth.logout();
      navigate('/admin');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const updateStudentStatus = async (id: string, status: Student['status']) => {
    try {
      const updatedStudent = applicationStorage.update(id, { status });
      
      if (updatedStudent) {
        setStudents(prev => prev.map(s => s.id === id ? updatedStudent : s));
        toast.success(`Application ${status} successfully`);
      }
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update application status');
    }
  };

  const viewCandidateDetails = (student: Student) => {
    navigate(`/admin/candidate/${student.id}`);
  };

  const exportData = () => {
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
  };

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.college.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || student.status === statusFilter;
    const matchesSpecialization = specializationFilter === 'all' || student.specialization === specializationFilter;
    
    return matchesSearch && matchesStatus && matchesSpecialization;
  });

  const statusCounts = {
    total: students.length,
    pending: students.filter(s => s.status === 'pending').length,
    approved: students.filter(s => s.status === 'approved').length,
    shortlisted: students.filter(s => s.status === 'shortlisted').length,
    rejected: students.filter(s => s.status === 'rejected').length,
  };

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
            <div className="text-3xl font-bold text-amber-600">{statusCounts.total}</div>
            <div className="text-gray-700">Total Applications</div>
          </div>
          <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-lg shadow-lg p-6">
            <div className="text-3xl font-bold text-yellow-600">{statusCounts.pending}</div>
            <div className="text-gray-700">Pending Review</div>
          </div>
          <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-lg shadow-lg p-6">
            <div className="text-3xl font-bold text-orange-600">{statusCounts.shortlisted}</div>
            <div className="text-gray-700">Shortlisted</div>
          </div>
          <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-lg shadow-lg p-6">
            <div className="text-3xl font-bold text-green-600">{statusCounts.approved}</div>
            <div className="text-gray-700">Approved</div>
          </div>
          <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-lg shadow-lg p-6">
            <div className="text-3xl font-bold text-red-600">{statusCounts.rejected}</div>
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

            <button
              onClick={exportData}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-3 rounded-lg font-medium transition-colors flex items-center"
            >
              <Download className="h-5 w-5 mr-2" />
              Export
            </button>
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
