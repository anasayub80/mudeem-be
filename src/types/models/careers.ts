import { Document } from 'mongoose';

export interface IJob extends Document {
  title: string;
  image: string;
  location: string;
  description: string;
  salary: number;
  company: string;
  linkedInUrl: string;
  jobType: string;
}
