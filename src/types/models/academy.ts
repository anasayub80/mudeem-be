import { Document } from 'mongoose';

export interface IBook extends Document {
  title: string;
  title_ar: string;
  author: string;
  author_ar: string;
  description: string;
  description_ar: string;
  pages: number;
  thumbnail: string;
  language: string;
  year: number;
  price: number;
  content: string;
  type: 'new' | 'popular';
  greenPoints: number;
}
