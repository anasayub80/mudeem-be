import admin from "firebase-admin";
import serviceAccount from "../config/firebase-admin.json";
import Notification from "../models/notifications/notifications_model";
import mongoose from "mongoose";
import { log } from "console";

// Firebase Initialize 
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
});

const sentPushNotification = async (token: string, title: string, body: string, userId: string, points: string) => {
    console.log("Supposed to send not here", token);

    const message = {
        token: token,
        notification: {
            title: title,
            body: body,
        },
    };

    try {
        console.log("Storing push notification",);
        const response = await admin.messaging().send(message);
        if (response) {
            //   Notification.create({ 
            //     title: title,
            //     content: body,
            //     user: token
            // })
            Notification.create({
                user: new mongoose.Types.ObjectId(userId),
                title: title,
                content: body,
                points: points,
            });

        }
        return true;
    } catch (error) {
        console.log("Error sending push notification:", error);

        return false;
    }
};
export { sentPushNotification }