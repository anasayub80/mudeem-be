import { IProject } from 'types/models/sustainable-innovation';
import mongoose from 'mongoose';
// import { IPost } from 'types/models/collab-forum';

const projectSchema = new mongoose.Schema<IProject>(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    title: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: ['requested', 'accepted', 'rejected'],
      default: 'requested'
    },
    description: {
      type: String,
      required: true
    },

    documents: [
      {
        type: String
      }
    ]
  },
  {
    timestamps: true
  }
);

const Project = mongoose.model<IProject>('Project', projectSchema);
export default Project;
