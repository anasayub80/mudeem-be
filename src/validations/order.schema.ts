import Joi from 'joi';

const checkoutSchema = Joi.object({
  cart: Joi.array() // Array of objects
    .items(
      Joi.object({
        product: Joi.string().required(),
        variant: Joi.string().required(),
        color: Joi.string().required(),
        size: Joi.string().required(),
        quantity: Joi.number().required()
      })
    )
    .required()
    .messages({
      'array.base': 'Cart must be an array',
      'any.required': 'Cart is required'
    }),
  address: Joi.object({
    name: Joi.string().required(),
    address1: Joi.string().required(),
    address2: Joi.string().optional(),
    city: Joi.string().required(),
    state: Joi.string().required(),
    country: Joi.string().required(),
    zip: Joi.string().required()
  }).optional()
});

export { checkoutSchema };
