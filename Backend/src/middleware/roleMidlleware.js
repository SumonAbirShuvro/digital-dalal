const { errorResponse } = require('C:/Users/USER/Desktop/SCST/Backend/src/utils/helpers');

const roleMiddleware = (...allowedRoles) => {
    return (req, res, next) => {
        try {
            if (!req.user) {
                return errorResponse(res, 401, 'Authentication required');
            }
            
            const userRole = req.user.role;
            
            if (!allowedRoles.includes(userRole)) {
                return errorResponse(
                    res, 
                    403, 
                    `Access denied. Required role: ${allowedRoles.join(' or ')}`
                );
            }
            
            next();
            
        } catch (error) {
            console.error('Role Middleware Error:', error);
            return errorResponse(res, 403, 'Access denied');
        }
    };
};

module.exports = roleMiddleware;