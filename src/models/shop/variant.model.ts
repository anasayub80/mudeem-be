import mongooose, { Model } from 'mongoose';
import { IVariant } from '../../types/models/shop';

const variantSchema = new mongooose.Schema<IVariant>({
  price: {
    type: Number,
    required: true
  },
  size: {
    type: String,
    required: true
  },
  color: {
    type: String,
    required: true
  },
  stock: {
    type: Number,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
});

const Variant: Model<IVariant> = mongooose.model('Variant', variantSchema);
export default Variant;
