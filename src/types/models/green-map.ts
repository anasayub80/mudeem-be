import { Document } from 'mongoose';

export interface IGreenMap extends Document {
  description: string;
  location: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  category: string;
  greenPointsPerTime: number;
}
