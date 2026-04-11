const db = require('../config/database');
const bcrypt = require('bcrypt');

// ============================================================
// GET ALL USERS
// GET /api/users
// Admin only — সব user এর তথ্য দেখা
// ============================================================
const getAllUsers = async (req, res) => {
    try {
        const [users] = await db.query(`
            SELECT 
                user_id, name, mobile, email,
                role, is_verified, current_address, created_at
            FROM users
            ORDER BY created_at DESC
        `);

        res.status(200).json({
            success: true,
            message: 'সকল ইউজার পাওয়া গেছে',
            total: users.length,
            data: users
        });
    } catch (error) {
        console.error('getAllUsers error:', error);
        res.status(500).json({ success: false, error: 'ইউজার তালিকা আনতে ব্যর্থ' });
    }
};

// ============================================================
// GET SINGLE USER BY ID
// GET /api/users/:id
// Admin / নিজের তথ্য দেখা
// ============================================================
const getUserById = async (req, res) => {
    try {
        const { id } = req.params;

        const [users] = await db.query(`
            SELECT 
                user_id, name, mobile, email,
                role, is_verified, current_address, created_at
            FROM users
            WHERE user_id = ?
        `, [id]);

        if (users.length === 0) {
            return res.status(404).json({
                success: false,
                error: `ID ${id} এর কোনো ইউজার পাওয়া যায়নি`
            });
        }

        res.status(200).json({
            success: true,
            message: 'ইউজার তথ্য পাওয়া গেছে',
            data: users[0]
        });
    } catch (error) {
        console.error('getUserById error:', error);
        res.status(500).json({ success: false, error: 'ইউজার তথ্য আনতে ব্যর্থ' });
    }
};

// ============================================================
// GET USERS BY ROLE
// GET /api/users/role/:role
// Example: /api/users/role/citizen  OR  /api/users/role/officer
// Admin only
// ============================================================
const getUsersByRole = async (req, res) => {
    try {
        const { role } = req.params;
        const validRoles = ['citizen', 'review_handler', 'admin'];

        if (!validRoles.includes(role)) {
            return res.status(400).json({
                success: false,
                error: `Role অবশ্যই এগুলোর একটি হতে হবে: ${validRoles.join(', ')}`
            });
        }

        const [users] = await db.query(`
            SELECT user_id, name, mobile, email,
                   role, is_verified, current_address, created_at
            FROM users
            WHERE role = ?
            ORDER BY created_at DESC
        `, [role]);

        res.status(200).json({
            success: true,
            message: `সকল ${role} পাওয়া গেছে`,
            total: users.length,
            data: users
        });
    } catch (error) {
        console.error('getUsersByRole error:', error);
        res.status(500).json({ success: false, error: 'ইউজার তালিকা আনতে ব্যর্থ' });
    }
};

// ============================================================
// PATCH USER INFO (Partial Update)
// PATCH /api/users/:id
// Admin — যেকোনো field আংশিকভাবে আপডেট করা
// ============================================================
const patchUser = async (req, res) => {
    try {
        const { id } = req.params;
        const allowedFields = ['name', 'email', 'current_address', 'role', 'is_verified'];
        const updates = {};
        for (const field of allowedFields) {
            if (req.body[field] !== undefined) {
                updates[field] = req.body[field];
            }
        }

        if (Object.keys(updates).length === 0) {
            return res.status(400).json({
                success: false,
                error: `আপডেট করার জন্য অন্তত একটি field দিন: ${allowedFields.join(', ')}`
            });
        }

        // User আছে কিনা চেক
        const [existing] = await db.query(
            'SELECT user_id, name, role FROM users WHERE user_id = ?', [id]
        );
        if (existing.length === 0) {
            return res.status(404).json({
                success: false,
                error: `ID ${id} এর কোনো ইউজার পাওয়া যায়নি`
            });
        }

        // Dynamic PATCH query তৈরি
        const setClause = Object.keys(updates).map(f => `${f} = ?`).join(', ');
        const values = [...Object.values(updates), id];

        await db.query(
            `UPDATE users SET ${setClause} WHERE user_id = ?`,
            values
        );

        res.status(200).json({
            success: true,
            message: `User ID ${id} আংশিকভাবে আপডেট হয়েছে (PATCH)`,
            data: {
                user_id: parseInt(id),
                updated_fields: updates,
                updated_at: new Date()
            }
        });
    } catch (error) {
        console.error('patchUser error:', error);
        res.status(500).json({ success: false, error: 'ইউজার আপডেট করতে ব্যর্থ' });
    }
};

// ============================================================
// DELETE USER
// DELETE /api/users/:id
// Admin only — database থেকে সম্পূর্ণ মুছে ফেলা
// ============================================================
const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        const [existing] = await db.query(
            'SELECT user_id, name, mobile, role FROM users WHERE user_id = ?', [id]
        );

        if (existing.length === 0) {
            return res.status(404).json({
                success: false,
                error: `ID ${id} এর কোনো ইউজার পাওয়া যায়নি`
            });
        }

        const deletedUser = existing[0];

        await db.query('DELETE FROM users WHERE user_id = ?', [id]);

        res.status(200).json({
            success: true,
            message: `User ID ${id} ডেটাবেস থেকে মুছে ফেলা হয়েছে (DELETE)`,
            data: {
                deleted_user_id: deletedUser.user_id,
                name: deletedUser.name,
                mobile: deletedUser.mobile,
                role: deletedUser.role,
                deleted_at: new Date()
            }
        });
    } catch (error) {
        console.error('deleteUser error:', error);
        res.status(500).json({ success: false, error: 'ইউজার ডিলিট করতে ব্যর্থ' });
    }
};

module.exports = {
    getAllUsers,
    getUserById,
    getUsersByRole,
    patchUser,
    deleteUser
};
