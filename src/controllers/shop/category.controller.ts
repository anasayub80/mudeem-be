import SuccessHandler from '../../utils/successHandler';
import ErrorHandler from '../../utils/errorHandler';
import { RequestHandler } from 'express';
import Category from '../../models/shop/category.model';
import { ICategory } from '../../types/models/shop';
import uploadFile from '../../utils/upload';

const createCategory: RequestHandler = async (req, res) => {
  // #swagger.tags = ['category']
  try {
    const { name, name_ar } = req.body;
    if (!req.file) {
      return ErrorHandler({
        message: 'Image is required',
        statusCode: 400,
        req,
        res
      });
    }
    // const urls: string[] = await uploadFile([req.file as Express.Multer.File]);
    let image = await uploadFile(req.file.buffer);

    const category: ICategory = await Category.create({
      name,
      name_ar,
      image: image.secure_url
    });
    return SuccessHandler({
      data: { message: `Category created`, category },
      statusCode: 201,
      res
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
const getAllCategories: RequestHandler = async (req, res) => {
  // #swagger.tags = ['category']
  try {
    const searchFilter: object = req.query.search
      ? { name: { $regex: req.query.search as string, $options: 'i' } }
      : {};
    const categories: ICategory[] = await Category.find({
      ...searchFilter,
      isActive: true
    });
    return SuccessHandler({
      data: categories,
      statusCode: 200,
      res
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
const getCategory: RequestHandler = async (req, res) => {
  // #swagger.tags = ['category']
  try {
    const category: ICategory | null = await Category.findById(req.params.id);
    if (!category) {
      return ErrorHandler({
        message: 'Category not found',
        statusCode: 404,
        req,
        res
      });
    }
    return SuccessHandler({
      data: category,
      statusCode: 200,
      res
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
const updateCategory: RequestHandler = async (req, res) => {
  // #swagger.tags = ['category']
  try {
    const category: ICategory | null = await Category.findById(req.params.id);
    if (!category) {
      return ErrorHandler({
        message: 'Category not found',
        statusCode: 404,
        req,
        res
      });
    }
    const { name, name_ar } = req.body;
    category.name = name;
    category.name_ar = name_ar;
    if (req.file) {
      let image = await uploadFile(req.file.buffer);

      // const urls: string[] = await uploadFile([req.file
      // as Express.Multer.File]);
      category.image = image.secure_url;
    }
    await category.save();
    return SuccessHandler({
      data: { message: 'Category updated', category },
      statusCode: 200,
      res
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
const deleteCategory: RequestHandler = async (req, res) => {
  // #swagger.tags = ['category']
  try {
    const category: ICategory | null = await Category.findById(req.params.id);
    if (!category) {
      return ErrorHandler({
        message: 'Category not found',
        statusCode: 404,
        req,
        res
      });
    }
    category.isActive = false;
    await category.save();
    return SuccessHandler({
      data: { message: 'Category deleted' },
      statusCode: 200,
      res
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
  createCategory,
  getAllCategories,
  getCategory,
  updateCategory,
  deleteCategory
};
