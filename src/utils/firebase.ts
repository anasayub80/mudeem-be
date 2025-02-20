import admin from "firebase-admin";  
import serviceAccount from "../config/firebase-admin.json"; 

// Firebase Initialize 
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
});

const sentPushNotification = async (token: string, title: string, body: string) => {
    const message = {
        token: token,
        notification: {
            title: title,
            body: body,
            
        },
    };

    try {
        await admin.messaging().send(message);
        return true;
    } catch (error) {
        return false;
    }
};
export { sentPushNotification }