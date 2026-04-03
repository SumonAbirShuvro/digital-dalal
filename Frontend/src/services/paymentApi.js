import api from './api';

const initiatePayment = async (paymentData) => {
    try {
        const response = await api.post('/payment/initiate', paymentData);
        return response;
    } catch (error) {
        console.error('Initiate payment failed:', error);
        throw error.response?.data || { error: 'Payment initiation failed' };
    }
};

const verifyPayment = async (invoice_id) => {
    try {
        const response = await api.post('/payment/verify', { invoice_id });
        return response;
    } catch (error) {
        console.error('Verify payment failed:', error);
        throw error.response?.data || { error: 'Payment verification failed' };
    }
};

const getPaymentStatus = async (invoiceId) => {
    try {
        const response = await api.get(`/payment/status/${invoiceId}`);
        return response;
    } catch (error) {
        console.error('Get payment status failed:', error);
        throw error.response?.data || { error: 'Failed to fetch payment status' };
    }
};

const getPaymentHistory = async (page = 1, limit = 10) => {
    try {
        const response = await api.get('/payment/history', {
            params: { page, limit }
        });
        return response;
    } catch (error) {
        console.error('Get payment history failed:', error);
        throw error.response?.data || { error: 'Failed to fetch payment history' };
    }
};

const payNow = async (paymentData) => {
    const result = await initiatePayment(paymentData);

    if (result.success && result.data?.paymentUrl) {
        sessionStorage.setItem('uddokta_invoice_id', result.data.invoiceId);
        window.location.href = result.data.paymentUrl;
        return result.data.invoiceId;
    } else {
        throw new Error(result.error || 'Failed to initiate payment');
    }
};

export {
    initiatePayment,
    verifyPayment,
    getPaymentStatus,
    getPaymentHistory,
    payNow
};
