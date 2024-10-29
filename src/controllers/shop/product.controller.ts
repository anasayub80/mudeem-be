import SuccessHandler from '../../utils/successHandler';
import ErrorHandler from '../../utils/errorHandler';
import { RequestHandler } from 'express';
import Product from '../../models/shop/product.model';
import Variant from '../../models/shop/variant.model';
import { IProduct, IVariant } from '../../types/models/shop';

const createProduct: RequestHandler = async (req, res) => {
  // #swagger.tags = ['product']
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

const getAllProducts: RequestHandler = async (req, res) => {
  // #swagger.tags = ['product']
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

const getProduct: RequestHandler = async (req, res) => {
  // #swagger.tags = ['product']
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

const updateProduct: RequestHandler = async (req, res) => {
  // #swagger.tags = ['product']
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

const deleteProduct: RequestHandler = async (req, res) => {
  // #swagger.tags = ['product']
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
  createProduct,
  getAllProducts,
  getProduct,
  updateProduct,
  deleteProduct
};
