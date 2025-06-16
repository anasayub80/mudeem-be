import { google } from 'googleapis';
import { JWT } from 'google-auth-library';

interface VerificationResult {
    isValid: boolean;
    status: 'active' | 'cancelled' | 'expired' | 'pending';
    subscriptionId: string;
    startDate: Date;
    endDate: Date;
    autoRenew: boolean;
}

export const verifyGooglePlaySubscription = async (
    receipt: string
): Promise<VerificationResult> => {
    try {
        // Initialize Google Play Developer API client
        const auth = new JWT({
            email: process.env.GOOGLE_PLAY_SERVICE_ACCOUNT_EMAIL,
            key: process.env.GOOGLE_PLAY_PRIVATE_KEY?.replace(/\\n/g, '\n'),
            scopes: ['https://www.googleapis.com/auth/androidpublisher']
        });

        const androidPublisher = google.androidpublisher({
            version: 'v3',
            auth
        });

        // Verify the subscription
        const response = await androidPublisher.purchases.subscriptions.get({
            packageName: process.env.GOOGLE_PLAY_PACKAGE_NAME || '',
            subscriptionId: receipt,
            token: receipt
        });

        const subscription = response.data;

        // Check subscription status
        const now = new Date().getTime();
        const expiryTime = parseInt(subscription.expiryTimeMillis || '0');
        const startTime = parseInt(subscription.startTimeMillis || '0');
        const autoRenewing = subscription.autoRenewing || false;

        let status: 'active' | 'cancelled' | 'expired' | 'pending' = 'pending';

        if (subscription.cancelReason) {
            status = 'cancelled';
        } else if (expiryTime < now) {
            status = 'expired';
        } else if (subscription.paymentState === 1) {
            status = 'active';
        }

        return {
            isValid: true,
            status,
            subscriptionId: receipt,
            startDate: new Date(startTime),
            endDate: new Date(expiryTime),
            autoRenew: autoRenewing
        };
    } catch (error) {
        console.error('Google Play subscription verification error:', error);
        return {
            isValid: false,
            status: 'expired',
            subscriptionId: receipt,
            startDate: new Date(),
            endDate: new Date(),
            autoRenew: false
        };
    }
}; 