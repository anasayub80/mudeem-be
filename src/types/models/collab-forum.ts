import mongoose, { Document } from 'mongoose';

export interface IPost extends Document {
  user: mongoose.Schema.Types.ObjectId;
  content: string;
  status: string;
  images: string[];
  likes: mongoose.Schema.Types.ObjectId[];
  comments: mongoose.Schema.Types.ObjectId[];
}

export interface IComment extends Document {
  user: mongoose.Schema.Types.ObjectId;
  content: string;
  likes: mongoose.Schema.Types.ObjectId[];
  replies: mongoose.Schema.Types.ObjectId[];
}
