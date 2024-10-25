import s3 from '../config/aws.config';
import { Request, Response } from 'express';
import ErrorHandler from './errorHandler';

const uploadFile = async (files: Express.Multer.File[]) => {
  try {
    if (files.length > 0) {
      return await Promise.all(
        files.map(async (file) => {
          const params = {
            Bucket: process.env.AWS_BUCKET_NAME || '',
            Key: `${Date.now()}-${file.originalname}`,
            Body: file.buffer,
            ContentType: file.mimetype,
            ACL: 'public-read'
          };
          await s3.upload(params).promise();
          const url = `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${params.Key}`;
          return url;
        })
      );
    }
    return [];
  } catch (error) {
    console.log(error);
    return [];
  }
};

const deleteFile = async (url: string, req: Request, res: Response) => {
  try {
    const key = url.split('.com/')[1];
    const params = {
      Bucket: process.env.AWS_BUCKET_NAME || '',
      Key: key
    };
    await s3.deleteObject(params).promise();
    return true;
  } catch (error) {
    return ErrorHandler({
      message: (error as Error).message,
      statusCode: 500,
      req,
      res
    });
  }
};

export { uploadFile, deleteFile };
