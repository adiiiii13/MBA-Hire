import express from 'express';
import { pool } from '../config/database';
import { authenticateToken, requireRole } from '../middleware/auth';
import { ApiResponse, ApplicationStats } from '../types';

const router = express.Router();

// Apply authentication middleware to all admin routes
router.use(authenticateToken);
router.use(requireRole(['admin', 'super_admin']));

// GET /api/admin/stats - Get dashboard statistics
router.get('/stats', async (req, res, next) => {
  try {
    // Get total applications count by status
    const statusQuery = `
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending,
        SUM(CASE WHEN status = 'approved' THEN 1 ELSE 0 END) as approved,
        SUM(CASE WHEN status = 'rejected' THEN 1 ELSE 0 END) as rejected,
        SUM(CASE WHEN status = 'shortlisted' THEN 1 ELSE 0 END) as shortlisted
      FROM applications
    `;

    const [statusResults] = await pool.execute(statusQuery);
    const statusStats = (statusResults as any[])[0];

    // Get applications by specialization
    const specializationQuery = `
      SELECT 
        specialization,
        COUNT(*) as count
      FROM applications
      GROUP BY specialization
      ORDER BY count DESC
    `;

    const [specializationResults] = await pool.execute(specializationQuery);

    // Get recent applications (last 7 days)
    const recentQuery = `
      SELECT COUNT(*) as recent_count
      FROM applications
      WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
    `;

    const [recentResults] = await pool.execute(recentQuery);
    const recentCount = (recentResults as any[])[0].recent_count;

    const stats: ApplicationStats = {
      total: statusStats.total || 0,
      pending: statusStats.pending || 0,
      approved: statusStats.approved || 0,
      rejected: statusStats.rejected || 0,
      shortlisted: statusStats.shortlisted || 0,
      bySpecialization: specializationResults as Array<{
        specialization: string;
        count: number;
      }>,
      recentApplications: recentCount || 0
    };

    const response: ApiResponse = {
      success: true,
      message: 'Dashboard statistics retrieved successfully',
      data: stats
    };

    res.json(response);
  } catch (error) {
    next(error);
  }
});

// GET /api/admin/applications/recent - Get recent applications
router.get('/applications/recent', async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit as string) || 10;

    const query = `
      SELECT 
        id, name, email, college, specialization, status, created_at
      FROM applications
      ORDER BY created_at DESC
      LIMIT ?
    `;

    const [applications] = await pool.execute(query, [limit]);

    const response: ApiResponse = {
      success: true,
      message: 'Recent applications retrieved successfully',
      data: applications
    };

    res.json(response);
  } catch (error) {
    next(error);
  }
});

// GET /api/admin/export - Export applications data
router.get('/export', async (req, res, next) => {
  try {
    const format = req.query.format as string || 'json';
    
    const query = `
      SELECT 
        id, name, email, phone, college, specialization,
        graduation_year, cgpa, skills, experience, motivation,
        ai_prediction, status, created_at
      FROM applications
      ORDER BY created_at DESC
    `;

    const [applications] = await pool.execute(query);
    const processedApplications = (applications as any[]).map(app => ({
      ...app,
      skills: app.skills ? JSON.parse(app.skills) : []
    }));

    if (format === 'csv') {
      // Convert to CSV format
      const headers = [
        'ID', 'Name', 'Email', 'Phone', 'College', 'Specialization',
        'Graduation Year', 'CGPA', 'Skills', 'Experience', 'Motivation',
        'AI Prediction', 'Status', 'Created At'
      ];

      const csvRows = [
        headers.join(','),
        ...processedApplications.map(app => [
          app.id,
          `"${app.name}"`,
          app.email,
          app.phone || '',
          `"${app.college}"`,
          app.specialization,
          app.graduation_year,
          app.cgpa,
          `"${Array.isArray(app.skills) ? app.skills.join('; ') : app.skills}"`,
          `"${(app.experience || '').replace(/"/g, '""')}"`,
          `"${(app.motivation || '').replace(/"/g, '""')}"`,
          `"${app.ai_prediction || ''}"`,
          app.status,
          app.created_at
        ].join(','))
      ];

      const csv = csvRows.join('\n');
      
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=applications.csv');
      res.send(csv);
    } else {
      // Return JSON format
      const response: ApiResponse = {
        success: true,
        message: 'Applications exported successfully',
        data: processedApplications
      };

      res.json(response);
    }
  } catch (error) {
    next(error);
  }
});

// PUT /api/admin/applications/:id/status - Update application status
router.put('/applications/:id/status', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, ai_prediction } = req.body;

    // Validate status
    const validStatuses = ['pending', 'approved', 'rejected', 'shortlisted'];
    if (!validStatuses.includes(status)) {
      const response: ApiResponse = {
        success: false,
        message: 'Invalid status value',
        error: 'INVALID_STATUS'
      };
      return res.status(400).json(response);
    }

    // Check if application exists
    const checkQuery = 'SELECT id FROM applications WHERE id = ?';
    const [existing] = await pool.execute(checkQuery, [id]);
    
    if ((existing as any[]).length === 0) {
      const response: ApiResponse = {
        success: false,
        message: 'Application not found',
        error: 'NOT_FOUND'
      };
      return res.status(404).json(response);
    }

    // Update application
    const updateQuery = `
      UPDATE applications 
      SET status = ?, ai_prediction = ?, updated_at = CURRENT_TIMESTAMP 
      WHERE id = ?
    `;
    
    await pool.execute(updateQuery, [status, ai_prediction || null, id]);

    const response: ApiResponse = {
      success: true,
      message: `Application ${status} successfully`,
      data: { id, status, ai_prediction }
    };

    res.json(response);
  } catch (error) {
    next(error);
  }
});

// DELETE /api/admin/applications/:id - Delete application
router.delete('/applications/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    // Check if application exists
    const checkQuery = 'SELECT id, resume_url FROM applications WHERE id = ?';
    const [existing] = await pool.execute(checkQuery, [id]);
    const applications = existing as any[];
    
    if (applications.length === 0) {
      const response: ApiResponse = {
        success: false,
        message: 'Application not found',
        error: 'NOT_FOUND'
      };
      return res.status(404).json(response);
    }

    // Delete application
    const deleteQuery = 'DELETE FROM applications WHERE id = ?';
    await pool.execute(deleteQuery, [id]);

    const response: ApiResponse = {
      success: true,
      message: 'Application deleted successfully'
    };

    res.json(response);
  } catch (error) {
    next(error);
  }
});

// GET /api/admin/applications/analytics - Get detailed analytics
router.get('/applications/analytics', async (req, res, next) => {
  try {
    // Applications by month (last 12 months)
    const monthlyQuery = `
      SELECT 
        DATE_FORMAT(created_at, '%Y-%m') as month,
        COUNT(*) as count
      FROM applications
      WHERE created_at >= DATE_SUB(NOW(), INTERVAL 12 MONTH)
      GROUP BY DATE_FORMAT(created_at, '%Y-%m')
      ORDER BY month
    `;

    const [monthlyResults] = await pool.execute(monthlyQuery);

    // Applications by college (top 10)
    const collegeQuery = `
      SELECT 
        college,
        COUNT(*) as count
      FROM applications
      GROUP BY college
      ORDER BY count DESC
      LIMIT 10
    `;

    const [collegeResults] = await pool.execute(collegeQuery);

    // Average CGPA by specialization
    const cgpaQuery = `
      SELECT 
        specialization,
        ROUND(AVG(cgpa), 2) as avg_cgpa,
        COUNT(*) as count
      FROM applications
      WHERE cgpa > 0
      GROUP BY specialization
      ORDER BY avg_cgpa DESC
    `;

    const [cgpaResults] = await pool.execute(cgpaQuery);

    // Status distribution by specialization
    const statusSpecQuery = `
      SELECT 
        specialization,
        status,
        COUNT(*) as count
      FROM applications
      GROUP BY specialization, status
      ORDER BY specialization, status
    `;

    const [statusSpecResults] = await pool.execute(statusSpecQuery);

    const analytics = {
      monthlyApplications: monthlyResults,
      topColleges: collegeResults,
      cgpaBySpecialization: cgpaResults,
      statusBySpecialization: statusSpecResults
    };

    const response: ApiResponse = {
      success: true,
      message: 'Analytics data retrieved successfully',
      data: analytics
    };

    res.json(response);
  } catch (error) {
    next(error);
  }
});

export default router;
