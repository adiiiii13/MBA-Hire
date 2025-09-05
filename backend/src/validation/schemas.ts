import Joi from 'joi';

export const applicationSchema = Joi.object({
  name: Joi.string().min(2).max(255).required().messages({
    'string.min': 'Name must be at least 2 characters long',
    'string.max': 'Name must be less than 255 characters',
    'any.required': 'Name is required'
  }),
  
  email: Joi.string().email().max(255).required().messages({
    'string.email': 'Please provide a valid email address',
    'any.required': 'Email is required'
  }),
  
  phone: Joi.string().min(10).max(20).required().messages({
    'string.min': 'Phone number must be at least 10 characters long',
    'string.max': 'Phone number must be less than 20 characters',
    'any.required': 'Phone number is required'
  }),
  
  location: Joi.string().min(2).max(255).required().messages({
    'string.min': 'Location must be at least 2 characters long',
    'string.max': 'Location must be less than 255 characters',
    'any.required': 'Location is required'
  }),
  
  college: Joi.string().min(2).max(255).required().messages({
    'string.min': 'College name must be at least 2 characters long',
    'any.required': 'College name is required'
  }),
  
  specialization: Joi.string().valid(
    'Finance',
    'Marketing',
    'Human Resources',
    'Operations',
    'Strategy & Consulting',
    'Data Analytics',
    'Digital Marketing',
    'Supply Chain',
    'Entrepreneurship',
    'International Business'
  ).required().messages({
    'any.only': 'Please select a valid specialization',
    'any.required': 'Specialization is required'
  }),
  
  graduation_year: Joi.number().integer().min(2013).max(2030).required().messages({
    'number.min': 'Graduation year must be 2013 or later',
    'number.max': 'Graduation year must be 2030 or earlier',
    'any.required': 'Graduation year is required'
  }),
  
  cgpa: Joi.number().min(0).max(10).precision(2).required().messages({
    'number.min': 'CGPA must be 0 or higher',
    'number.max': 'CGPA must be 10 or lower',
    'any.required': 'CGPA is required'
  }),
  
  skills: Joi.string().min(10).max(1000).required().messages({
    'string.min': 'Please describe your skills (at least 10 characters)',
    'string.max': 'Skills description must be less than 1000 characters',
    'any.required': 'Skills description is required'
  }),
  
  experience: Joi.string().min(20).max(2000).required().messages({
    'string.min': 'Please describe your experience (at least 20 characters)',
    'string.max': 'Experience description must be less than 2000 characters',
    'any.required': 'Experience description is required'
  }),
  
  motivation: Joi.string().max(1000).optional().allow('')
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Please provide a valid email address',
    'any.required': 'Email is required'
  }),
  
  password: Joi.string().min(6).required().messages({
    'string.min': 'Password must be at least 6 characters long',
    'any.required': 'Password is required'
  })
});

export const updateStatusSchema = Joi.object({
  status: Joi.string().valid('pending', 'approved', 'rejected', 'shortlisted').required().messages({
    'any.only': 'Status must be one of: pending, approved, rejected, shortlisted',
    'any.required': 'Status is required'
  }),
  
  ai_prediction: Joi.string().max(255).optional().allow('')
});

export const queryFiltersSchema = Joi.object({
  status: Joi.string().valid('pending', 'approved', 'rejected', 'shortlisted').optional(),
  specialization: Joi.string().valid(
    'Finance',
    'Marketing',
    'Human Resources',
    'Operations',
    'Strategy & Consulting',
    'Data Analytics',
    'Digital Marketing',
    'Supply Chain',
    'Entrepreneurship',
    'International Business'
  ).optional(),
  search: Joi.string().max(255).optional(),
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
  sortBy: Joi.string().valid('name', 'email', 'created_at', 'cgpa', 'status').default('created_at'),
  sortOrder: Joi.string().valid('asc', 'desc').default('desc')
});

export const idParamSchema = Joi.object({
  id: Joi.string().required().messages({
    'any.required': 'ID parameter is required'
  })
});

// Validation middleware
export const validate = (schema: Joi.ObjectSchema) => {
  return (req: any, res: any, next: any) => {
    const { error } = schema.validate(req.body);
    
    if (error) {
      const validationError = new Error(error.details[0].message);
      validationError.name = 'ValidationError';
      return next(validationError);
    }
    
    next();
  };
};

export const validateQuery = (schema: Joi.ObjectSchema) => {
  return (req: any, res: any, next: any) => {
    const { error, value } = schema.validate(req.query);
    
    if (error) {
      const validationError = new Error(error.details[0].message);
      validationError.name = 'ValidationError';
      return next(validationError);
    }
    
    req.query = value;
    next();
  };
};

export const validateParams = (schema: Joi.ObjectSchema) => {
  return (req: any, res: any, next: any) => {
    const { error } = schema.validate(req.params);
    
    if (error) {
      const validationError = new Error(error.details[0].message);
      validationError.name = 'ValidationError';
      return next(validationError);
    }
    
    next();
  };
};
