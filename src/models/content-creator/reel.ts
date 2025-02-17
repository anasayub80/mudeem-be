import mongoose from 'mongoose';
import { IReel } from '../../types/models/content-creator';

const reelSchema = new mongoose.Schema<IReel>({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  url: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  likes: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'User'
  },
  comments: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'ReelComment'
  }
});

const Reel = mongoose.model<IReel>('Reel', reelSchema);
export default Reel;
