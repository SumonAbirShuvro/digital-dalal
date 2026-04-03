const paymentConfig = {
    apiUrl: process.env.UDDOKTAPAY_API_URL || 'https://sandbox.uddoktapay.com',
    apiKey: process.env.UDDOKTAPAY_API_KEY || '',
    redirectUrl: process.env.UDDOKTAPAY_REDIRECT_URL || 'http://localhost:5173/payment/success',
    cancelUrl: process.env.UDDOKTAPAY_CANCEL_URL || 'http://localhost:5173/payment/cancel',
    webhookUrl: process.env.UDDOKTAPAY_WEBHOOK_URL || 'http://localhost:5000/api/payment/webhook',
    currency: process.env.UDDOKTAPAY_CURRENCY || 'BDT',
    timeout: 30000,

    isConfigured() {
        return !!(this.apiUrl && this.apiKey);
    }
};

module.exports = paymentConfig;
