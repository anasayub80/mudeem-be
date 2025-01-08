import mongoose, { Document } from 'mongoose';

export interface IProject extends Document {
  user: mongoose.Schema.Types.ObjectId;
  title: string;
  status: string;
  description: string;
  documents: string[];
}
