import joi from 'joi';

const createCategory = joi.object({
  name: joi.string().min(3).required().messages({
    'string.base': 'Name must be a string',
    'string.empty': 'Name cannot be empty',
    'string.min': 'Name should have a minimum length of {#limit}',
    'any.required': 'Name is required'
  }),
  image: joi.string().optional()
});

const updateCategory = joi.object({
  name: joi.string().min(3).messages({
    'string.base': 'Name must be a string',
    'string.empty': 'Name cannot be empty',
    'string.min': 'Name should have a minimum length of {#limit}'
  }),
  image: joi.string().optional()
});

export { createCategory, updateCategory };
