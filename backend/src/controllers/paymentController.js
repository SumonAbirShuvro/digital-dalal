const axios = require('axios');
const paymentConfig = require('../config/payment');
const db = require('../config/database');

function generateInvoiceId() {
    const timestamp = Date.now().toString(36).toUpperCase(); 
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `INV-${timestamp}-${random}`;
}

const initiatePayment = async (req, res) => {
    try {
        if (!paymentConfig.isConfigured()) {
            return res.status(500).json({
                success: false,
                error: 'Payment gateway is not configured. Contact admin.'
            });
        }

        const {
            amount,
            serviceName,
            customerName,
            customerMobile,
            customerEmail,
            userId,
            appId       
        } = req.body;

        if (!amount || !customerName || !customerMobile) {
            return res.status(400).json({
                success: false,
                error: 'Amount, customer name, and mobile number are required.'
            });
        }

        if (parseFloat(amount) <= 0) {
            return res.status(400).json({
                success: false,
                error: 'Amount must be greater than zero.'
            });
        }

        const invoiceId = generateInvoiceId();

        const payload = {
            full_name: customerName,
            email: customerEmail || '',
            amount: parseFloat(amount),
            metadata: {
                invoice_id: invoiceId,
                user_id: userId || null,
                service_name: serviceName || 'Service Payment',
                customer_mobile: customerMobile
            },
            redirect_url: paymentConfig.redirectUrl,
            cancel_url: paymentConfig.cancelUrl,
            webhook_url: paymentConfig.webhookUrl
        };

        const gatewayResponse = await axios.post(
            `${paymentConfig.apiUrl}/api/checkout-v2`,
            payload,
            {
                headers: {
                    'RT-UDDOKTAPAY-API-KEY': paymentConfig.apiKey,
                    'accept': 'application/json',
                    'content-type': 'application/json'
                },
                timeout: paymentConfig.timeout
            }
        );

        
        console.log('Status:', gatewayResponse.status);
        console.log('Data:', JSON.stringify(gatewayResponse.data, null, 2));

        if (gatewayResponse.data.status !== true || !gatewayResponse.data.payment_url) {
            return res.status(502).json({
                success: false,
                error: 'Failed to generate payment URL from gateway.',
                debug: gatewayResponse.data
            });
        }

        await db.query(
            `INSERT INTO payments 
                (app_id, invoice_id, user_id, amount, currency, service_name, 
                 customer_name, customer_mobile, customer_email, 
                 payment_status, gateway_response, created_at)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', ?, NOW())`,
            [
                appId || null,
                invoiceId,
                userId || null,
                parseFloat(amount),
                paymentConfig.currency,
                serviceName || 'Service Payment',
                customerName,
                customerMobile,
                customerEmail || null,
                JSON.stringify(gatewayResponse.data)
            ]
        );

        res.json({
            success: true,
            message: 'Payment initiated successfully.',
            data: {
                invoiceId,
                amount: parseFloat(amount),
                currency: paymentConfig.currency,
                paymentUrl: gatewayResponse.data.payment_url
            }
        });

    } catch (error) {
        console.error('Initiate payment error:', error.message);
        if (error.response) {
            console.error('HTTP Status:', error.response.status);
            console.error('Response:', JSON.stringify(error.response.data, null, 2));
            console.error('Request URL:', error.config?.url);
            console.error('Request Body:', error.config?.data);
        }
        res.status(500).json({
            success: false,
            error: 'Failed to initiate payment. Please try again.'
        });
    }
};

const verifyPayment = async (req, res) => {
    try {
        const { invoice_id } = req.body;

        if (!invoice_id) {
            return res.status(400).json({
                success: false,
                error: 'Invoice ID is required.'
            });
        }

        const [payments] = await db.query(
            'SELECT * FROM payments WHERE invoice_id = ?',
            [invoice_id]
        );

        if (payments.length === 0) {
            return res.status(404).json({
                success: false,
                error: 'Transaction not found.'
            });
        }

        const payment = payments[0];

        if (payment.payment_status === 'paid') {
            return res.json({
                success: true,
                message: 'Payment already verified.',
                data: {
                    invoiceId: payment.invoice_id,
                    status: payment.payment_status,
                    amount: payment.amount,
                    verifiedAt: payment.verified_at
                }
            });
        }

        const gatewayResponse = await axios.post(
            `${paymentConfig.apiUrl}/api/verify-payment`,
            { invoice_id },
            {
                headers: {
                    'RT-UDDOKTAPAY-API-KEY': paymentConfig.apiKey,
                    'accept': 'application/json',
                    'content-type': 'application/json'
                },
                timeout: paymentConfig.timeout
            }
        );

        const verificationData = gatewayResponse.data;

        if (verificationData.status === true || verificationData.payment_status === 'Completed' || verificationData.payment_status === 'completed') {
            await db.query(
                `UPDATE payments 
                 SET payment_status = 'paid', 
                     verified_at = NOW(), 
                     gateway_response = ? 
                 WHERE invoice_id = ?`,
                [JSON.stringify(verificationData), invoice_id]
            );

            await db.query(
                `INSERT INTO audit_logs (user_id, action, details) 
                 VALUES (?, 'payment_paid', ?)`,
                [
                    payment.user_id,
                    JSON.stringify({
                        invoice_id,
                        amount: payment.amount,
                        timestamp: new Date()
                    })
                ]
            );
        }

        const [updated] = await db.query(
            'SELECT * FROM payments WHERE invoice_id = ?',
            [invoice_id]
        );

        res.json({
            success: true,
            data: {
                invoiceId: updated[0].invoice_id,
                status: updated[0].payment_status,
                amount: updated[0].amount,
                currency: updated[0].currency,
                serviceName: updated[0].service_name,
                createdAt: updated[0].created_at,
                verifiedAt: updated[0].verified_at,
                gatewayData: verificationData
            }
        });

    } catch (error) {
        console.error('Verify payment error:', error.message);
        res.status(500).json({
            success: false,
            error: 'Failed to verify payment.'
        });
    }
};

const handleWebhook = async (req, res) => {
    try {
        const headerApiKey = req.headers['rt-uddoktapay-api-key'] || req.headers['uddoktapay-api-key'];

        if (headerApiKey !== paymentConfig.apiKey) {
            return res.status(403).json({ success: false, error: 'Invalid API key' });
        }

        const webhookData = req.body;
        console.log('Payment webhook received:', webhookData);

        const invoiceId = webhookData.invoice_id;

        if (!invoiceId) {
            return res.status(400).json({ success: false, error: 'Missing invoice ID' });
        }

        const [payments] = await db.query(
            'SELECT * FROM payments WHERE invoice_id = ?',
            [invoiceId]
        );

        if (payments.length === 0) {
            return res.status(404).json({ success: false, error: 'Transaction not found' });
        }

        const payment = payments[0];

        let newStatus = 'pending';
        const statusRaw = (webhookData.status || webhookData.payment_status || '').toString().toLowerCase();

        if (['completed', 'paid', 'success', 'confirmed'].includes(statusRaw)) {
            newStatus = 'paid';
        } else if (['failed', 'expired', 'cancelled', 'declined', 'rejected'].includes(statusRaw)) {
            newStatus = 'failed';
        }

        if (payment.payment_status !== newStatus) {
            await db.query(
                `UPDATE payments 
                 SET payment_status = ?, 
                     gateway_response = ?,
                     verified_at = CASE WHEN ? = 'paid' THEN NOW() ELSE verified_at END
                 WHERE invoice_id = ?`,
                [newStatus, JSON.stringify(webhookData), newStatus, invoiceId]
            );

            await db.query(
                `INSERT INTO audit_logs (user_id, action, details) 
                 VALUES (?, 'payment_webhook', ?)`,
                [
                    payment.user_id,
                    JSON.stringify({
                        invoice_id: invoiceId,
                        amount: payment.amount,
                        status: newStatus,
                        raw_status: webhookData.status || webhookData.payment_status,
                        timestamp: new Date()
                    })
                ]
            );
        }

        res.json({ success: true, message: 'Webhook received' });

    } catch (error) {
        console.error('Payment webhook error:', error.message);
        res.status(500).json({ success: false, error: 'Webhook processing failed' });
    }
};

const getPaymentStatus = async (req, res) => {
    try {
        const { invoiceId } = req.params;

        if (!invoiceId) {
            return res.status(400).json({
                success: false,
                error: 'Invoice ID is required.'
            });
        }

        const [payments] = await db.query(
            'SELECT invoice_id, amount, currency, service_name, payment_status, created_at, verified_at FROM payments WHERE invoice_id = ?',
            [invoiceId]
        );

        if (payments.length === 0) {
            return res.status(404).json({
                success: false,
                error: 'Transaction not found.'
            });
        }

        res.json({
            success: true,
            data: payments[0]
        });

    } catch (error) {
        console.error('Get payment status error:', error.message);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch payment status.'
        });
    }
};

const getPaymentHistory = async (req, res) => {
    try {
        const userId = req.user?.userId;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;

        const [payments] = await db.query(
            `SELECT invoice_id, amount, currency, service_name, payment_status, created_at, verified_at 
             FROM payments 
             WHERE user_id = ? 
             ORDER BY created_at DESC 
             LIMIT ? OFFSET ?`,
            [userId, limit, offset]
        );

        const [totalResult] = await db.query(
            'SELECT COUNT(*) as total FROM payments WHERE user_id = ?',
            [userId]
        );

        res.json({
            success: true,
            data: {
                payments,
                pagination: {
                    page,
                    limit,
                    total: totalResult[0].total,
                    totalPages: Math.ceil(totalResult[0].total / limit)
                }
            }
        });

    } catch (error) {
        console.error('Payment history error:', error.message);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch payment history.'
        });
    }
};

module.exports = {
    initiatePayment,
    verifyPayment,
    handleWebhook,
    getPaymentStatus,
    getPaymentHistory
};
