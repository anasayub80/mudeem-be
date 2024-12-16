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

const createOrderSchema = Joi.object({
  items: Joi.array()
    .items(
      Joi.object({
        product: Joi.string().required(),
        variant: Joi.string().required(),
        color: Joi.string().required(),
        size: Joi.string().required(),
        quantity: Joi.number().required(),
        price: Joi.number().required(),
        total: Joi.number().required(),
        greenPoints: Joi.number().required()
      })
    )
    .required(),
  deliveryCharge: Joi.number().required(),
  totalAmount: Joi.number().required(),
  totalGreenPoints: Joi.number().required(),
  address: Joi.object({
    name: Joi.string().required(),
    address1: Joi.string().required(),
    address2: Joi.string().optional(),
    city: Joi.string().required(),
    state: Joi.string().required(),
    country: Joi.string().required(),
    zip: Joi.string().required()
  })
});

const updateStatusSchema = Joi.object({
  orderId: Joi.string().required(),
  status: Joi.string().required()
});

export { checkoutSchema, createOrderSchema, updateStatusSchema };
