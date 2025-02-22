import { RequestHandler } from "express";
import { Setting } from "../models/settings";
import ErrorHandler from "../utils/errorHandler";

const create: RequestHandler = async (req, res) => {
    try{
    
      await Setting.create(req.body);   
        return res.status(201).json({
            success: true,
            message: "Setting created successfully"
        });
    }catch(error){
        return ErrorHandler({
            message: (error as Error).message,
            statusCode: 500,
            req,
            res
        });
    }
}


export {
    create
}