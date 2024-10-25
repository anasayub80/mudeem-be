import joi from 'joi';

const createCategory = joi.object({
  name: joi.string().min(3).required(),
  description: joi.string().min(3).required(),
  image: joi.string().optional()
});

const updateCategory = joi.object({
  name: joi.string().min(3),
  description: joi.string().min(3),
  image: joi.string().optional()
});

export { createCategory, updateCategory };
