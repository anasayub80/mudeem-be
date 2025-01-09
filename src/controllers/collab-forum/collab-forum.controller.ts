import { RequestHandler } from 'express';
import ErrorHandler from '../../utils/errorHandler';
import mongoose from 'mongoose';
import SuccessHandler from '../../utils/successHandler';
import Post from '../../models/collab-forum/post';
import uploadFile from '../../utils/upload';
import Comment from '../../models/collab-forum/comment';
import path from 'path';
import User from '../../models/User/user.model';

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

    // if (!req.files || req.files.length === 0) {
    //   return ErrorHandler({
    //     message: 'Please upload at least one image',
    //     statusCode: 400,
    //     req,
    //     res
    //   });
    // }

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
      images: images
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
    const { status = 'requested', page = 0, limit = 10 } = req.query;
    const skip = Number(page) * Number(limit);

    let query = {};
    if (req.user?.role !== 'admin') {
      const userId = new mongoose.Types.ObjectId(req.user?._id);
      query = {
        user: userId,
        status: 'accepted'
      };
    } else {
      query = {
        status: status
      };
    }
    const posts = await Post.aggregate([
      {
        $facet: {
          totalDocs: [
            {
              $match: query
            },
            {
              $count: 'count'
            }
          ],
          posts: [
            {
              $match: query
            },
            {
              $lookup: {
                from: 'comments',
                localField: 'comments',
                foreignField: '_id',
                as: 'comments'
              }
            },
            {
              $unwind: {
                path: '$comments',
                preserveNullAndEmptyArrays: true // Avoids removing documents with no comments
              }
            },
            {
              $lookup: {
                from: 'comments',
                localField: 'comments.replies',
                foreignField: '_id',
                as: 'comments.replies'
              }
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
              $project: {
                _id: 1,
                comments: 1,
                images: 1,
                content: 1,
                createdAt: 1,
                user: 1,
                status: 1
              }
            },
            {
              $group: {
                _id: '$_id',
                comments: { $push: '$comments' },
                user: { $first: '$user' },
                images: { $first: '$images' },
                content: { $first: '$content' },
                createdAt: { $first: '$createdAt' },
                status: { $first: '$status' }
              }
            },
            {
              $unwind: {
                path: '$user',
                preserveNullAndEmptyArrays: true // Avoid removing posts without a user match
              }
            },
            {
              $skip: skip
            },
            {
              $limit: Number(limit)
            },
            {
              $sort: { createdAt: -1 }
            }
          ]
        }
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

// admin apis

const changePostStatus: RequestHandler = async (req, res) => {
  // #swagger.tags = ['collab-forum']

  try {
    const { id } = req.params;
    const { points = 0, status = 'requested' } = req.body;

    const post = await Post.findById(id).populate('user', 'name email');

    if (!post) {
      return ErrorHandler({
        message: 'Posts not found',
        statusCode: 404,
        req,
        res
      });
    }
    post.status = String(status);
    await post.save();

    const user = await User.findById(post?.user);
    if (!user) {
      return ErrorHandler({
        message: 'User not found',
        statusCode: 404,
        req,
        res
      });
    }
    user.greenPoints =
      status === 'accepted'
        ? user.greenPoints + Number(points)
        : user.greenPoints;
    await user.save();
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

export {
  createPost,
  getAllPosts,
  getPost,
  updatePost,
  likeUnlikePost,
  createComment,
  deleteComment,
  likeUnlikeComment,
  createReply,
  // admin apis
  changePostStatus
};
