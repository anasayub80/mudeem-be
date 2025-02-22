import { RequestHandler } from "express";
import { Setting } from "../models/settings";
import ErrorHandler from "../utils/errorHandler";
import { ISettings } from "../types/models/settings";

const create: RequestHandler = async (req, res) => {
    try {

        await Setting.create(req.body);
        return res.status(201).json({
            success: true,
            message: "Setting created successfully"
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

const update: RequestHandler = async (req, res) => {
    try {
        const data = req.body as ISettings;
        const setting = await Setting.findOne();
        if(!setting){
            return res.status(404).json({
                success: false,
                message: "Setting not found"
            });
        }
        setting.logo = data.logo;
        setting.favIcon = data.favIcon;   
        setting.websiteName = data.websiteName;   
        setting.websiteDescription = data.websiteDescription;   
        setting.carPoolingGreenPoints = data.carPoolingGreenPoints;   
        setting.greenMapGreenPoints = data.greenMapGreenPoints;   
        setting.gptMessageGreenPoints = data.gptMessageGreenPoints;   
        return res.status(201).json({
            success: true,
            message: "Setting updated successfully"
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


export {
    create,
    update
}