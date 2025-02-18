import { RequestHandler } from 'express';
import ErrorHandler from '../../utils/errorHandler';
import SuccessHandler from '../../utils/successHandler';
import Pool from '../../models/carpooling/pool';
import mongoose from 'mongoose';

const createPool: RequestHandler = async (req, res) => {
  // #swagger.tags = ['carpooling']
  try {
    const {
      pickupLocation,
      whereTo,
      time,
      availableSeats,
    } = req.body;

    console.log("sasaa");
    const pool = await Pool.create({
      pickupLocation,
      whereTo,
      time,
      availableSeats,
      user: req.user?.id,
      existingUsers: [req.user?.id]
    })

    return SuccessHandler({
      res,
      data: { pool },
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


const getPools: RequestHandler = async (req, res) => {
  // #swagger.tags = ['carpooling']
  try {
    const userId = req.user?.id;

    const allPools = await Pool.find(
      { user: { $ne: userId } }
    );
    return SuccessHandler({
      res,
      data: { allPools },
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

const myPool: RequestHandler = async (req, res) => {
  // #swagger.tags = ['carpooling']
  // copy pasted from all pools, will update it tmrw. 
  try {
    if (req.query.rideEnded !== undefined) {
      let filters: { rideEnded?: boolean } = {
        rideEnded: req.query.rideEnded === 'true',
      };
      // filters.rideEnded = req.query.hasEnded === 'true';
      const selectedPools = await Pool.find(filters).populate('existingUsers', false).exec();
      if (!selectedPools) {
        return ErrorHandler({
          message: "Pool not found.",
          statusCode: 404,
          req,
          res
        });
      }

      return SuccessHandler({
        res,
        data: { selectedPools },
        statusCode: 200
      });
    }

    const allPools = await Pool.find().populate('existingUsers', false).exec();
    return SuccessHandler({
      res,
      data: { allPools },
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

const getPoolById: RequestHandler = async (req, res) => {
  // #swagger.tags = ['carpooling']
  try {
    const id = req.params.id;

    const selectedPool = await Pool.findById(id).populate('existingUsers', false).exec();

    if (!selectedPool) {
      return ErrorHandler({
        message: "Pool not found.",
        statusCode: 500,
        req,
        res
      });
    }


    return SuccessHandler({
      res,
      data: { selectedPool },
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
const deletePool: RequestHandler = async (req, res) => {
  // #swagger.tags = ['carpooling']

  try {
    const id = req.params.id;

    if (!id) {
      return ErrorHandler({
        message: "Id can't be empty.",
        statusCode: 400,
        req,
        res
      });
    }

    const deletedPool = await Pool.findByIdAndDelete(id);


    return SuccessHandler({
      res,
      data: { message: "Pool deleted successfully" },
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


const updatePool: RequestHandler = async (req, res) => {

  try {
    // #swagger.tags = ['carpooling']
    const {
      pickupLocation,
      whereTo,
      time,
      availableSeats,
      addUserIntoRide,
      droppedOffSingleUser,
    } = req.body;


    const foundPool = await Pool.findById(req.params.id);

    if (!foundPool) {
      return ErrorHandler({
        message: 'Pool not found.',
        statusCode: 404,
        req,
        res
      });
    }


    const newUpdatedPool = foundPool;


    if (droppedOffSingleUser) {
      const doesDroppingOffUserExist = foundPool.droppedOffUsers.find(
        (element) => element.toString() === droppedOffSingleUser.toString()
      );
      if (doesDroppingOffUserExist) {
        return ErrorHandler({
          message: 'User already dropped off.',
          statusCode: 400,
          req,
          res
        })
      } else {
        newUpdatedPool.droppedOffUsers.push(droppedOffSingleUser);
      }
    }

    if (availableSeats) {

      newUpdatedPool.availableSeats = availableSeats;
    }

    if (pickupLocation) newUpdatedPool.pickupLocation = pickupLocation;
    if (whereTo) newUpdatedPool.whereTo = whereTo;
    if (time) newUpdatedPool.time = time;
    if (addUserIntoRide) {
      const doesDroppingOffUserExist = foundPool.existingUsers.find(
        (element) => element.toString() === addUserIntoRide.toString()
      );
      if (doesDroppingOffUserExist) {
        return ErrorHandler({
          message: 'User already dropped off.',
          statusCode: 400,
          req,
          res
        })

      } else {
        newUpdatedPool.existingUsers.push(addUserIntoRide);
      }
    }

    await newUpdatedPool.save();
    return SuccessHandler({
      res,
      data: { newUpdatedPool },
      statusCode: 201
    })
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

    const id = req.params.id;
    const pool = await Pool.findById(id);
    if (!pool) {
      return ErrorHandler({
        message: "Pool not found.",
        statusCode: 500,
        req,
        res
      });
    }
    pool.rideEnded = true;
    await pool.save();
    return SuccessHandler({
      res,
      data: { pool },
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



export { createPool, getPools, getPoolById, deletePool, updatePool, endRide, myPool };
