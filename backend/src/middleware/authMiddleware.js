const { verifyToken, errorResponse } = require('../utils/helpers');

const authMiddleware = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        
        if (!authHeader) {
            return errorResponse(res, 401, 'Access denied. No token provided');
        }
        
        const parts = authHeader.split(' ');
        
        if (parts.length !== 2 || parts[0] !== 'Bearer') {
            return errorResponse(res, 401, 'Invalid token format. Use: Bearer <token>');
        }
        
        const token = parts[1];
        const decoded = verifyToken(token);
        
        if (!decoded) {
            return errorResponse(res, 401, 'Invalid or expired token');
        }
        
        req.user = {
            userId: decoded.userId,
            mobile: decoded.mobile,
            role: decoded.role
        };
        
        next();
        
    } catch (error) {
        console.error('Auth Middleware Error:', error);
        return errorResponse(res, 401, 'Authentication failed');
    }
};

module.exports = authMiddleware;