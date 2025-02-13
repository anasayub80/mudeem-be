import mongoose from 'mongoose';
import { IJob } from '../../types/models/careers';

const jobSchema = new mongoose.Schema<IJob>(
  {
    title: {
      type: String,
      required: true
    },
    image: {
      type: String,
      required: true
    },
    location: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    salary: {
      type: Number,
      required: true
    },
    company: {
      type: String,
      required: true
    },
    linkedInUrl: {
      type: String,
      required: true
    },
    jobType: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
);

const Job = mongoose.model<IJob>('Job', jobSchema);
export default Job;
