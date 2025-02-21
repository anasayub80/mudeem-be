

// import { ISettings } from "../../models/settings";
import { ISettings } from "../types/models/settings";
import mongoose from "mongoose";


const settingSchema = new mongoose.Schema({
    logo: { type: String },
    favIcon: { type: String },
    websiteName: { type: String },
    websiteDescription: { type: String },
    carPoolingGreenPoints: { type: Number },
    greenMapGreenPoints: { type: Number },
    gptMessageGreenPoints: { type: Number }
}, { timestamps: true });


const SettingSchema = mongoose.model<ISettings>("Setting", settingSchema);
