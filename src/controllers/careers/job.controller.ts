import { RequestHandler } from 'express';
import ErrorHandler from '../../utils/errorHandler';
import mongoose from 'mongoose';
import SuccessHandler from '../../utils/successHandler';
import Job from '../../models/careers/job.model';
import uploadFile from '../../utils/upload';

const createJob: RequestHandler = async (req, res) => {
  // #swagger.tags = ['careers']
  try {
    const {
      title,
      location,
      description,
      salary,
      company,
      jobType,
      linkedInUrl
    } = req.body;
    // if (!title || !location || !description || !salary || !company || !jobType || !linkedInUrl) {
    //   return ErrorHandler({
    //     message: 'All fields are required',
    //     statusCode: 400,
    //     req,
    //     res
    //   });
    // }

    if (!req.file) {
      return ErrorHandler({
        message: 'Image is required',
        statusCode: 400,
        req,
        res
      });
    }

    // @ts-ignore
    const image = await uploadFile(req.file.buffer);

    const job = await Job.create({
      title,
      image: image.secure_url,
      location,
      description,
      salary,
      company,
      jobType,
      linkedInUrl
    });

    return SuccessHandler({
      res,
      data: job,
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

const getAllJobs: RequestHandler = async (req, res) => {
  // #swagger.tags = ['careers']
  try {
    const jobs = await Job.find();
    return SuccessHandler({
      res,
      data: jobs,
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

export { createJob, getAllJobs };
