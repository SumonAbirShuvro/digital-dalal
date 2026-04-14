const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const {
    initiatePayment,
    verifyPayment,
    handleWebhook,
    getPaymentStatus,
    getPaymentHistory
} = require('../controllers/paymentController');

router.post('/initiate', initiatePayment);
router.post('/verify', verifyPayment);
router.post('/webhook', handleWebhook);
router.get('/status/:invoiceId', getPaymentStatus);
router.get('/history', authMiddleware, getPaymentHistory);

module.exports = router;
