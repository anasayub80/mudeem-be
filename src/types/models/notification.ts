

import mongoose, { Document } from 'mongoose';

export interface INotification extends Document {
    user: mongoose.Schema.Types.ObjectId;
    title: string;
    points: string;
    content: string;
    seen: boolean;
}