import Joi from 'joi';
import { validateParsedJSON, objectIDJoi } from '../utils/joiExtensions';

const variantSchema = Joi.object({
  name: Joi.string().min(3).required().messages({
    'string.base': 'Variant name must be a string',
    'string.empty': 'Variant name cannot be empty',
    'string.min': 'Variant name should have a minimum length of {#limit}',
    'any.required': 'Variant name is required'
  }),
  price: Joi.number().required().messages({
    'number.base': 'Variant price must be a number',
    'any.required': 'Variant price is required'
  }),
  sizes: Joi.array()
    .items(
      Joi.object({
        size: Joi.string().required().messages({
          'string.base': 'Size must be a string',
          'string.empty': 'Size cannot be empty',
          'any.required': 'Size is required'
        }),
        stock: Joi.number().required().messages({
          'number.base': 'Stock must be a number',
          'any.required': 'Stock is required'
        })
      })
    )
    .required()
    .messages({
      'array.base': 'Sizes must be an array',
      'any.required': 'Sizes are required'
    }),
  colors: Joi.array()
    .items(
      Joi.object({
        color: Joi.string().required().messages({
          'string.base': 'Color must be a string',
          'string.empty': 'Color cannot be empty',
          'any.required': 'Color is required'
        }),
        stock: Joi.number().required().messages({
          'number.base': 'Stock must be a number',
          'any.required': 'Stock is required'
        })
      })
    )
    .required()
    .messages({
      'array.base': 'Colors must be an array',
      'any.required': 'Colors are required'
    })
});

const createProduct = Joi.object({
  name: Joi.string().min(3).required().messages({
    'string.base': 'Name must be a string',
    'string.empty': 'Name cannot be empty',
    'string.min': 'Name should have a minimum length of {#limit}',
    'any.required': 'Name is required'
  }),
  description: Joi.string().min(3).max(1000).required().messages({
    'string.base': 'Description must be a string',
    'string.empty': 'Description cannot be empty',
    'string.min': 'Description should have a minimum length of {#limit}',
    'any.required': 'Description is required'
  }),
  price: Joi.number().required().messages({
    'number.base': 'Price must be a number',
    'any.required': 'Price is required'
  }),
  category: objectIDJoi.objectId().required().messages({
    'objectId.base': 'Category must be a valid ObjectID',
    'any.required': 'Category is required'
  }),
  images: Joi.string().optional(),
  variants: validateParsedJSON('array', Joi.array().items(variantSchema))
    .required()
    .messages({
      'json.base': 'Variants must be a valid JSON array',
      'any.required': 'Variants are required'
    }),
  greenPointsPerUnit: Joi.number().required().messages({
    'number.base': 'Green points per unit must be a number',
    'any.required': 'Green points per unit is required'
  }),
  brand: Joi.string().required().messages({
    'string.base': 'Brand must be a string',
    'string.empty': 'Brand cannot be empty',
    'any.required': 'Brand is required'
  }),
  featured: Joi.boolean().optional()
});

export { createProduct };
