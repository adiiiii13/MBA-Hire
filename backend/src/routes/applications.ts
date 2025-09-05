import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { pool } from '../config/database';
import { 
  validate, 
  validateQuery, 
  validateParams,
  applicationSchema,
  queryFiltersSchema,
  idParamSchema 
} from '../validation/schemas';
import { 
  ApiResponse, 
  ApplicationData, 
  QueryFilters,
  ApplicationFileData 
} from '../types';
import { 
  uploadSingle, 
  handleUploadError, 
  getFileInfo, 
  deleteFile 
} from '../middleware/upload';

const router = express.Router();

// POST /api/applications - Create new application
router.post('/', 
  uploadSingle,
  handleUploadError,
  validate(applicationSchema), 
  async (req, res, next) => {
    try {
      const applicationData = req.body;
      const file = req.file;
      
      // Generate unique ID
      const applicationId = uuidv4();
      
      // Process skills (convert from string to JSON array for storage)
      const skills = applicationData.skills
        .split(',')
        .map((skill: string) => skill.trim())
        .filter((skill: string) => skill.length > 0);

      // Prepare application data
      const application: ApplicationData = {
        id: applicationId,
        name: applicationData.name,
        email: applicationData.email,
        phone: applicationData.phone || null,
        location: applicationData.location || null, // Add location field
        college: applicationData.college,
        specialization: applicationData.specialization,
        graduation_year: parseInt(applicationData.graduation_year),
        cgpa: parseFloat(applicationData.cgpa),
        skills: JSON.stringify(skills),
        experience: applicationData.experience,
        motivation: applicationData.motivation || null,
        resume_url: file ? `/uploads/${file.filename}` : null,
        status: 'pending'
      };

      // Insert into database
      const query = `
        INSERT INTO applications (
          id, name, email, phone, location, college, specialization, 
          graduation_year, cgpa, skills, experience, motivation, 
          resume_url, status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      const values = [
        application.id,
        application.name,
        application.email,
        application.phone,
        application.location,
        application.college,
        application.specialization,
        application.graduation_year,
        application.cgpa,
        application.skills,
        application.experience,
        application.motivation,
        application.resume_url,
        application.status
      ];

      await pool.execute(query, values);

      // If file was uploaded, save file info
      if (file) {
        const fileInfo = getFileInfo(file);
        const fileQuery = `
          INSERT INTO application_files (
            application_id, file_name, file_path, file_type, file_size
          ) VALUES (?, ?, ?, ?, ?)
        `;
        
        await pool.execute(fileQuery, [
          applicationId,
          fileInfo.originalname,
          fileInfo.path,
          fileInfo.mimetype,
          fileInfo.size
        ]);
      }

      // Return created application (without sensitive data)
      const response: ApiResponse = {
        success: true,
        message: 'Application submitted successfully',
        data: {
          id: applicationId,
          name: application.name,
          email: application.email,
          status: application.status
        }
      };

      res.status(201).json(response);
    } catch (error) {
      // If there was an error and a file was uploaded, clean it up
      if (req.file) {
        try {
          await deleteFile(req.file.path);
        } catch (deleteError) {
          console.error('Error deleting uploaded file:', deleteError);
        }
      }
      next(error);
    }
  }
);

// GET /api/applications - Get all applications with filters and pagination
router.get('/', validateQuery(queryFiltersSchema), async (req, res, next) => {
  try {
    const filters: QueryFilters = req.query;
    const page = filters.page || 1;
    const limit = filters.limit || 10;
    const offset = (page - 1) * limit;

    // Build WHERE clause
    let whereConditions: string[] = [];
    let queryParams: any[] = [];

    if (filters.status) {
      whereConditions.push('status = ?');
      queryParams.push(filters.status);
    }

    if (filters.specialization) {
      whereConditions.push('specialization = ?');
      queryParams.push(filters.specialization);
    }

    if (filters.search) {
      whereConditions.push('(name LIKE ? OR email LIKE ? OR college LIKE ?)');
      const searchTerm = `%${filters.search}%`;
      queryParams.push(searchTerm, searchTerm, searchTerm);
    }

    const whereClause = whereConditions.length > 0 ? 
      `WHERE ${whereConditions.join(' AND ')}` : '';

    // Build ORDER BY clause
    const sortBy = filters.sortBy || 'created_at';
    const sortOrder = filters.sortOrder || 'desc';
    const orderClause = `ORDER BY ${sortBy} ${sortOrder.toUpperCase()}`;

    // Get total count
    const countQuery = `
      SELECT COUNT(*) as total 
      FROM applications 
      ${whereClause}
    `;
    const [countResult] = await pool.execute(countQuery, queryParams);
    const total = (countResult as any)[0].total;

    // Get applications
    const applicationsQuery = `
      SELECT 
        id, name, email, phone, location, college, specialization,
        graduation_year, cgpa, skills, experience, motivation,
        resume_url, ai_prediction, status, created_at, updated_at
      FROM applications 
      ${whereClause}
      ${orderClause}
      LIMIT ? OFFSET ?
    `;
    
    queryParams.push(limit, offset);
    const [applications] = await pool.execute(applicationsQuery, queryParams);

    // Process applications (parse skills JSON)
    const processedApplications = (applications as ApplicationData[]).map(app => ({
      ...app,
      skills: app.skills ? JSON.parse(app.skills as string) : []
    }));

    const totalPages = Math.ceil(total / limit);

    const response: ApiResponse = {
      success: true,
      message: 'Applications retrieved successfully',
      data: processedApplications,
      pagination: {
        page,
        limit,
        total,
        totalPages
      }
    };

    res.json(response);
  } catch (error) {
    next(error);
  }
});

// GET /api/applications/:id - Get single application by ID
router.get('/:id', validateParams(idParamSchema), async (req, res, next) => {
  try {
    const { id } = req.params;

    const query = `
      SELECT 
        id, name, email, phone, location, college, specialization,
        graduation_year, cgpa, skills, experience, motivation,
        resume_url, ai_prediction, status, created_at, updated_at
      FROM applications 
      WHERE id = ?
    `;

    const [applications] = await pool.execute(query, [id]);
    const applicationsArray = applications as ApplicationData[];

    if (applicationsArray.length === 0) {
      const response: ApiResponse = {
        success: false,
        message: 'Application not found',
        error: 'NOT_FOUND'
      };
      return res.status(404).json(response);
    }

    const application = applicationsArray[0];
    
    // Parse skills JSON
    application.skills = application.skills ? JSON.parse(application.skills as string) : [];

    // Get file info if exists
    let fileInfo = null;
    if (application.resume_url) {
      const fileQuery = `
        SELECT file_name, file_type, file_size, uploaded_at 
        FROM application_files 
        WHERE application_id = ?
      `;
      const [files] = await pool.execute(fileQuery, [id]);
      const filesArray = files as ApplicationFileData[];
      if (filesArray.length > 0) {
        fileInfo = filesArray[0];
      }
    }

    const response: ApiResponse = {
      success: true,
      message: 'Application retrieved successfully',
      data: {
        ...application,
        file_info: fileInfo
      }
    };

    res.json(response);
  } catch (error) {
    next(error);
  }
});

// PUT /api/applications/:id/status - Update application status (Admin only)
router.put('/:id/status', validateParams(idParamSchema), async (req, res, next) => {
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

// DELETE /api/applications/:id - Delete application (Admin only)
router.delete('/:id', validateParams(idParamSchema), async (req, res, next) => {
  try {
    const { id } = req.params;

    // Get application info first
    const getQuery = 'SELECT resume_url FROM applications WHERE id = ?';
    const [applications] = await pool.execute(getQuery, [id]);
    const applicationsArray = applications as ApplicationData[];

    if (applicationsArray.length === 0) {
      const response: ApiResponse = {
        success: false,
        message: 'Application not found',
        error: 'NOT_FOUND'
      };
      return res.status(404).json(response);
    }

    const application = applicationsArray[0];

    // Delete from database (files will be deleted by CASCADE)
    const deleteQuery = 'DELETE FROM applications WHERE id = ?';
    await pool.execute(deleteQuery, [id]);

    // Delete uploaded file if exists
    if (application.resume_url) {
      const filePath = `./uploads/${application.resume_url.split('/').pop()}`;
      try {
        await deleteFile(filePath);
      } catch (fileError) {
        console.error('Error deleting file:', fileError);
        // Continue even if file deletion fails
      }
    }

    const response: ApiResponse = {
      success: true,
      message: 'Application deleted successfully'
    };

    res.json(response);
  } catch (error) {
    next(error);
  }
});

export default router;
