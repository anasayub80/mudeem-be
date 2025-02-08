import mongoose from 'mongoose';
import { IComment } from 'types/models/collab-forum';

const reelCommentSchema = new mongoose.Schema<IComment>(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    content: {
      type: String,
      required: true
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    ],
    replies: [
      {
        type: mongoose.Schema.Types.ObjectId,
        reg: 'ReelComment'
      }
    ]
  },
  {
    timestamps: true
  }
);

const ReelComment = mongoose.model<IComment>('ReelComment', reelCommentSchema);
export default ReelComment;
