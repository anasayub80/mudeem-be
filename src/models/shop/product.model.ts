import mongoose from 'mongoose';
import { IProduct } from '../../types/models/shop';

const productSchema = new mongoose.Schema<IProduct>(
  {
    name: {
      type: String,
      required: true
    },
    name_ar: {
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
    // user: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: 'User',
    //   required: true
    // },
    greenPointsPerUnit: {
      type: Number,
      default: 0
    },
    rating: {
      stars: {
        type: Number,
        default: 0
      },
      total: {
        type: Number,
        default: 0
      }
    },
    reviews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Review'
      }
    ],
    stock: {
      type: Boolean,
      default: true
    },
    brand: {
      type: String,
      required: true
    },
    brand_ar: {
      type: String,
      required: true
    },
    featured: {
      type: Boolean,
      default: false
    },
    sold: {
      type: Number,
      default: 0
    },
    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Vendor',
      required: true
    }
  },
  { timestamps: true }
);

const Product = mongoose.model<IProduct>('Product', productSchema);
export default Product;
