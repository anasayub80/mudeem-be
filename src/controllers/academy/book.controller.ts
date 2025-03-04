import { RequestHandler } from 'express';
import ErrorHandler from '../../utils/errorHandler';
import mongoose from 'mongoose';
import SuccessHandler from '../../utils/successHandler';
import uploadFile from '../../utils/upload';
import Book from '../../models/academy/book';
import User from '../../models/User/user.model';

const createBook: RequestHandler = async (req, res) => {
  // #swagger.tags = ['academy']
  try {
    const {
      title,
      description,
      author,
      pages,
      language,
      year,
      price,
      type,
      greenPoints
    } = req.body;
    console.log(req.files);
    if (!req?.files) {
      return ErrorHandler({
        message: 'Thumbnail and Book file is required',
        statusCode: 400,
        req,
        res
      });
    }
    // @ts-ignore
    let thumbnail = await uploadFile(req.files.cover[0].buffer);
    // @ts-ignore
    let bookpdf = await uploadFile(req.files.book[0].buffer);

    const book = await Book.create({
      title,
      description,
      author,
      pages,
      thumbnail: thumbnail.secure_url,
      content: bookpdf.secure_url,
      language,
      year,
      price,
      type,
      greenPoints
    });

    return SuccessHandler({
      res,
      data: book,
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

const getAllBooks: RequestHandler = async (req, res) => {
  // #swagger.tags = ['academy']
  try {
    const { page = 0, limit = 10 } = req.query;
    const skip = Number(page) * Number(limit);
    const filters: {
      title?: { $regex: string; $options: string };
      author?: { $regex: string; $options: string };
      language?: string;
      year?: string;
      price?: { $gt: number } | number;
      type?: string;
    } = {};

    req.query.title &&
      (filters.title = { $regex: String(req.query.title), $options: 'i' });
    req.query.author &&
      (filters.author = { $regex: String(req.query.author), $options: 'i' });
    req.query.language && (filters.language = req.query.language as string);
    req.query.year && (filters.year = req.query.year as string);
    req.query.type &&
      (filters.price =
        (req.query.type as string) === 'premium' ? { $gt: 0 } : 0);
    req.query.type2 && (filters.type = req.query.type2 as string);

    const books = await Book.find(filters)
      .skip(skip)
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    return SuccessHandler({ res, data: books, statusCode: 200 });
  } catch (error) {
    return ErrorHandler({
      message: (error as Error).message,
      statusCode: 500,
      req,
      res
    });
  }
};

const getBook: RequestHandler = async (req, res) => {
  // #swagger.tags = ['academy']
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return ErrorHandler({
        message: 'Invalid book id',
        statusCode: 400,
        req,
        res
      });
    }

    const user = req.user;

    let book;

    console.log(user?.myBooks);

    if (user?.myBooks.includes(new mongoose.Types.ObjectId(id))) {
      book = await Book.findById(id);
    } else {
      book = await Book.findById(id).select('-content');
    }

    if (!book) {
      return ErrorHandler({
        message: 'Book not found',
        statusCode: 404,
        req,
        res
      });
    }
    return SuccessHandler({ res, data: book, statusCode: 200 });
  } catch (error) {
    return ErrorHandler({
      message: (error as Error).message,
      statusCode: 500,
      req,
      res
    });
  }
};

const updateBook: RequestHandler = async (req, res) => {
  // #swagger.tags = ['academy']
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return ErrorHandler({
        message: 'Invalid book id',
        statusCode: 400,
        req,
        res
      });
    }

    const book = await Book.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true
    });

    if (!book) {
      return ErrorHandler({
        message: 'Book not found',
        statusCode: 404,
        req,
        res
      });
    }

    return SuccessHandler({
      res,
      data: book,
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

const deleteBook: RequestHandler = async (req, res) => {
  // #swagger.tags = ['academy']
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return ErrorHandler({
        message: 'Invalid book id',
        statusCode: 400,
        req,
        res
      });
    }

    const book = await Book.findByIdAndDelete(id);

    if (!book) {
      return ErrorHandler({
        message: 'Book not found',
        statusCode: 404,
        req,
        res
      });
    }

    return SuccessHandler({
      res,
      data: { message: 'Book deleted' },
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

const getMyBooks: RequestHandler = async (req, res) => {
  // #swagger.tags = ['academy']
  try {
    const user = req.user;
    const books = await Book.find({ _id: { $in: user?.myBooks } });

    return SuccessHandler({ res, data: books, statusCode: 200 });
  } catch (error) {
    return ErrorHandler({
      message: (error as Error).message,
      statusCode: 500,
      req,
      res
    });
  }
};

const purchaseBook: RequestHandler = async (req, res) => {
  // #swagger.tags = ['academy']
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return ErrorHandler({
        message: 'Invalid book id',
        statusCode: 400,
        req,
        res
      });
    }

    const user = req.user;

    if (!user) {
      return ErrorHandler({
        message: 'Unauthorized',
        statusCode: 401,
        req,
        res
      });
    }

    const book = await Book.findById(id);

    if (!book) {
      return ErrorHandler({
        message: 'Book not found',
        statusCode: 404,
        req,
        res
      });
    }

    if (user.myBooks.includes(book._id)) {
      return ErrorHandler({
        message: 'Book already purchased',
        statusCode: 400,
        req,
        res
      });
    }

    if (user.greenPoints < book.price) {
      return ErrorHandler({
        message: 'Insufficient green points',
        statusCode: 400,
        req,
        res
      });
    }

    await User.findByIdAndUpdate(user._id, {
      $push: {
        myBooks: book._id,
        greenPointsHistory: {
          points: book.greenPoints,
          reason: 'Book Purchase',
          type: 'credit',
          date: Date.now()
        }
      },
      $inc: { greenPoints: -book.price + book.greenPoints }
    });

    return SuccessHandler({
      res,
      data: { message: 'Book purchased successfully', book },
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

const downloadBook: RequestHandler = async (req, res) => {
  // #swagger.tags = ['academy']
  try {
    return SuccessHandler({
      res,
      data: { message: 'Book downloaded successfully' },
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
  createBook,
  getAllBooks,
  getBook,
  updateBook,
  deleteBook,
  getMyBooks,
  purchaseBook,
  downloadBook
};
