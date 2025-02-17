import mongoose from 'mongoose';
import { IChat } from '../../types/models/gpt';

const chatSchema = new mongoose.Schema<IChat>(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    messages: [
      {
        sender: {
          type: String,
          required: true
        },
        content: {
          type: String,
          required: true
        }
      }
    ],
    thread: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
);

const Chat = mongoose.model<IChat>('Chat', chatSchema);
export default Chat;
