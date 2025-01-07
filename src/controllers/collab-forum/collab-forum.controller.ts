import { RequestHandler } from 'express';
import Post from '../../models/collab-forum/post';
import ErrorHandler from '../../utils/errorHandler';
import uploadFile from '../../utils/upload';
import SuccessHandler from '../../utils/successHandler';
import Comment from '../../models/collab-forum/comment';
import mongoose from 'mongoose';
import path from 'path';

const createPost: RequestHandler = async (req, res) => {
  // #swagger.tags = ['collab-forum']
  try {
    const { content } = req.body;
    const user = req.user;
    // #swagger.parameters['req'] = {
    //   in: 'body',
    //   required: true
    //   schema: {
    //     $content: 'This is a post content',
    //     $images: ['image1.png', 'image2.png']
    //   }
    // }

    if (!req.files || req.files.length === 0) {
      return ErrorHandler({
        message: 'Please upload at least one image',
        statusCode: 400,
        req,
        res
      });
    }

    // const urls: string[] = await uploadFile(req.files as Express.Multer.File[]);
    let images = await Promise.all(
      req?.files?.map(async (item) => {
        const result = await uploadFile(item?.buffer);
        return result.secure_url;
      }) || []
    );
    // Logic to create a post
    const post = await Post.create({
      user: user?._id,
      content,
      // images: urls || []
      imagegs: images
    });

    return SuccessHandler({
      res,
      data: post,
      statusCode: 201
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
    let query = {};
    if (req.query?.mine == 'true') {
      const userId = new mongoose.Types.ObjectId(req.user?._id);
      query = { user: userId };
    }
    const posts = await Post.aggregate([
      {
        $match: query
      },
      {
        $lookup: {
          from: 'users',
          localField: 'user',
          foreignField: '_id',
          as: 'user'
        }
      },
      {
        $unwind: '$user'
      }
    ]);
    return SuccessHandler({
      res,
      data: posts,
      statusCode: 200
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
const getPost: RequestHandler = async (req, res) => {
  // #swagger.tags = ['collab-forum']

  try {
    const { id } = req.params;
    const post = await Post.findById(id)
      .populate('user', 'name email')
      .populate({
        path: 'comments',
        populate: [
          {
            path: 'user',
            select: 'name email'
          },
          {
            path: 'likes',
            select: 'name email'
          },
          {
            path: 'replies',
            populate: [
              {
                path: 'user',
                select: 'name email'
              },
              {
                path: 'likes',
                select: 'name email'
              }
            ]
          }
        ]
      })
      .populate('likes', 'name email');
    if (!post) {
      return ErrorHandler({
        message: 'Post not found',
        statusCode: 404,
        req,
        res
      });
    }
    return SuccessHandler({
      res,
      data: post,
      statusCode: 200
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
const updatePost: RequestHandler = async (req, res) => {
  // #swagger.tags = ['collab-forum']

  try {
    const { id } = req.params;
    const { content } = req.body;
    const user = req.user;
    const post = await Post.findById(id);
    if (!post) {
      return ErrorHandler({
        message: 'Post not found',
        statusCode: 404,
        req,
        res
      });
    }
    if (post.user.toString() !== user?._id.toString()) {
      return ErrorHandler({
        message: 'You are not authorized to perform this action',
        statusCode: 403,
        req,
        res
      });
    }
    if (req.files && req.files.length > 0) {
      // const urls: string[] = await uploadFile(req.files as Express.Multer.File[]);
      // post.images = urls;
    }
    post.content = content;
    await post.save();
    return SuccessHandler({
      res,
      data: post,
      statusCode: 200
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
const likeUnlikePost: RequestHandler = async (req, res) => {
  // #swagger.tags = ['collab-forum']

  try {
    const { id } = req.params;
    const user = req.user;
    const post = await Post.findById(id);
    if (!post) {
      return ErrorHandler({
        message: 'Post not found',
        statusCode: 404,
        req,
        res
      });
    }
    const isLiked = post.likes.includes(user?._id);
    if (isLiked) {
      post.likes = post.likes.filter(
        (like) => like.toString() !== user?._id.toString()
      );
    } else {
      post.likes.push(user?._id);
    }
    return SuccessHandler({
      res,
      data: post,
      statusCode: 200
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
const createComment: RequestHandler = async (req, res) => {
  // #swagger.tags = ['collab-forum']

  try {
    const { id } = req.params;
    const { content } = req.body;
    const user = req.user;
    const post = await Post.findById(id);
    if (!post) {
      return ErrorHandler({
        message: 'Post not found',
        statusCode: 404,
        req,
        res
      });
    }
    // Logic to create a comment
    const comment = await Comment.create({
      user: user?._id,
      content
    });
    post.comments.push(comment._id);
    await post.save();
    return SuccessHandler({
      res,
      data: comment,
      statusCode: 201
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
const deleteComment: RequestHandler = async (req, res) => {
  // #swagger.tags = ['collab-forum']

  try {
    const { id, commentId } = req.params;
    const user = req.user;
    const post = await Post.findById(id);
    if (!post) {
      return ErrorHandler({
        message: 'Post not found',
        statusCode: 404,
        req,
        res
      });
    }
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return ErrorHandler({
        message: 'Comment not found',
        statusCode: 404,
        req,
        res
      });
    }
    if (comment.user.toString() !== user?._id.toString()) {
      return ErrorHandler({
        message: 'You are not authorized to perform this action',
        statusCode: 403,
        req,
        res
      });
    }
    await comment.remove();
    post.comments = post.comments.filter(
      (comm) => comm.toString() !== commentId
    );
    await post.save();
    return SuccessHandler({
      res,
      data: post,
      statusCode: 200
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
const likeUnlikeComment: RequestHandler = async (req, res) => {
  // #swagger.tags = ['collab-forum']
  try {
    const { id, commentId } = req.params;
    const user = req.user;
    const post = await Post.findById(id);
    if (!post) {
      return ErrorHandler({
        message: 'Post not found',
        statusCode: 404,
        req,
        res
      });
    }
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return ErrorHandler({
        message: 'Comment not found',
        statusCode: 404,
        req,
        res
      });
    }
    const isLiked = comment.likes.includes(user?._id);
    if (isLiked) {
      comment.likes = comment.likes.filter(
        (like) => like.toString() !== user?._id.toString()
      );
    } else {
      comment.likes.push(user?._id);
    }
    await comment.save();
    return SuccessHandler({
      res,
      data: comment,
      statusCode: 200
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
const createReply: RequestHandler = async (req, res) => {
  // #swagger.tags = ['collab-forum']

  try {
    const { id, commentId } = req.params;
    const { content } = req.body;
    const user = req.user;
    const post = await Post.findById(id);
    if (!post) {
      return ErrorHandler({
        message: 'Post not found',
        statusCode: 404,
        req,
        res
      });
    }
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return ErrorHandler({
        message: 'Comment not found',
        statusCode: 404,
        req,
        res
      });
    }
    // Logic to create a reply
    const reply = await Comment.create({
      user: user?._id,
      content
    });
    comment.replies.push(reply._id);
    await comment.save();
    return SuccessHandler({
      res,
      data: reply,
      statusCode: 201
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
