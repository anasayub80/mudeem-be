import SuccessHandler from '../../utils/successHandler';
import ErrorHandler from '../../utils/errorHandler';
import { RequestHandler } from 'express';
import Banner from '../../models/shop/banner.model';
import { IBanner } from '../../types/models/shop';
import uploadFile from '../../utils/upload';

const getBanners: RequestHandler = async (req, res) => {
  // #swagger.tags = ['category']
  try {
    // const { type = 'shop' } = req.query;
    const banners = await Banner.find();
    return SuccessHandler({
      data: { message: `Banners fetched`, banners },
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

const createBanner: RequestHandler = async (req, res) => {
  // #swagger.tags = ['category']
  try {
    const { name, type = 'farm' } = req.body;
    let image = { secure_url: 'dfff' };
    if (!req.file) {
      return ErrorHandler({
        message: 'Image is required',
        statusCode: 400,
        req,
        res
      });
    }
    // const urls: string[] = await uploadFile([req.file as Express.Multer.File]);
    if (req?.file) {
      image = await uploadFile(req.file.buffer);
    }

    const banner: IBanner = await Banner.create({
      name,
      type,
      image: image.secure_url
    });
    return SuccessHandler({
      data: { message: `Banner created`, banner },
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

const updateBanner: RequestHandler = async (req, res) => {
  // #swagger.tags = ['category']
  try {
    const banner: IBanner | null = await Banner.findById(req.params.id);
    if (!banner) {
      return ErrorHandler({
        message: 'Category not found',
        statusCode: 404,
        req,
        res
      });
    }
    const { name } = req.body;
    banner.name = name;
    if (req.file) {
      let image = await uploadFile(req.file.buffer);

      // const urls: string[] = await uploadFile([req.file
      // as Express.Multer.File]);
      banner.image = image.secure_url;
    }
    await banner.save();
    return SuccessHandler({
      data: { message: 'Banner updated', banner },
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

const deletebanner: RequestHandler = async (req, res) => {
  // #swagger.tags = ['category']
  try {
    const banner: IBanner | null = await Banner.findById(req.params.id);
    if (!banner) {
      return ErrorHandler({
        message: 'Banner not found',
        statusCode: 404,
        req,
        res
      });
    }
    await Banner.findByIdAndDelete(req.params.id);
    return SuccessHandler({
      data: { message: 'Banner deleted' },
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

export { getBanners, createBanner, updateBanner, deletebanner };
