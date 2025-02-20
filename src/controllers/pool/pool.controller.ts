import { RequestHandler } from 'express';
import ErrorHandler from '../../utils/errorHandler';
import SuccessHandler from '../../utils/successHandler';
import Pool from '../../models/carpooling/pool';
import mongoose from 'mongoose';
import { ObjectId } from 'mongodb';
import { bool } from 'aws-sdk/clients/signer';

// done.
const createPool: RequestHandler = async (req, res) => {
  // #swagger.tags = ['carpooling']
  try {
    const {
      pickupLocation,
      whereTo,
      time,
      availableSeats,
    } = req.body;


    const isPoolCreated = await Pool.find({ user: req.user?.id });

    if (isPoolCreated) {
      return ErrorHandler({
        message: "Can't create more than one pool.",
        statusCode: 500,
        req,
        res
      });
    }

    const pool = await Pool.create({
      pickupLocation,
      whereTo,
      time,
      availableSeats,
      user: req.user?.id,
      existingUsers: []
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


// done.
const getPools: RequestHandler = async (req, res) => {
  // #swagger.tags = ['carpooling']
  try {
    const userId = req.user?.id;
    console.log(userId);

    const allPools = await Pool.find(
      { rideEnded: false, user: { $ne: new mongoose.Types.ObjectId(userId) }, rideStarted: false }
    ).populate('user', false).exec();

    return SuccessHandler({
      res,
      data: allPools,
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
}

const myPool: RequestHandler = async (req, res) => {
  // done.
  try {

    const userId = req.user?._id; 
    if (req.query.rideEnded !== undefined) {
      let filters: { user?: ObjectId; rideEnded?: boolean; } = {};

      filters.rideEnded = req.query.rideEnded === 'true';
      filters.user = userId;
      // filters.rideStarted = false;

      const selectedPools = await Pool.find(filters);
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
        data: selectedPools,
        statusCode: 200
      });
    }

    const allPools = await Pool.find({ user: userId }).populate('existingUsers', false).exec();


    return SuccessHandler({
      res,
      data: allPools,
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
      data: selectedPool,
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

    const alue = await Pool.findByIdAndDelete(id);

    if (!alue) {
      return SuccessHandler({
        res,
        data: "Pool already deleted successfully",
        statusCode: 201
      });
    }


    return SuccessHandler({
      res,
      data: "Pool deleted successfully",
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
      userIdToAdd,
      userIdToDropOff,
      rideStarted,
    } = req.body;
    
    const poolId = req.params.id;  
    const foundPool = await Pool.findById(poolId);

    if (!foundPool) {
      return ErrorHandler({
        message: 'Pool not found.',
        statusCode: 404,
        req,
        res
      });
    }


    const newUpdatedPool = foundPool;




    // drop
    if (userIdToDropOff) {
      const doesDroppingOffUserExist = foundPool.droppedOffUsers.find(
        (element) => element.toString() === userIdToDropOff.toString()
      );
      if (doesDroppingOffUserExist) {
        return ErrorHandler({
          message: 'User already dropped off.',
          statusCode: 400,
          req,
          res
        })

      } else {
        // newUpdatedPool.droppedOffUsers.push(userIdToDropOff);
        const userIndexInExisting = foundPool.existingUsers.findIndex(
          (element) => element.toString() === userIdToDropOff.toString()
        );

        if (userIndexInExisting === -1) {
          return ErrorHandler({
            message: 'User is not in the ride.',
            statusCode: 400,
            req,
            res
          });
        }

        newUpdatedPool.existingUsers.splice(userIndexInExisting, 1);
        newUpdatedPool.droppedOffUsers.push(userIdToDropOff);
      }
    }

    // add
    if (userIdToAdd) {
      const doesDroppingOffUserExist = foundPool.existingUsers.find(
        (element) => element.toString() === userIdToAdd.toString()
      );
      if (doesDroppingOffUserExist) {
        return ErrorHandler({
          message: 'User already in the pool.',
          statusCode: 400,
          req,
          res
        })
      } else {
        var isExistingUsersGreaterThanAvailableSeats: Boolean = foundPool.existingUsers.length >= foundPool.availableSeats;
        if (isExistingUsersGreaterThanAvailableSeats) {
          return ErrorHandler({
            message: 'Pool is full.',
            statusCode: 400,
            req,
            res
          })
        }
        newUpdatedPool.existingUsers.push(userIdToAdd);
      }
    }

    if (foundPool.rideStarted === false) {
      if (availableSeats) newUpdatedPool.availableSeats = availableSeats;
      if (pickupLocation) newUpdatedPool.pickupLocation = pickupLocation;
      if (whereTo) newUpdatedPool.whereTo = whereTo;
      if (time) newUpdatedPool.time = time;
    }

    if (rideStarted) newUpdatedPool.rideStarted = true;


    await newUpdatedPool.save();
    return SuccessHandler({
      res,
      data: newUpdatedPool,
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
        statusCode: 404,
        req,
        res
      });
    }

    // Move existing users to droppedOffUsers if they are not already there
    pool.existingUsers.forEach(user => {
      if (!pool.droppedOffUsers.includes(user)) {
        pool.droppedOffUsers.push(user);
      }
    });

    // Clear existing users
    pool.existingUsers = [];

    // Mark the ride as ended
    pool.rideEnded = true;
    await pool.save();

    return SuccessHandler({
      res,
      data: pool,
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

const startRide: RequestHandler = async (req, res) => {
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
    pool.rideStarted = true;
    await pool.save();
    return SuccessHandler({
      res,
      data: pool,
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



export { createPool, getPools, getPoolById, deletePool, updatePool, endRide, myPool, startRide };
