import { Document, Schema, model } from 'mongoose';

export interface ICompany extends Document {
  name: string;
  location: string;
  contact: string;
  email: string;
  website: string;
  description: string;
  isActive: boolean;
}
