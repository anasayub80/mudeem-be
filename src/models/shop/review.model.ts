import mongoose from 'mongoose';
import { IReview } from '../../types/models/shop';

const reviewSchema = new mongoose.Schema<IReview>({
  rating: {
    type: Number,
    required: true
  },
  review: {
    type: String,
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true
  }
}, { timestamps: true });

const Review = mongoose.model<IReview>('Review', reviewSchema);
export default Review;
