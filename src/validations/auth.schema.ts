import Joi from 'joi';

const passwordRegex =
  /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,}$/;

const register = Joi.object({
  name: Joi.string().min(3).required().messages({
    'string.base': 'Name must be a string',
    'string.empty': 'Name cannot be empty',
    'string.min': 'Name should have a minimum length of {#limit}',
    'any.required': 'Name is required'
  }),
  email: Joi.string().email().required().messages({
    'string.base': 'Email must be a string',
    'string.empty': 'Email cannot be empty',
    'string.email': 'Email must be a valid email'
  }),
  password: Joi.string().pattern(passwordRegex).required().messages({
    'string.pattern.base':
      'Password must have at least one uppercase letter, one special character and one number'
  }),
  username: Joi.string().min(3).required().messages({
    'string.base': 'Username must be a string',
    'string.empty': 'Username cannot be empty',
    'string.min': 'Username should have a minimum length of {#limit}',
    'any.required': 'Username is required'
  }),
  phone: Joi.string().required().messages({
    'string.base': 'Phone must be a string',
    'string.empty': 'Phone cannot be empty',
    'any.required': 'Phone is required'
  }),
  role: Joi.string().valid('user', 'vendor').required().messages({
    'any.only': 'Role must be either user or vendor'
  })
});

const requestEmailToken = Joi.object({
  email: Joi.string().email().required().messages({
    'string.base': 'Email must be a string',
    'string.empty': 'Email cannot be empty',
    'string.email': 'Email must be a valid email'
  })
});

const verifyEmailToken = Joi.object({
  email: Joi.string().email().required().messages({
    'string.base': 'Email must be a string',
    'string.empty': 'Email cannot be empty',
    'string.email': 'Email must be a valid email'
  }),
  emailVerificationToken: Joi.number()
    .positive()
    .integer()
    .required()
    .messages({
      'number.base': 'Email verification token must be a number',
      'number.positive': 'Email verification token must be a positive number',
      'number.integer': 'Email verification token must be an integer',
      'number.min': 'Email verification token must be at least 100000',
      'number.max': 'Email verification token must be at most 999999',
      'any.required': 'Email verification token is required'
    })
});

const login = Joi.object({
  email: Joi.string().email().required().messages({
    'string.base': 'Email must be a string',
    'string.empty': 'Email cannot be empty',
    'string.email': 'Email must be a valid email'
  }),
  password: Joi.string().min(6).required().messages({
    'string.base': 'Password must be a string',
    'string.empty': 'Password cannot be empty',
    'string.min': 'Password should have a minimum length of {#limit}',
    'any.required': 'Password is required'
  }),
  firebaseToken: Joi.string().messages({
    'string.base': 'Firebase token must be a string'
  })

});

const resetPassword = Joi.object({
  email: Joi.string().email().required().messages({
    'string.base': 'Email must be a string',
    'string.empty': 'Email cannot be empty',
    'string.email': 'Email must be a valid email'
  }),
  password: Joi.string().pattern(passwordRegex).required().messages({
    'string.pattern.base':
      'Password must have at least one uppercase letter, one special character and one number'
  }),
  passwordResetToken: Joi.number().required().positive().integer().messages({
    'number.base': 'Password reset token must be a number',
    'number.positive': 'Password reset token must be a positive number',
    'number.integer': 'Password reset token must be an integer',
    'any.required': 'Password reset token is required'
  })
});

const updatePassword = Joi.object({
  currentPassword: Joi.string().min(6).required().messages({
    'string.base': 'Password must be a string',
    'string.empty': 'Password cannot be empty',
    'string.min': 'Password should have a minimum length of {#limit}',
    'any.required': 'Password is required'
  }),
  newPassword: Joi.string().pattern(passwordRegex).required().messages({
    'string.pattern.base':
      'Password must have at least one uppercase letter, one special character and one number'
  })
});

const removeSessions = Joi.object({
  sessionIds: Joi.array().items(Joi.string()).min(1).required().messages({
    'array.base': 'SessionIds must be an array',
    'array.empty': 'SessionIds cannot be empty',
    'array.min': 'SessionIds must have a minimum length of {#limit}',
    'any.required': 'SessionIds is required'
  })
});

export {
  register,
  requestEmailToken,
  verifyEmailToken,
  login,
  resetPassword,
  updatePassword,
  removeSessions
};
