import Joi from 'joi';

const approveVendor = Joi.object({
  approved: Joi.boolean().required()
});

export { approveVendor };
