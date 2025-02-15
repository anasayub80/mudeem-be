import User from '../models/User/user.model';
import { IUser, UserSession } from '../types/models/user';
import SuccessHandler from '../utils/successHandler';
import ErrorHandler from '../utils/errorHandler';
import { RequestHandler } from 'express';

const getLeaderboard: RequestHandler = async (req, res) => {
  // #swagger.tags = ['leaderboard']
  try {
    const { type } = req.query;
    // type: all, today, week
    let matchStage: any = {};
    if (type === 'today') {
      matchStage = {
        'greenPointsHistory.date': {
          $gte: new Date(new Date().setHours(0, 0, 0, 0)),
          $lt: new Date(new Date().setHours(23, 59, 59, 999))
        }
      };
    } else if (type === 'week') {
      matchStage = {
        'greenPointsHistory.date': {
          $gte: new Date(new Date().setDate(new Date().getDate() - 7)).setHours(
            0,
            0,
            0,
            0
          )
        }
      };
    } else {
      matchStage = {};
    }

    const data = await User.aggregate([
      {
        $unwind: '$greenPointsHistory'
      },
      {
        $match: matchStage
      },
      {
        $group: {
          _id: '$_id',
          name: { $first: '$name' },
          profilePicture: { $first: '$profilePicture' },
          points: { $sum: '$greenPointsHistory.points' }
        }
      },
      {
        $sort: { points: -1 }
      }
    ]);
    return SuccessHandler({
      res,
      data,
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

export { getLeaderboard };
