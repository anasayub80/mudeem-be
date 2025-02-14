import mongoose from 'mongoose';
import { IPool } from '../../types/models/carpooling';

const poolSchema = new mongoose.Schema<IPool>(
  {
    
  },
  {
    timestamps: true
  }
);

const Pool = mongoose.model<IPool>('Pool', poolSchema);
export default Pool;
