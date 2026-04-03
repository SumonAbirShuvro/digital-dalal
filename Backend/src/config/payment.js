const paymentConfig = {
    // payment config
    apiUrl: process.env.PAYMENT_API_URL || 'https://sandbox.uddoktapay.com/api/checkout-v2',
    apiKey: process.env.PAYMENT_API_KEY || '982d381360a69d419689740d9f2e26ce36fb7a50',
    apiSecret: process.env.PAYMENT_API_SECRET || '',
    merchantId: process.env.PAYMENT_MERCHANT_ID || '',

    // all urls
    callbackUrl: process.env.PAYMENT_CALLBACK_URL || 'http://localhost:5000/api/payment/callback',
    successUrl: process.env.PAYMENT_SUCCESS_URL || 'http://localhost:5173/payment/success',
    failUrl: process.env.PAYMENT_FAIL_URL || 'http://localhost:5173/payment/fail',
    cancelUrl: process.env.PAYMENT_CANCEL_URL || 'http://localhost:5173/payment/cancel',

    currency: process.env.PAYMENT_CURRENCY || 'BDT',

    sandbox: process.env.PAYMENT_SANDBOX === 'true',
    timeout: 30000,

    isConfigured() {
        return !!(this.apiUrl && this.apiKey);
    }
};

module.exports = paymentConfig;
