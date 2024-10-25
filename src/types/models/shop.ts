import mongoose, { Document } from 'mongoose';

export interface ICategory extends Document {
  name: string;
  image: string;
  isActive: boolean;
}

export interface IVariant extends Document {
  price: number;
  size: string;
  color: string;
  stock: number;
  isActive: boolean;
}

export interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
  category: mongoose.Schema.Types.ObjectId;
  images: string;
  variants: mongoose.Schema.Types.ObjectId;
  isActive: boolean;
}
