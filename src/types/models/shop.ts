import mongoose, { Document } from 'mongoose';
import { IAddress } from './user';

export interface IBanner extends Document {
  name: string;
  image: string;
  type: 'farm' | 'shop';
  isActive: boolean;
}

export interface ICategory extends Document {
  name: string;
  name_ar: string;
  image: string;
  isActive: boolean;
}

export interface IVariant extends Document {
  name: string;
  price: number;
  sizes: {
    size: string;
    stock: number;
  }[];
  colors: {
    color: string;
    stock: number;
  }[];
  isActive: boolean;
}

export interface IProduct extends Document {
  name: string;
  name_ar: string;
  description: string;
  description_ar: string;
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
  brand_ar: string;
  featured: boolean;
  sold: number;
  vendor: mongoose.Schema.Types.ObjectId;
}

export interface IReview extends Document {
  rating: number;
  review: string;
  user: mongoose.Schema.Types.ObjectId;
  product: mongoose.Schema.Types.ObjectId;
  order: mongoose.Schema.Types.ObjectId;
}

export interface IOrder extends Document {
  user: mongoose.Schema.Types.ObjectId;
  items: {
    product: IProduct;
    variant: IVariant;
    color: string;
    size: string;
    quantity: number;
  }[];
  totalAmount: number;
  deliveryCharge: number;
  address: IAddress;
  totalGreenPoints: number;
  status: string;
  vendor: mongoose.Schema.Types.ObjectId;
}
