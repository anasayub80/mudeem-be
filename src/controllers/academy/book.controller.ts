import { RequestHandler } from 'express';
import ErrorHandler from '../../utils/errorHandler';
import mongoose from 'mongoose';
import SuccessHandler from '../../utils/successHandler';
import uploadFile from '../../utils/upload';
import Book from '../../models/academy/book';

const createBook: RequestHandler = async (req, res) => {
  // #swagger.tags = ['academy']
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

const getAllBooks: RequestHandler = async (req, res) => {
  // #swagger.tags = ['academy']
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

const getBook: RequestHandler = async (req, res) => {
  // #swagger.tags = ['academy']
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

const updateBook: RequestHandler = async (req, res) => {
  // #swagger.tags = ['academy']
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

const deleteBook: RequestHandler = async (req, res) => {
  // #swagger.tags = ['academy']
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

const getMyBooks: RequestHandler = async (req, res) => {
  // #swagger.tags = ['academy']
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

const purchaseBook: RequestHandler = async (req, res) => {
  // #swagger.tags = ['academy']
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

const downloadBook: RequestHandler = async (req, res) => {
  // #swagger.tags = ['academy']
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
  createBook,
  getAllBooks,
  getBook,
  updateBook,
  deleteBook,
  getMyBooks,
  purchaseBook,
  downloadBook
};
