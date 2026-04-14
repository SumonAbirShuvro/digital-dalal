const paymentConfig = {
   
    apiUrl:      process.env.UDDOKTAPAY_API_URL,
    apiKey:      process.env.UDDOKTAPAY_API_KEY,
    redirectUrl: process.env.UDDOKTAPAY_REDIRECT_URL,
    cancelUrl:   process.env.UDDOKTAPAY_CANCEL_URL,
    webhookUrl:  process.env.UDDOKTAPAY_WEBHOOK_URL,
    currency:    process.env.UDDOKTAPAY_CURRENCY || 'BDT',
    timeout: 30000,

    isConfigured() {
        return !!(this.apiUrl && this.apiKey);
    }
};

module.exports = paymentConfig;
