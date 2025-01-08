import Joi from 'joi';

const createProject = Joi.object({
  title: Joi.string().required().messages({
    'string.base': 'title must be a string',
    'any.required': 'title is required'
  }),
  description: Joi.string().required().messages({
    'string.base': 'description must be a string',
    'any.required': 'description is required'
  }),
  documents: Joi.string().optional()
});

export { createProject };
