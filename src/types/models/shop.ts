import mongoose, { Document } from 'mongoose';

export interface ICategory extends Document {
  name: string;
  image: string;
  isActive: boolean;
}

export interface IVariant extends Document {
  name: string;
  price: number;
  sizes: {
    size: string;
    stock: number;
  };
  colors: {
    color: string;
    stock: number;
  };
  isActive: boolean;
}

export interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
  category: mongoose.Schema.Types.ObjectId;
  images: string[];
  variants: mongoose.Schema.Types.ObjectId[];
  isActive: boolean;
  user: mongoose.Schema.Types.ObjectId;
  reviews: mongoose.Schema.Types.ObjectId[];
  greenPointsPerUnit: number;
  rating: {
    stars: number;
    total: number;
  };
  stock: boolean;
  brand: string;
  featured: boolean;
  sold: number;
}

export interface IReview extends Document {
  rating: number;
  review: string;
  images: string[];
  user: mongoose.Schema.Types.ObjectId;
  product: mongoose.Schema.Types.ObjectId;
  order: mongoose.Schema.Types.ObjectId;
}
