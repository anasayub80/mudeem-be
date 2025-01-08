import mongoose from 'mongoose';
import { Document } from 'mongoose';
import { IEvent } from '../../types/models/user';

const eventSchema = new mongoose.Schema<IEvent>({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  dateTime: {
    type: Date,
    required: true
  }
});

const Event = mongoose.model<IEvent>('Event', eventSchema);
export default Event;
