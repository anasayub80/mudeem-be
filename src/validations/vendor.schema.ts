import Joi from 'joi';

const approveVendor = Joi.object({
  approved: Joi.boolean().required().messages({
    'boolean.base': 'Approved must be a boolean',
    'any.required': 'Approved is required'
  })
});

export { approveVendor };
