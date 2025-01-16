import Joi from 'joi';

const createFarm = Joi.object({
  location: Joi.string().required().messages({
    'string.base': 'location must be a string',
    'any.required': 'location is required'
  }),
  renewableEnergy: Joi.string().required().messages({
    'string.base': 'renewableEnergy must be a string',
    'any.required': 'renewableEnergy is required'
  }),
  fertilizer: Joi.string().required().messages({
    'string.base': 'fertilizer must be a string',
    'any.required': 'fertilizer is required'
  }),
  desalinationMethod: Joi.string().required().messages({
    'string.base': 'desalinationMethod must be a string',
    'any.required': 'desalinationMethod is required'
  }),
  farmDesignSpecs: Joi.string().required().messages({
    'string.base': 'farmDesignSpecs must be a string',
    'any.required': 'farmDesignSpecs is required'
  }),
  desiredEquipment: Joi.string().required().messages({
    'string.base': 'desiredEquipment must be a string',
    'any.required': 'desiredEquipment is required'
  }),
  budgetDetails: Joi.number().required().messages({
    'string.base': 'budgetDetails must be a number',
    'any.required': 'budgetDetails is required'
  }),
  electricGeneration: Joi.string().required().messages({
    'string.base': 'electricGeneration must be a string',
    'any.required': 'electricGeneration is required'
  }),
  images: Joi.string().optional()
});

const updateFarm = Joi.object({
  location: Joi.string().required().messages({
    'string.base': 'location must be a string',
    'any.required': 'location is required'
  }),
  renewableEnergy: Joi.string().required().messages({
    'string.base': 'renewableEnergy must be a string',
    'any.required': 'renewableEnergy is required'
  }),
  fertilizer: Joi.string().required().messages({
    'string.base': 'fertilizer must be a string',
    'any.required': 'fertilizer is required'
  }),
  desalinationMethod: Joi.string().required().messages({
    'string.base': 'desalinationMethod must be a string',
    'any.required': 'desalinationMethod is required'
  }),
  farmDesignSpecs: Joi.string().required().messages({
    'string.base': 'farmDesignSpecs must be a string',
    'any.required': 'farmDesignSpecs is required'
  }),
  desiredEquipment: Joi.string().required().messages({
    'string.base': 'desiredEquipment must be a string',
    'any.required': 'desiredEquipment is required'
  }),
  budgetDetails: Joi.number().required().messages({
    'string.base': 'budgetDetails must be a number',
    'any.required': 'budgetDetails is required'
  }),
  electricGeneration: Joi.string().required().messages({
    'string.base': 'electricGeneration must be a string',
    'any.required': 'electricGeneration is required'
  })
});

export { createFarm, updateFarm };
