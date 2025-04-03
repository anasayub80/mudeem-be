import mongoose from 'mongoose';
import { IBook } from '../../types/models/academy';

const bookSchema = new mongoose.Schema<IBook>(
  {
    title: {
      type: String,
      required: true
    },
    title_ar: {
      type: String,
      required: true
    },
    author: {
      type: String,
      required: true
    },
    author_ar: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    description_ar: {
      type: String,
      required: true
    },
   
    pages: {
      type: Number,
      required: true
    },
    thumbnail: {
      type: String,
      required: true
    },
    language: {
      type: String,
      required: true
    },
    year: {
      type: Number,
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    content: {
      type: String,
      required: true
    },
    type: {
      type: String,
      required: true,
      enum: ['new', 'popular']
    },
    greenPoints: {
      type: Number,
      required: true
    }
  },
  {
    timestamps: true
  }
);

const Book = mongoose.model<IBook>('Book', bookSchema);
export default Book;
