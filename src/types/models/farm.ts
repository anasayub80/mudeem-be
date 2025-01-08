import mongoose, { Document } from 'mongoose';

export interface IFarm extends Document {
  user: mongoose.Schema.Types.ObjectId;
  location: string;
  renewableEnergy: string;
  fertilizer: string;
  desalinationMethod: string;
  farmDesignSpecs: string;
  desiredEquipment: string;
  budgetDetails: string;
  electricGeneration: string;
  images: string[];
  status: string;
}
