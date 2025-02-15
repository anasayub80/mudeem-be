import mongoose, { Document } from 'mongoose';

export interface IPool extends Document {
  pickupLocation: string;
  whereTo: string;
  time: string;
  availableSeats: number;
  user: mongoose.Schema.Types.ObjectId;
  droppedOffUsers: mongoose.Schema.Types.ObjectId[];
}
