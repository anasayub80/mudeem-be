import Joi from 'joi';

const jsonParserJoi = Joi.extend({
  type: 'json',
  base: Joi.string(),
  messages: {
    'json.base': '{{#label}} must be a valid JSON string'
  },
  coerce: (value, helpers) => {
    try {
      return { value: JSON.parse(value) }; // Parse JSON if it's a valid string
    } catch (e) {
      return { errors: [helpers.error('json.base')] };
    }
  }
});

export { jsonParserJoi };
