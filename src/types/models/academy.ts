import { Document } from 'mongoose';

export interface IBook extends Document {
  title: string;
  author: string;
  description: string;
  pages: number;
  thumbnail: string;
  language: string;
  year: number;
  price: number;
  content: string;
  type: 'new' | 'popular';
  greenPoints: number;
}
