import { RequestHandler } from 'express';
import ErrorHandler from '../../utils/errorHandler';
import SuccessHandler from '../../utils/successHandler';
import GreenMap from '../../models/green-map/green-map.model';
import User from '../../models/user/user.model';

const createGreenMap: RequestHandler = async (req, res) => {
  // #swagger.tags = ['green-map']
  try {
    // Logic to create a green map
    const {
      name,
      description,
      location,
      coordinates,
      category,
      greenPointsPerTime,
      timeLimit
    } = req.body;
    const greenMap = await GreenMap.create({
      name,
      description,
      location,
      coordinates,
      category,
      greenPointsPerTime,
      timeLimit
    });
    return SuccessHandler({
      res,
      data: greenMap,
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

const getAllGreenMaps: RequestHandler = async (req, res) => {
  // #swagger.tags = ['green-map']
  try {
    const { page = 0, limit = 10 } = req.query;
    const skip = Number(page) * Number(limit);
    interface IFilter {
      name?: { $regex: string; $options: string };
      category?: string;
    }
    const filter: IFilter = {};

    req.query.search &&
      (filter['name'] = { $regex: String(req.query.search), $options: 'i' });

    req.query.category && (filter['category'] = String(req.query.category));

    const greenMaps = await GreenMap.find(filter)
      .skip(skip)
      .limit(Number(limit));
    return SuccessHandler({
      res,
      data: greenMaps,
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

const getGreenMap: RequestHandler = async (req, res) => {
  // #swagger.tags = ['green-map']
  try {
    const { id } = req.params;
    const greenMap = await GreenMap.findById(id);
    if (!greenMap) {
      return ErrorHandler({
        message: 'Green map not found',
        statusCode: 404,
        req,
        res
      });
    }
    return SuccessHandler({
      res,
      data: greenMap,
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

const updateGreenMap: RequestHandler = async (req, res) => {
  // #swagger.tags = ['green-map']
  try {
    const { id } = req.params;
    const greenMap = await GreenMap.findByIdAndUpdate(id, req.body, {
      new: true
    });
    return SuccessHandler({
      res,
      data: greenMap,
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

const deleteGreenMap: RequestHandler = async (req, res) => {
  // #swagger.tags = ['green-map']
  try {
    const { id } = req.params;
    await GreenMap.findByIdAndDelete(id);
    return SuccessHandler({
      res,
      data: 'Green map deleted successfully',
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

const rewardGreenMap: RequestHandler = async (req, res) => {
  // #swagger.tags = ['green-map']
  try {
    const { id } = req.params;
    const greenMap = await GreenMap.findById(id);
    if (!greenMap) {
      return ErrorHandler({
        message: 'Green map not found',
        statusCode: 404,
        req,
        res
      });
    }

    const user = await User.findById(req.user?._id);
    if (!user) {
      return ErrorHandler({
        message: 'User not found',
        statusCode: 404,
        req,
        res
      });
    }
    user.greenPoints += greenMap.greenPointsPerTime;
    await user.save();

    return SuccessHandler({
      res,
      data: 'Green map rewarded successfully',
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
  createGreenMap,
  getAllGreenMaps,
  getGreenMap,
  updateGreenMap,
  deleteGreenMap,
  rewardGreenMap
};
