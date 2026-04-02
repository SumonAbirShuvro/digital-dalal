const jwt = require('jsonwebtoken');

// Validation Functions

// Mobile number validation (Bangladesh)
function isValidMobile(mobile) {
    const regex = /^01[3-9]\d{8}$/;
    return regex.test(mobile);
}

// Email validation
function isValidEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

// Password strength check
function isStrongPassword(password) {
    return password && password.length >= 6;
}

// Division validation
function isValidDivision(division) {
    const validDivisions = [
        'Dhaka', 'Chittagong', 'Rajshahi', 'Khulna', 
        'Barisal', 'Sylhet', 'Rangpur', 'Mymensingh'
    ];
    return validDivisions.includes(division);
}

// Token Functions


function generateToken(payload) {
    return jwt.sign(
        payload,
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );
}

function verifyToken(token) {
    try {
        return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
        return null;
    }
}

// Response Formatters


function successResponse(res, statusCode, message, data = null) {
    const response = {
        success: true,
        message: message
    };
    
    if (data) {
        response.data = data;
    }
    
    return res.status(statusCode).json(response);
}

function errorResponse(res, statusCode, message, error = null) {
    const response = {
        success: false,
        error: message
    };
    
    if (error && process.env.NODE_ENV === 'development') {
        response.details = error;
    }
    
    return res.status(statusCode).json(response);
}

module.exports = {
    isValidMobile,
    isValidEmail,
    isStrongPassword,
    isValidDivision,
    generateToken,
    verifyToken,
    successResponse,
    errorResponse
};