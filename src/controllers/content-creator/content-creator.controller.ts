import { RequestHandler } from 'express';
import ErrorHandler from '../../utils/errorHandler';
import SuccessHandler from '../../utils/successHandler';
import uploadFile from '../../utils/upload';
import Reel from '../../models/content-creator/reel';
import ReelComment from '../../models/content-creator/reel-comment';

const createContent: RequestHandler = async (req, res) => {
  // #swagger.tags = ['content-creator']
  try {
    const { description } = req.body;
    if (!req?.file) {
      return ErrorHandler({
        message: 'File is required',
        statusCode: 400,
        req,
        res
      });
    }
    let link = await uploadFile(req.file.buffer);
    const content = await Reel.create({
      user: req.user?._id,
      url: link.secure_url,
      description
    });
    return SuccessHandler({
      res,
      data: { message: `Content created`, content },
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

const getReels: RequestHandler = async (req, res) => {
  // #swagger.tags = ['content-creator']

  try {
    //
  } catch (error) {
    return ErrorHandler({
      message: (error as Error).message,
      statusCode: 500,
      req,
      res
    });
  }
};

const getReel: RequestHandler = async (req, res) => {
  // #swagger.tags = ['content-creator']

  try {
    const excludedIds = req.query.excludedIds
      ? (req.query.excludedIds as string)?.split(',')
      : [];

    // get random reel except the excluded ones
    const reel = await Reel.aggregate([
      { $match: { _id: { $nin: excludedIds } } },
      { $sample: { size: 1 } }
    ]);

    return SuccessHandler({
      res,
      data: { reel },
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

const deleteReel: RequestHandler = async (req, res) => {
  // #swagger.tags = ['content-creator']

  try {
    const { id } = req.params;
    const reel = await Reel.findById(id);
    if (!reel) {
      return ErrorHandler({
        message: 'Reel not found',
        statusCode: 404,
        req,
        res
      });
    }
    await reel.remove();
    return SuccessHandler({
      res,
      data: { message: `Reel deleted` },
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

const likeUnlikeReel: RequestHandler = async (req, res) => {
  // #swagger.tags = ['content-creator']

  try {
    const { id } = req.params;
    const reel = await Reel.findById(id);
    if (!reel) {
      return ErrorHandler({
        message: 'Reel not found',
        statusCode: 404,
        req,
        res
      });
    }
    const userId = req.user?._id;
    if (reel.likes.includes(userId)) {
      reel.likes = reel.likes.filter((like) => like.toString() !== userId);
    } else {
      reel.likes.push(userId);
    }
    await reel.save();
    return SuccessHandler({
      res,
      data: {
        message: `Reel ${reel.likes.includes(userId) ? 'liked' : 'unliked'}`
      },
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
  // #swagger.tags = ['content-creator']

  try {
    const { id } = req.params;
    const { content } = req.body;
    const user = req.user;
    const reel = await Reel.findById(id);
    if (!reel) {
      return ErrorHandler({
        message: 'Reel not found',
        statusCode: 404,
        req,
        res
      });
    }
    // Logic to create a comment
    const comment = await ReelComment.create({
      user: user?._id,
      content
    });
    reel.comments.push(comment._id);
    await reel.save();
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
  // #swagger.tags = ['content-creator']

  try {
    const { id, commentId } = req.params;
    const reel = await Reel.findById(id);
    if (!reel) {
      return ErrorHandler({
        message: 'Reel not found',
        statusCode: 404,
        req,
        res
      });
    }
    const comment = await ReelComment.findById(commentId);
    if (!comment) {
      return ErrorHandler({
        message: 'Comment not found',
        statusCode: 404,
        req,
        res
      });
    }
    await comment.remove();
    reel.comments = reel.comments.filter(
      (comment) => comment.toString() !== commentId
    );
    await reel.save();
    return SuccessHandler({
      res,
      data: { message: `Comment deleted` },
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
  // #swagger.tags = ['content-creator']

  try {
    const { id, commentId } = req.params;
    const reel = await Reel.findById(id);
    if (!reel) {
      return ErrorHandler({
        message: 'Reel not found',
        statusCode: 404,
        req,
        res
      });
    }
    const comment = await ReelComment.findById(commentId);
    if (!comment) {
      return ErrorHandler({
        message: 'Comment not found',
        statusCode: 404,
        req,
        res
      });
    }
    const userId = req.user?._id;
    if (comment.likes.includes(userId)) {
      comment.likes = comment.likes.filter(
        (like) => like.toString() !== userId
      );
    } else {
      comment.likes.push(userId);
    }
    await comment.save();
    return SuccessHandler({
      res,
      data: {
        message: `Comment ${
          comment.likes.includes(userId) ? 'liked' : 'unliked'
        }`
      },
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
  // #swagger.tags = ['content-creator']

  try {
    const { id, commentId } = req.params;
    const { content } = req.body;
    const user = req.user;
    const reel = await Reel.findById(id);
    if (!reel) {
      return ErrorHandler({
        message: 'Reel not found',
        statusCode: 404,
        req,
        res
      });
    }
    const comment = await ReelComment.findById(commentId);
    if (!comment) {
      return ErrorHandler({
        message: 'Comment not found',
        statusCode: 404,
        req,
        res
      });
    }
    // Logic to create a reply
    const reply = await ReelComment.create({
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
  createContent,
  getReels,
  getReel,
  deleteReel,
  likeUnlikeReel,
  createComment,
  deleteComment,
  likeUnlikeComment,
  createReply
};
