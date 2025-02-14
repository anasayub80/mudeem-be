import { Document } from 'mongoose';

export interface IPool extends Document {
  pickupLocation: string;
  whereTo: string;
  time: string;
  availableSeats: number;
  user: string;
  droppedOffUsers: string[];
}
