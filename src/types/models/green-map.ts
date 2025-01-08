import { Document } from 'mongoose';

export interface IGreenMap extends Document {
  name: string;
  description: string;
  location: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  category: string;
  greenPointsPerTime: number;
  timeLimit: number;
}
