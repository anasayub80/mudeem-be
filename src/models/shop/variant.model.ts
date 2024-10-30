import mongooose, { Model } from 'mongoose';
import { IVariant } from '../../types/models/shop';

const variantSchema = new mongooose.Schema<IVariant>({
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  sizes: [
    {
      size: {
        type: String,
        required: true
      },
      stock: {
        type: Number,
        default: 0
      }
    }
  ],
  colors: [
    {
      color: {
        type: String,
        required: true
      },
      stock: {
        type: Number,
        default: 0
      }
    }
  ],
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

const Variant: Model<IVariant> = mongooose.model('Variant', variantSchema);
export default Variant;
