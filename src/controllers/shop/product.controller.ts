import SuccessHandler from '../../utils/successHandler';
import ErrorHandler from '../../utils/errorHandler';
import { RequestHandler } from 'express';
import Product from '../../models/shop/product.model';
import Variant from '../../models/shop/variant.model';
import { IProduct, IVariant } from '../../types/models/shop';
import mongoose from 'mongoose';
import uploadFile from '../../utils/upload';

const createProduct: RequestHandler = async (req, res) => {
  // #swagger.tags = ['product']
  console.log(req.body);
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const {
      name,
      description,
      price,
      category,
      variants,
      greenPointsPerUnit,
      brand
    } = req.body;

    const jsonVariants = JSON.parse(variants);

    console.log(req.files);

    if (!req.files || req.files?.length === 0) {
      return ErrorHandler({
        message: 'Image is required',
        statusCode: 400,
        req,
        res
      });
    }
    console.log(req.files);
    // const urls: string[] = await uploadFile([req.file as Express.Multer.File]);

    const variantsArray: IVariant[] = await Variant.insertMany(jsonVariants, {
      session
    });

    const user = req.user;

    const images = await Promise.all(
      req.files.map(async (item) => {
        const result = await uploadFile(item.buffer);
        return result.secure_url;
      })
    );

    const product = await Product.create(
      [
        {
          name,
          description,
          price,
          category,
          images: images,
          variants: variantsArray.map((variant) => variant._id),
          greenPointsPerUnit,
          user: req.user?._id,
          brand,
          featured: req.body.featured || false,
          vendor: user?._id || '6763ed1956b22e551b58a262'
        }
      ],
      { session }
    );
    await session.commitTransaction();
    return SuccessHandler({
      data: { message: `Product created`, product },
      statusCode: 201,
      res
    });
  } catch (error) {
    await session.abortTransaction();
    return ErrorHandler({
      message: (error as Error).message,
      statusCode: 500,
      req,
      res
    });
  } finally {
    session.endSession();
  }
};

const getAllProducts: RequestHandler = async (req, res) => {
  // #swagger.tags = ['product']
  try {
    interface Filters {
      category?: string;
      name?: object;
      role?: object;
      featured?: boolean;
      isActive: boolean;
    }
    const filters: Filters = {
      ...(req.query.category && { category: req.query.category as string }),
      ...(req.query.search && {
        name: { $regex: req.query.search as string, $options: 'i' }
      }),
      ...(req.user?.role === 'vendor' && { role: { user: req.user._id } }),
      ...(req.query.vendorId && { role: { user: req.query.vendorId } }),
      ...(req.query.featured && { featured: true }),
      isActive: true
    };
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const products: IProduct[] = await Product.find(filters)
      .populate('category')
      .populate({
        path: 'reviews',
        populate: {
          path: 'user'
        }
      })
      // .populate('user')
      // .populate('variants')
      .skip(skip)
      .limit(limit);
    return SuccessHandler({
      data: products,
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

const getProduct: RequestHandler = async (req, res) => {
  // #swagger.tags = ['product']
  try {
    let reviewSort = {};
    if (req.query.sort === 'highest') {
      reviewSort = { 'rating.stars': -1 };
    } else if (req.query.sort === 'lowest') {
      reviewSort = { 'rating.stars': 1 };
    } else {
      reviewSort = { createdAt: -1 };
    }

    const product = await Product.findById(req.params.id)
      .populate('category')
      .populate('variants')
      .populate({
        path: 'reviews',
        populate: {
          path: 'user'
        }
      });
    // const product = await Product.aggregate([
    //   {
    //     $match: {
    //       _id: new mongoose.Types.ObjectId(req.params.id),
    //       isActive: true
    //     }
    //   },
    //   {
    //     $lookup: {
    //       from: 'variants',
    //       localField: 'variants',
    //       foreignField: '_id',
    //       as: 'variants'
    //     }
    //   },
    //   {
    //     $lookup: {
    //       from: 'categories',
    //       localField: 'category',
    //       foreignField: '_id',
    //       as: 'category'
    //     }
    //   },
    //   { $unwind: '$category' },
    //   {
    //     $lookup: {
    //       from: 'users',
    //       localField: 'user',
    //       foreignField: '_id',
    //       as: 'user'
    //     }
    //   },
    //   { $unwind: '$user' },
    //   {
    //     $lookup: {
    //       from: 'reviews',
    //       let: { productId: '$_id' },
    //       pipeline: [
    //         { $match: { $expr: { $eq: ['$product', '$$productId'] } } },
    //         { $sort: reviewSort },
    //         {
    //           $group: {
    //             _id: '$rating',
    //             count: { $sum: 1 }
    //           }
    //         }
    //       ],
    //       as: 'ratingBreakdown'
    //     }
    //   },
    //   {
    //     $lookup: {
    //       from: 'reviews',
    //       let: { productId: '$_id' },
    //       pipeline: [
    //         { $match: { $expr: { $eq: ['$product', '$$productId'] } } },
    //         { $sort: reviewSort }
    //       ],
    //       as: 'reviews'
    //     }
    //   },
    //   {
    //     $lookup: {
    //       from: 'users',
    //       localField: 'reviews.user',
    //       foreignField: '_id',
    //       as: 'reviews.user'
    //     }
    //   },
    //   {
    //     $addFields: {
    //       ratingBreakdown: {
    //         $arrayToObject: {
    //           $map: {
    //             input: '$ratingBreakdown',
    //             as: 'r',
    //             in: {
    //               k: { $concat: [{ $toString: '$$r._id' }, '-star'] },
    //               v: '$$r.count'
    //             }
    //           }
    //         }
    //       }
    //     }
    //   },
    //   {
    //     $project: {
    //       name: 1,
    //       description: 1,
    //       price: 1,
    //       category: 1,
    //       images: 1,
    //       variants: 1,
    //       greenPointsPerUnit: 1,
    //       user: 1,
    //       brand: 1,
    //       rating: 1,
    //       stock: 1,
    //       featured: 1,
    //       sold: 1,
    //       reviews: 1,
    //       ratingBreakdown: 1
    //     }
    //   }
    // ]);

    if (!product) {
      return ErrorHandler({
        message: 'Product not found',
        statusCode: 404,
        req,
        res
      });
    }
    return SuccessHandler({
      data: product,
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

const updateProduct: RequestHandler = async (req, res) => {
  // #swagger.tags = ['product']
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const {
      name,
      description,
      price,
      category,
      updatedVariants = '[]',
      deletedVariants = '[]',
      newVariants = '[]',
      greenPointsPerUnit,
      brand,
      deletedImages = '[]'
    } = req.body;
    const product: IProduct | null = await Product.findById(req.params.id);
    if (!product) {
      return ErrorHandler({
        message: 'Product not found',
        statusCode: 404,
        req,
        res
      });
    }
    const jsonVariants = JSON.parse(updatedVariants);
    const newVariantsArray = JSON.parse(newVariants);
    const deletedVariantsArray = JSON.parse(deletedVariants);
    const deletedImagesArray = JSON.parse(deletedImages);
    // handling updated variants
    if (jsonVariants.length > 0) {
      console.log(jsonVariants, 'jsonVariants');
      Promise.all(
        jsonVariants.map(async (variant: IVariant) => {
          if (variant._id) {
            const updatedVariant: IVariant | null =
              await Variant.findByIdAndUpdate(variant._id, variant, {
                new: true,
                session
              });
            console.log(updatedVariant, 'updatedVariant');
            if (!updatedVariant) {
              throw new Error('Variant not found');
            }
            return updatedVariant;
          }
        })
      );
    }
    // handling deleted variants
    if (deletedVariantsArray.length > 0) {
      console.log(deletedVariantsArray, 'deletedVariantsArray');
      await Variant.deleteMany(
        { _id: { $in: deletedVariantsArray } },
        { session }
      );
      product.variants = product.variants.filter(
        (variant) => !deletedVariantsArray.includes(variant.toString())
      );
    }

    // handling new variants
    if (newVariantsArray.length > 0) {
      const newVariants: IVariant[] = await Variant.insertMany(
        newVariantsArray,
        {
          session
        }
      );
      newVariants.forEach((variant) => {
        product.variants.push(variant._id);
      });
    }
    // handling deleted images
    if (deletedImagesArray.length > 0) {
      // await deleteFile(deletedImagesArray[0], req, res);
      product.images = product.images.filter(
        (image) => !deletedImagesArray.includes(image)
      );
    }
    // handling new images
    if (req.files) {
      // const urls: string[] = await uploadFile(req.files as Express.Multer.File[]);
      // product.images.push(...urls);
    }
    product.name = name;
    product.description = description;
    product.price = price;
    product.category = category;
    product.greenPointsPerUnit = greenPointsPerUnit;
    product.brand = brand;
    product.featured = req.body.featured
      ? JSON.parse(req.body.featured)
      : false;
    product.stock = req.body.stock ? JSON.parse(req.body.stock) : product.stock;
    console.log(product.variants, 'product');
    await product.save({ session });
    console.log('here');
    await session.commitTransaction();
    return SuccessHandler({
      data: { message: 'Product updated' },
      statusCode: 201,
      res
    });
  } catch (error) {
    await session.abortTransaction();
    console.log('here2');
    return ErrorHandler({
      message: (error as Error).message,
      statusCode: 500,
      req,
      res
    });
  } finally {
    await session.endSession();
  }
};

const deleteProduct: RequestHandler = async (req, res) => {
  // #swagger.tags = ['product']
  try {
    const product: IProduct | null = await Product.findById(req.params.id);
    if (!product) {
      return ErrorHandler({
        message: 'Product not found',
        statusCode: 404,
        req,
        res
      });
    }
    product.isActive = false;
    await product.save();
    return SuccessHandler({
      data: { message: 'Product deleted' },
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
  createProduct,
  getAllProducts,
  getProduct,
  updateProduct,
  deleteProduct
};
