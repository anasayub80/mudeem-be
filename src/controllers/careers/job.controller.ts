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

    // if (!req.file) {
    //   return ErrorHandler({
    //     message: 'Image is required',
    //     statusCode: 400,
    //     req,
    //     res
    //   });
    // }

    // @ts-ignore
    // const image = await uploadFile(req.file.buffer);

    const job = await Job.create({
      title,
      // image: image.secure_url,
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

const updateJob: RequestHandler = async (req, res) => {
  try {
    const { id } = req?.params;
    const { title, location, description, salary, company, linkedInUrl } =
      req.body;

    const isJobExist = await Job.findById(id);

    if (!isJobExist) {
      return ErrorHandler({
        message: 'Job not found',
        statusCode: 404,
        req,
        res
      });
    }

    isJobExist.title = title || isJobExist.title;
    isJobExist.company = company || isJobExist.company;
    isJobExist.location = location || isJobExist.location;
    isJobExist.salary = salary || isJobExist.salary;
    isJobExist.description = description || isJobExist.description;
    isJobExist.linkedInUrl = linkedInUrl || isJobExist.linkedInUrl;

    await isJobExist.save();

    return SuccessHandler({
      res,
      data: isJobExist,
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

const deleteJob: RequestHandler = async (req, res) => {
  try {
    const { id } = req?.params;
    const isJobExist = await Job.findById(id);

    if (!isJobExist) {
      return ErrorHandler({
        message: 'Job not found',
        statusCode: 404,
        req,
        res
      });
    }

    await isJobExist.delete();
    return SuccessHandler({
      res,
      data: isJobExist,
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
export { createJob, getAllJobs, updateJob, deleteJob };
