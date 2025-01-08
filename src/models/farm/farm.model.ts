import mongoose from 'mongoose';
import { IFarm } from '../../types/models/farm';

const farmSchema = new mongoose.Schema<IFarm>(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    location: {
      type: String,
      required: true
    },
    renewableEnergy: {
      type: String,
      required: true
    },
    fertilizer: {
      type: String,
      required: true
    },
    desalinationMethod: {
      type: String,
      required: true
    },
    farmDesignSpecs: {
      type: String,
      required: true
    },
    desiredEquipment: {
      type: String,
      required: true
    },
    budgetDetails: {
      type: String,
      required: true
    },
    electricGeneration: {
      type: String,
      required: true
    },
    images: {
      type: [String],
      required: true
    },
    status: {
      type: String,
      default: 'pending'
    }
  },
  { timestamps: true }
);

const Farm = mongoose.model<IFarm>('Farm', farmSchema);
export default Farm;
