const db = require('../config/database');

// ============================================================
// GET USER NOTIFICATIONS
// GET /api/notifications
// ============================================================
const getNotifications = async (req, res) => {
    try {
        const userId = req.user.userId;

        const [notifications] = await db.query(
            `SELECT notif_id, app_id, title, message, type, is_read, sent_at
             FROM notifications
             WHERE user_id = ?
             ORDER BY sent_at DESC
             LIMIT 20`,
            [userId]
        );

        const unreadCount = notifications.filter(n => !n.is_read).length;

        res.json({
            success: true,
            data: { notifications, unreadCount }
        });

    } catch (error) {
        console.error('Get notifications error:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch notifications' });
    }
};

// ============================================================
// MARK NOTIFICATION AS READ
// PATCH /api/notifications/:id/read
// ============================================================
const markAsRead = async (req, res) => {
    try {
        const userId   = req.user.userId;
        const { id }   = req.params;

        await db.query(
            `UPDATE notifications
             SET is_read = TRUE, read_at = NOW()
             WHERE notif_id = ? AND user_id = ?`,
            [id, userId]
        );

        res.json({ success: true, message: 'Marked as read' });

    } catch (error) {
        console.error('Mark as read error:', error);
        res.status(500).json({ success: false, error: 'Failed to mark as read' });
    }
};

// ============================================================
// MARK ALL AS READ
// PATCH /api/notifications/read-all
// ============================================================
const markAllAsRead = async (req, res) => {
    try {
        const userId = req.user.userId;

        await db.query(
            `UPDATE notifications
             SET is_read = TRUE, read_at = NOW()
             WHERE user_id = ? AND is_read = FALSE`,
            [userId]
        );

        res.json({ success: true, message: 'All marked as read' });

    } catch (error) {
        console.error('Mark all as read error:', error);
        res.status(500).json({ success: false, error: 'Failed to mark all as read' });
    }
};

// ============================================================
// INTERNAL HELPER — Create notification in DB
// Used by applicationController when status changes
// ============================================================
const createNotification = async (userId, appId, title, message) => {
    try {
        await db.query(
            `INSERT INTO notifications (user_id, app_id, title, message, type, status, is_read)
             VALUES (?, ?, ?, ?, 'app', 'sent', FALSE)`,
            [userId, appId, title, message]
        );
    } catch (error) {
        console.error('Create notification error:', error);
    }
};

module.exports = {
    getNotifications,
    markAsRead,
    markAllAsRead,
    createNotification
};
