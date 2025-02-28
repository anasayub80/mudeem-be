import { RequestHandler } from 'express';
import ErrorHandler from '../../utils/errorHandler';
import SuccessHandler from '../../utils/successHandler';
import Pool from '../../models/carpooling/pool';
import mongoose from 'mongoose';
import { ObjectId } from 'mongodb';
import User from '../../models/User/user.model';
import { Setting } from '../../models/settings';
import { sentPushNotification } from '../../utils/firebase';
import { IUser } from '../../types/models/user';
import { greenPoints } from 'controllers/auth.controller';

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


    const isPoolCreated = await Pool.find({ user: req.user?.id, rideEnded: false });
    console.log("Selceted pool", isPoolCreated);
    if (isPoolCreated.length > 0) {
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
    console.log("Selceted pool", req.query.rideEnded);
    if (req.query.rideEnded !== undefined) {
      let filters: { user?: ObjectId; rideEnded?: boolean; } = {};

      filters.rideEnded = req.query.rideEnded === 'true';
      filters.user = userId;
      // filters.rideStarted = false;

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
    var foundPool = await Pool.findById(poolId);
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
        });
      } else {
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
        // Increase  seats when a user is dropped off
        newUpdatedPool.availableSeats += 1;
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
        });
      } else {
        var isPoolFull = foundPool.availableSeats === 0;
        if (isPoolFull) {
          return ErrorHandler({
            message: 'Pool is full.',
            statusCode: 400,
            req,
            res
          });
        }

        // Allow the user to join
        newUpdatedPool.existingUsers.push(userIdToAdd);
        newUpdatedPool.availableSeats -= 1; // Decrease seat count
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


const endRide: RequestHandler = async (req, res) => {
  // #swagger.tags = ['carpooling']
  try {
    const id = req.params.id;
    const pool = await Pool.findById(id).populate('user', false);

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

    const setting = await Setting.findOne().sort({ createdAt: -1 });
    if (!setting) {
      throw new Error("Settings not found");
    }


    let userRideOwnerPoints: Number = 0;

    var greenPointsHistoryForResponse = {
      points: userRideOwnerPoints,
      type: 'credit',
      reason: 'carpooling'
    }

    const carPoolingGreenPoints = Number(setting.carPoolingGreenPoints || 0);
    greenPointsHistoryForResponse.points = carPoolingGreenPoints;
    console.log("Supposed to send not here", pool.droppedOffUsers.length);
    if (pool.droppedOffUsers.length > 0) {
      await User.findByIdAndUpdate(pool.user, {
        $set: {
          greenPoints: carPoolingGreenPoints
        },
        $push: {
          greenPointsHistory: {
            points: carPoolingGreenPoints || 0,
            type: 'credit',
            reason: 'carpooling'
          }
        }
      });

      const user = req.user as IUser;
      const token = user?.firebaseToken || '';
      console.log("Ride Ending, sending PS to userA");
      if (user.allowNotifications) {
        console.log("Ride Ending, sending PS to user");
        await sentPushNotification(token, `Lift Update`, `Congratulations! You have earned ${carPoolingGreenPoints} green points for Lift.`, user._id.toString());
      }
    }




    pool.droppedOffUsers.forEach(async (user) => {
      const findUser = await User.findById(user) as IUser;
      if (!findUser) return; // Handle missing user case 
      const points = (carPoolingGreenPoints / 4);
      const userPoints = Math.max(1, Math.trunc(points));
      userRideOwnerPoints = userPoints;
      greenPointsHistoryForResponse.points = userRideOwnerPoints;
      const greenPoints = (findUser.greenPoints || 0) + userPoints;
      await User.updateOne(
        {
          _id: user
        },
        {
          $set: {
            greenPoints: greenPoints
          },
          $push: {
            greenPointsHistory: {
              points: userPoints || 0,
              type: 'credit',
              reason: 'carpooling'
            }
          }
        }
      );
      console.log("why sendsx");
      if (findUser.allowNotifications) {
        const token = findUser.firebaseToken || '';
        await sentPushNotification(token, `Lift Update`, `Congratulations! You have earned ${userPoints} green points for Lift.`, findUser._id.toString());
      }
    });


    return SuccessHandler({
      res,
      data: greenPointsHistoryForResponse,
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
