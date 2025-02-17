import mongoose, { Document } from 'mongoose';

export interface IReel extends Document {
  user: mongoose.Schema.Types.ObjectId;
  url: string;
  description: string;
  likes: mongoose.Schema.Types.ObjectId[];
  comments: mongoose.Schema.Types.ObjectId[];
}
