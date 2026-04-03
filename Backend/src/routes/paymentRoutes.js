const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const {
    initiatePayment,
    verifyPayment,
    handleCallback,
    getPaymentStatus,
    getPaymentHistory,
} = require('../controllers/paymentController');


router.post('/initiate', initiatePayment);


router.post('/verify', verifyPayment);



router.post('/callback', handleCallback);


router.get('/status/:transactionId', getPaymentStatus);


router.get('/history', authMiddleware, getPaymentHistory);


module.exports = router;
