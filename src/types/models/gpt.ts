import mongoose, { Document } from 'mongoose';

export interface IChat extends Document {
  user: mongoose.Schema.Types.ObjectId;
  messages: IMessage[];
}
export interface IMessage extends Document {
  sender: 'user' | 'bot';
  content: string;
}
