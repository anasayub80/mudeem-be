import { RequestHandler } from 'express';
import { Setting } from '../models/settings';
import ErrorHandler from '../utils/errorHandler';
import { ISettings } from '../types/models/settings';
import uploadFile from '../utils/upload';
import SuccessHandler from '../utils/successHandler';

const create: RequestHandler = async (req, res) => {
  try {
    if (!req?.files) {
      return ErrorHandler({
        message: 'favicon and logo file is required',
        statusCode: 400,
        req,
        res
      });
    }
    console.log(req?.files);

    // @ts-ignore
    let favicon = await uploadFile(req.files.favIcon[0].buffer);
    // @ts-ignore
    let logo = await uploadFile(req.files.logo[0].buffer);

    await Setting.create({
      ...req.body,
      favIcon: favicon.secure_url,
      logo: logo.secure_url
    });
    return res.status(201).json({
      success: true,
      message: 'Setting created successfully'
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

const update: RequestHandler = async (req, res) => {
  try {
    const data = req.body;
    let favicon = { secure_url: '' };
    let logo = { secure_url: '' };
    console.log(req?.files);

    if (req?.files) {
      // @ts-ignore
      favicon = await uploadFile(req.files.favIcon[0].buffer);
      // @ts-ignore
      logo = await uploadFile(req.files.logo[0].buffer);
    }

    const setting = await Setting.findOne();
    if (!setting) {
      return res.status(404).json({
        success: false,
        message: 'Setting not found'
      });
    }
    console.log(data);

    setting.logo = logo.secure_url || data.logo;
    setting.favIcon = favicon.secure_url || data.favIcon;
    setting.websiteName = data.websiteName;
    setting.websiteDescription = data.websiteDescription;
    setting.carPoolingGreenPoints = data.carPoolingGreenPoints;
    setting.greenMapGreenPoints = data.greenMapGreenPoints;
    setting.gptMessageGreenPoints = data.gptMessageGreenPoints;
    await setting.save();
    return res.status(201).json({
      success: true,
      message: 'Setting updated successfully'
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

const get: RequestHandler = async (req, res) => {
  try {
    const setting = await Setting.findOne();
    if (!setting) {
      return res.status(404).json({
        success: false,
        message: 'Setting not found'
      });
    }

    return SuccessHandler({ res, data: setting, statusCode: 200 });
  } catch (error) {
    return ErrorHandler({
      message: (error as Error).message,
      statusCode: 500,
      req,
      res
    });
  }
};

export { create, update, get };
