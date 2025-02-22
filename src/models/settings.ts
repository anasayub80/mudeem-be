

// import { ISettings } from "../../models/settings";
import { ISettings } from "../types/models/settings";
import mongoose from "mongoose";


const settingSchema = new mongoose.Schema({
    logo: { type: String },
    favIcon: { type: String },
    websiteName: { type: String, default: "Mudeem" },
    websiteDescription: { type: String, default: "" },
    carPoolingGreenPoints: { type: Number, default: 0 },
    greenMapGreenPoints: { type: Number, default: 0 },
    gptMessageGreenPoints: { type: Number, default: 0 },
}, { timestamps: true });


const SettingSchema = mongoose.model<ISettings>("Setting", settingSchema);
