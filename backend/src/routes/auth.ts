import express from 'express';
import bcrypt from 'bcryptjs';
import jwt, { SignOptions } from 'jsonwebtoken';
import { pool } from '../config/database';
import { validate } from '../validation/schemas';
import { loginSchema } from '../validation/schemas';
import { ApiResponse, AdminData, JwtPayload } from '../types';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

// POST /api/auth/login - Admin login
router.post('/login', validate(loginSchema), async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Find admin by email
    const [adminRows] = await pool.execute(
      'SELECT id, email, password, name, role FROM admins WHERE email = ?',
      [email]
    );

    const admins = adminRows as AdminData[];
    if (admins.length === 0) {
      const response: ApiResponse = {
        success: false,
        message: 'Invalid credentials',
        error: 'INVALID_CREDENTIALS'
      };
      return res.status(401).json(response);
    }

    const admin = admins[0];

    // Verify password
    const isValidPassword = await bcrypt.compare(password, admin.password!);
    if (!isValidPassword) {
      const response: ApiResponse = {
        success: false,
        message: 'Invalid credentials',
        error: 'INVALID_CREDENTIALS'
      };
      return res.status(401).json(response);
    }

    // Generate JWT token
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new Error('JWT_SECRET not configured');
    }

    const payload: JwtPayload = {
      id: admin.id!,
      email: admin.email,
      role: admin.role
    };

    const token = jwt.sign(
      payload, 
      jwtSecret, 
      { expiresIn: process.env.JWT_EXPIRES_IN || '24h' } as SignOptions
    );

    // Remove password from response
    const { password: _, ...adminWithoutPassword } = admin;

    const response: ApiResponse = {
      success: true,
      message: 'Login successful',
      data: {
        token,
        admin: adminWithoutPassword
      }
    };

    res.json(response);
  } catch (error) {
    next(error);
  }
});

// POST /api/auth/logout - Admin logout
router.post('/logout', authenticateToken, async (req, res) => {
  // In a real implementation, you might want to blacklist the token
  // For now, we'll just send a success response
  const response: ApiResponse = {
    success: true,
    message: 'Logout successful'
  };

  res.json(response);
});

// GET /api/auth/me - Get current admin info
router.get('/me', authenticateToken, async (req: any, res, next) => {
  try {
    const adminId = req.user.id;

    const [adminRows] = await pool.execute(
      'SELECT id, email, name, role, created_at FROM admins WHERE id = ?',
      [adminId]
    );

    const admins = adminRows as AdminData[];
    if (admins.length === 0) {
      const response: ApiResponse = {
        success: false,
        message: 'Admin not found',
        error: 'NOT_FOUND'
      };
      return res.status(404).json(response);
    }

    const response: ApiResponse = {
      success: true,
      message: 'Admin details retrieved',
      data: admins[0]
    };

    res.json(response);
  } catch (error) {
    next(error);
  }
});

// POST /api/auth/refresh - Refresh JWT token
router.post('/refresh', authenticateToken, async (req: any, res, next) => {
  try {
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new Error('JWT_SECRET not configured');
    }

    const payload: JwtPayload = {
      id: req.user.id,
      email: req.user.email,
      role: req.user.role
    };

    const token = jwt.sign(
      payload, 
      jwtSecret, 
      { expiresIn: process.env.JWT_EXPIRES_IN || '24h' } as SignOptions
    );

    const response: ApiResponse = {
      success: true,
      message: 'Token refreshed successfully',
      data: { token }
    };

    res.json(response);
  } catch (error) {
    next(error);
  }
});

export default router;
