

import { INotification } from 'types/models/notification';
import mongoose, { Model } from 'mongoose';



const notificationSchema = new mongoose.Schema<INotification>({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    points: {
        type: String,
    },
    content: {
        type: String,
        required: true
    },
    seen: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });


const Notification: Model<INotification> = mongoose.model('Notification', notificationSchema);
export default Notification;
