import axios from 'axios';

interface VerificationResult {
    isValid: boolean;
    status: 'active' | 'cancelled' | 'expired' | 'pending';
    subscriptionId: string;
    startDate: Date;
    endDate: Date;
    autoRenew: boolean;
}

export const verifyAppleSubscription = async (
    receipt: string
): Promise<VerificationResult> => {
    try {
        // Use sandbox URL for testing, production URL for live app
        const verifyUrl = process.env.NODE_ENV === 'production'
            ? 'https://buy.itunes.apple.com/verifyReceipt'
            : 'https://sandbox.itunes.apple.com/verifyReceipt';

        const response = await axios.post(verifyUrl, {
            'receipt-data': receipt,
            password: process.env.APPLE_SHARED_SECRET,
            'exclude-old-transactions': true
        });

        const data = response.data;

        // Check if the receipt is valid
        if (data.status !== 0) {
            return {
                isValid: false,
                status: 'expired',
                subscriptionId: receipt,
                startDate: new Date(),
                endDate: new Date(),
                autoRenew: false
            };
        }

        // Get the latest subscription transaction
        const latestReceipt = data.latest_receipt_info?.[0];
        if (!latestReceipt) {
            return {
                isValid: false,
                status: 'expired',
                subscriptionId: receipt,
                startDate: new Date(),
                endDate: new Date(),
                autoRenew: false
            };
        }

        const now = new Date().getTime();
        const expiresDate = new Date(parseInt(latestReceipt.expires_date_ms)).getTime();
        const purchaseDate = new Date(parseInt(latestReceipt.purchase_date_ms));
        const isAutoRenewing = latestReceipt.is_trial_period === 'true' ||
            latestReceipt.auto_renew_status === 'true';

        let status: 'active' | 'cancelled' | 'expired' | 'pending' = 'pending';

        if (expiresDate < now) {
            status = 'expired';
        } else if (latestReceipt.cancellation_date) {
            status = 'cancelled';
        } else {
            status = 'active';
        }

        return {
            isValid: true,
            status,
            subscriptionId: latestReceipt.transaction_id,
            startDate: purchaseDate,
            endDate: new Date(expiresDate),
            autoRenew: isAutoRenewing
        };
    } catch (error) {
        console.error('Apple Store subscription verification error:', error);
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