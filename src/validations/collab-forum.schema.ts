import Joi from 'joi';

const createUpdatePost = Joi.object({
  content: Joi.string().required().messages({
    'string.base': 'Content must be a string',
    'any.required': 'Content is required'
  }),
  images: Joi.array().items(Joi.string()).optional().min(1).messages({
    'array.base': 'Images must be an array',
    'array.min': 'Images must have at least 1 image'
  })
});

const createUpdateComment = Joi.object({
  content: Joi.string().required().messages({
    'string.base': 'Content must be a string',
    'any.required': 'Content is required'
  })
});

const createCommentReply = Joi.object({
  content: Joi.string().required().messages({
    'string.base': 'Content must be a string',
    'any.required': 'Content is required'
  })
});

export { createUpdatePost, createUpdateComment, createCommentReply };
