import { RequestHandler } from 'express';
import ErrorHandler from '../../utils/errorHandler';
import SuccessHandler from '../../utils/successHandler';
import Pool from '../../models/carpooling/pool';

const createPool: RequestHandler = async (req, res) => {
  // #swagger.tags = ['carpooling']
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

const getPools: RequestHandler = async (req, res) => {
  // #swagger.tags = ['carpooling']
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

const getPoolById: RequestHandler = async (req, res) => {
  // #swagger.tags = ['carpooling']
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

const deletePool: RequestHandler = async (req, res) => {
  // #swagger.tags = ['carpooling']
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

const updatePool: RequestHandler = async (req, res) => {
  // #swagger.tags = ['carpooling']
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

const endRide: RequestHandler = async (req, res) => {
  // #swagger.tags = ['carpooling']
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

export { createPool, getPools, getPoolById, deletePool, updatePool, endRide };
