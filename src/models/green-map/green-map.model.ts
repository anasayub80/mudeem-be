import mongoose from 'mongoose';
import { IGreenMap } from 'types/models/green-map';

const greenMapSchema = new mongoose.Schema<IGreenMap>(
  {
    name: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    location: {
      type: String,
      required: true
    },
    coordinates: {
      lat: {
        type: Number,
        required: true
      },
      lng: {
        type: Number,
        required: true
      }
    },
    category: {
      type: String,
      required: true
    },
    greenPointsPerTime: {
      type: Number,
      required: true
    },
    timeLimit: {
      type: Number,
      required: true
    }
  },
  {
    timestamps: true
  }
);

const GreenMap = mongoose.model<IGreenMap>('GreenMap', greenMapSchema);
export default GreenMap;