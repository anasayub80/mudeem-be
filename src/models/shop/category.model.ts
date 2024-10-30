import mongoose, { Model } from 'mongoose';
import { ICategory } from '../../types/models/shop';

const categorySchema = new mongoose.Schema<ICategory>({
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
  }
}, { timestamps: true });

const Category: Model<ICategory> = mongoose.model('Category', categorySchema);
export default Category;
