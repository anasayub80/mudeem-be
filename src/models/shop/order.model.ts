import mongoose from 'mongoose';
import { IOrder } from '../../types/models/shop';

const order = new mongoose.Schema<IOrder>(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: true
        },
        variant: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Variant',
          required: true
        },
        color: {
          type: String,
          required: true
        },
        size: {
          type: String,
          required: true
        },
        quantity: {
          type: Number,
          required: true
        }
      }
    ],
    totalAmount: {
      type: Number,
      required: true
    },
    status: {
      type: String,
      enum: ['confirmed', 'shipped', 'delivered'],
      required: true
    },
    deliveryCharge: {
      type: Number,
      required: true
    },
    address: {
      type: Object,
      required: true
    },
    totalGreenPoints: {
      type: Number,
      required: true
    },
    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  { timestamps: true }
);

const Order = mongoose.model('Order', order);
export default Order;
