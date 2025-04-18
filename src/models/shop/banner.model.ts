import mongoose, { Model } from 'mongoose';
import { IBanner } from '../../types/models/shop';

const bannerSchema = new mongoose.Schema<IBanner>(
  {
    name: {
      type: String,
      required: true
    },
    image: {
      type: String,
      required: true
    },
    isActive: {
      type: Boolean,
      default: true
    },
    type: {
      type: String,
      enum: ['shop', 'farm'],
      default: 'farm'
    }
  },
  { timestamps: true }
);

const Banner: Model<IBanner> = mongoose.model('Banner', bannerSchema);
export default Banner;
