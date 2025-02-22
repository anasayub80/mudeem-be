import { ISettings } from "../types/models/settings";
import mongoose, { Model } from "mongoose";


const settingSchema = new mongoose.Schema<ISettings>({
    logo: { type: String },
    favIcon: { type: String },
    websiteName: { type: String, default: "Mudeem" },
    websiteDescription: { type: String, default: "" },
    carPoolingGreenPoints: { type: Number, default: 0 },
    greenMapGreenPoints: { type: Number, default: 0 },
    gptMessageGreenPoints: { type: Number, default: 0 },
}, { timestamps: true });


export const Setting: Model<ISettings> = mongoose.model<ISettings>("Setting", settingSchema);
