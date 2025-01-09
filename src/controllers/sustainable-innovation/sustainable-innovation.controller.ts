import { RequestHandler } from 'express';
import ErrorHandler from '../../utils/errorHandler';

import SuccessHandler from '../../utils/successHandler';
import Project from '../../models/sustainable-innovation/project';
import User from '../../models/User/user.model';

const createProject: RequestHandler = async (req, res) => {
  // #swagger.tags = ['sustainble-innovation']
  try {
    const { title, description } = req.body;
    const user = req.user;

    const project = await Project.create({
      user: user?._id,
      title,
      description
      // images: urls || []
      // images: images
    });

    return SuccessHandler({
      res,
      data: project,
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

const getAllProjects: RequestHandler = async (req, res) => {
  // #swagger.tags = ['sustainble-innovation']
  try {
    const { page = 0, limit = 10 } = req.query;
    const skip = Number(page) * Number(limit);

    const project = await Project.aggregate([
      {
        $facet: {
          totalDocs: [
            {
              $count: 'count'
            }
          ],
          projects: [
            {
              $lookup: {
                from: 'user',
                localField: '_id',
                foreignField: 'user',
                as: 'user'
              }
            },
            {
              $unwind: '$user'
            },
            {
              $skip: skip
            },
            {
              $limit: Number(limit)
            },
            {
              $sort: {
                createdAt: -1
              }
            }
          ]
        }
      }
    ]);

    return SuccessHandler({
      res,
      data: project,
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

const getSingleProject: RequestHandler = async (req, res) => {
  // #swagger.tags = ['sustainble-innovation']
  try {
    const { id } = req.params;
    const project = await Project.findById(id).populate('user');

    return SuccessHandler({
      res,
      data: project,
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

const changeProjectStatus: RequestHandler = async (req, res) => {
  // #swagger.tags = ['sustainble-innovation']

  try {
    const { id } = req.params;
    const { points = 0, status = 'requested' } = req.body;

    const project = await Project.findById(id).populate('user', 'name email');

    if (!project) {
      return ErrorHandler({
        message: 'Posts not found',
        statusCode: 404,
        req,
        res
      });
    }
    project.status = String(status);
    await project.save();

    const user = await User.findById(project?.user);
    if (!user) {
      return ErrorHandler({
        message: 'User not found',
        statusCode: 404,
        req,
        res
      });
    }
    user.greenPoints =
      status === 'accepted'
        ? user.greenPoints + Number(points)
        : user.greenPoints;
    await user.save();
    return SuccessHandler({
      res,
      data: project,
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

export { createProject, getAllProjects, getSingleProject, changeProjectStatus };
