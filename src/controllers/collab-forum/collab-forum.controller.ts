import { RequestHandler } from 'express';
import Post from '../../models/collab-forum/post';
import ErrorHandler from '../../utils/errorHandler';

const createPost: RequestHandler = async (req, res) => {
  // #swagger.tags = ['collab-forum']
  try {
    const { content, images } = req.body;
    const user = req.user;
    // #swagger.parameters['req'] = {
    //   in: 'body',
    //   required: true,
    //   schema: {
    //     $content: 'This is a post content',
    //     $images: ['image1.png', 'image2.png']
    //   }
    // }

    // Logic to create a post
    const post = await Post.create({
      user: user?._id,
      content,
      images
    });

    
  } catch (error) {
    return ErrorHandler({
      message: (error as Error).message,
      statusCode: 500,
      req,
      res
    });
  }
};
const getAllPosts: RequestHandler = async (req, res) => {
  // #swagger.tags = ['collab-forum']

  try {
  } catch (error) {
    return ErrorHandler({
      message: (error as Error).message,
      statusCode: 500,
      req,
      res
    });
  }
};
const getPost: RequestHandler = async (req, res) => {
  // #swagger.tags = ['collab-forum']

  try {
  } catch (error) {
    return ErrorHandler({
      message: (error as Error).message,
      statusCode: 500,
      req,
      res
    });
  }
};
const updatePost: RequestHandler = async (req, res) => {
  // #swagger.tags = ['collab-forum']

  try {
  } catch (error) {
    return ErrorHandler({
      message: (error as Error).message,
      statusCode: 500,
      req,
      res
    });
  }
};
const likeUnlikePost: RequestHandler = async (req, res) => {
  // #swagger.tags = ['collab-forum']

  try {
  } catch (error) {
    return ErrorHandler({
      message: (error as Error).message,
      statusCode: 500,
      req,
      res
    });
  }
};
const createComment: RequestHandler = async (req, res) => {
  // #swagger.tags = ['collab-forum']

  try {
  } catch (error) {
    return ErrorHandler({
      message: (error as Error).message,
      statusCode: 500,
      req,
      res
    });
  }
};
const deleteComment: RequestHandler = async (req, res) => {
  // #swagger.tags = ['collab-forum']

  try {
  } catch (error) {
    return ErrorHandler({
      message: (error as Error).message,
      statusCode: 500,
      req,
      res
    });
  }
};
const likeUnlikeComment: RequestHandler = async (req, res) => {
  // #swagger.tags = ['collab-forum']

  try {
  } catch (error) {
    return ErrorHandler({
      message: (error as Error).message,
      statusCode: 500,
      req,
      res
    });
  }
};
const createReply: RequestHandler = async (req, res) => {
  // #swagger.tags = ['collab-forum']

  try {
  } catch (error) {
    return ErrorHandler({
      message: (error as Error).message,
      statusCode: 500,
      req,
      res
    });
  }
};

export {
  createPost,
  getAllPosts,
  getPost,
  updatePost,
  likeUnlikePost,
  createComment,
  deleteComment,
  likeUnlikeComment,
  createReply
};
