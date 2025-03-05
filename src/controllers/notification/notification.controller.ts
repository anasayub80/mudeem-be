import { RequestHandler } from 'express';
import ErrorHandler from '../../utils/errorHandler';
import SuccessHandler from '../../utils/successHandler';
import GreenMap from '../../models/green-map/green-map.model';
import User from '../../models/User/user.model';
import Notification from '../../models/notifications/notifications_model';
import mongoose, { Error } from 'mongoose';

const fetchNotification: RequestHandler = async (req, res) => {
  try {
    console.log('reached here');

    const userId = req.user?._id;
    const notification = await Notification.find({
      user: new mongoose.Types.ObjectId(userId)
    });
    if (!notification) {
      return ErrorHandler({
        message: 'Notification not found',
        statusCode: 400,
        req,
        res
      });
    } else {
      return SuccessHandler({
        data: notification,
        statusCode: 200,
        res
      });
    }
  } catch (error) {
    return ErrorHandler({
      message: (error as Error).message,
      statusCode: 500,
      req,
      res
    });
  }
};

const updateSeenNotification: RequestHandler = async (req, res) => {
  try {
    const userId = req.user?._id;
    const notification = await Notification.updateMany(
      { user: new mongoose.Types.ObjectId(userId) },
      { $set: { seen: true } }
    );
    if (!notification) {
      return ErrorHandler({
        message: 'Notification not found',
        statusCode: 400,
        req,
        res
      });
    } else {
      return SuccessHandler({
        data: notification,
        statusCode: 200,
        res
      });
    }
  } catch (error) {
    return ErrorHandler({
      message: (error as Error).message,
      statusCode: 500,
      req,
      res
    });
  }
};

const fetchNotificationForAdmin: RequestHandler = async (req, res) => {
  try {
    const notification = await Notification.find().populate({
      path: 'user',
      select: 'name email profilePic'
    });

    if (!notification) {
      return ErrorHandler({
        message: 'Notification not found',
        statusCode: 400,
        req,
        res
      });
    } else {
      return SuccessHandler({
        data: notification,
        statusCode: 200,
        res
      });
    }
  } catch (error) {
    return ErrorHandler({
      message: (error as Error).message,
      statusCode: 500,
      req,
      res
    });
  }
};

export { fetchNotification, updateSeenNotification, fetchNotificationForAdmin };
