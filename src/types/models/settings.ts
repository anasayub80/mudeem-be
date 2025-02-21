import { Document } from 'mongoose';

export interface ISettings extends Document {
    logo: String;
    favIcon: String;
    websiteName: String;
    websiteDescription: String;
    carPoolingGreenPoints: Number;
    greenMapGreenPoints: Number;
    gptMessageGreenPoints: Number;
}

