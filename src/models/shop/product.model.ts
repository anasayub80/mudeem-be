import mongoose from 'mongoose';
import { IProduct } from '../../types/models/shop';

const productSchema = new mongoose.Schema<IProduct>({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  images: [
    {
      type: String
    }
  ],
  variants: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Variant'
    }
  ],
  isActive: {
    type: Boolean,
    default: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  greenPointsPerUnit: {
    type: Number,
    default: 0
  }
});

const Product = mongoose.model<IProduct>('Product', productSchema);
export default Product;
