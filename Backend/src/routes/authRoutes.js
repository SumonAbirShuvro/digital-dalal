
const express = require('express');
const router = express.Router();
const { 
    register, 
    sendOTP,
    verifyOTP,
    login, 
    getMe, 
    updateProfile, 
    logout
} = require('C:/Users/USER/Desktop/SCST/Backend/src/Controllers/authController.js');
const authMiddleware = require('C:/Users/USER/Desktop/SCST/Backend/src/middleware/authMiddleware');


// Register
router.post('/register', register);

// Send OTP
router.post('/send-otp', sendOTP);

// Verify OTP
router.post('/verify-otp', verifyOTP);

// Login
router.post('/login', login);

// PROTECTED ROUTES (Require Authentication)

// Get current user
router.get('/me', authMiddleware, getMe);

// Update profile
router.put('/profile', authMiddleware, updateProfile);

// Logout
router.post('/logout', authMiddleware, logout);

module.exports = router;