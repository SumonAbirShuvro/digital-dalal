const express    = require('express');
const router     = express.Router();
const auth       = require('../middleware/authMiddleware');
const {
    getNotifications,
    markAsRead,
    markAllAsRead
} = require('../controllers/notificationController');

// All routes require login
router.get('/',                auth, getNotifications);
router.patch('/read-all',      auth, markAllAsRead);
router.patch('/:id/read',      auth, markAsRead);

module.exports = router;
