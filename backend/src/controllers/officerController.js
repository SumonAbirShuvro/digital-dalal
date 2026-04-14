const db = require('../config/database');

// ============================================================
// GET ALL OFFICERS
// GET /api/officers
// Admin only — সব officer এর তথ্য দেখা
// ============================================================
const getAllOfficers = async (req, res) => {
    try {
        const [officers] = await db.query(`
            SELECT 
                o.officer_id,
                o.employee_id,
                o.department,
                o.designation,
                o.office_location,
                o.is_active,
                o.joined_at,
                u.user_id,
                u.name       AS officer_name,
                u.mobile     AS officer_mobile,
                u.email      AS officer_email,
                u.is_verified
            FROM officers o
            JOIN users u ON o.user_id = u.user_id
            ORDER BY o.officer_id DESC
        `);

        res.status(200).json({
            success: true,
            message: 'সকল অফিসারের তথ্য পাওয়া গেছে',
            total: officers.length,
            data: officers
        });
    } catch (error) {
        console.error('getAllOfficers error:', error);
        res.status(500).json({ success: false, error: 'অফিসার তালিকা আনতে ব্যর্থ' });
    }
};

// ============================================================
// GET SINGLE OFFICER BY ID
// GET /api/officers/:id
// ============================================================
const getOfficerById = async (req, res) => {
    try {
        const { id } = req.params;

        const [officers] = await db.query(`
            SELECT 
                o.*,
                u.name       AS officer_name,
                u.mobile     AS officer_mobile,
                u.email      AS officer_email
            FROM officers o
            JOIN users u ON o.user_id = u.user_id
            WHERE o.officer_id = ?
        `, [id]);

        if (officers.length === 0) {
            return res.status(404).json({
                success: false,
                error: `ID ${id} এর কোনো অফিসার পাওয়া যায়নি`
            });
        }

        res.status(200).json({
            success: true,
            message: 'অফিসার তথ্য পাওয়া গেছে',
            data: officers[0]
        });
    } catch (error) {
        console.error('getOfficerById error:', error);
        res.status(500).json({ success: false, error: 'অফিসার তথ্য আনতে ব্যর্থ' });
    }
};

// ============================================================
// CREATE OFFICER PROFILE
// POST /api/officers
// Admin — নতুন officer profile তৈরি (user_id দিয়ে link করা)
// ============================================================
const createOfficer = async (req, res) => {
    try {
        const { user_id, employee_id, department, designation, office_location, joined_at } = req.body;

        if (!user_id) {
            return res.status(400).json({
                success: false,
                error: 'user_id আবশ্যক'
            });
        }

        // User exists এবং role officer কিনা চেক
        const [users] = await db.query(
            'SELECT user_id, name, role FROM users WHERE user_id = ?', [user_id]
        );
        if (users.length === 0) {
            return res.status(404).json({ success: false, error: `User ID ${user_id} পাওয়া যায়নি` });
        }

        // Already officer profile আছে কিনা
        const [existing] = await db.query(
            'SELECT officer_id FROM officers WHERE user_id = ?', [user_id]
        );
        if (existing.length > 0) {
            return res.status(400).json({
                success: false,
                error: `User ID ${user_id} এর ইতিমধ্যে Review Handler profile আছে`
            });
        }

        const [result] = await db.query(`
            INSERT INTO officers (user_id, employee_id, department, designation, office_location, joined_at)
            VALUES (?, ?, ?, ?, ?, ?)
        `, [user_id, employee_id || null, department || null, designation || null,
            office_location || null, joined_at || null]);

        // users table এ role update করো
        await db.query('UPDATE users SET role = ? WHERE user_id = ?', ['review_handler', user_id]);

        res.status(201).json({
            success: true,
            message: 'অফিসার প্রোফাইল তৈরি হয়েছে (POST)',
            data: {
                officer_id: result.insertId,
                user_id,
                employee_id,
                department
            }
        });
    } catch (error) {
        console.error('createOfficer error:', error);
        res.status(500).json({ success: false, error: 'অফিসার তৈরি করতে ব্যর্থ' });
    }
};

// ============================================================
// PATCH OFFICER INFO (Partial Update)
// PATCH /api/officers/:id
// Admin — officer এর যেকোনো field আংশিক আপডেট
// ============================================================
const patchOfficer = async (req, res) => {
    try {
        const { id } = req.params;
        const allowedFields = ['employee_id', 'department', 'designation', 'office_location', 'is_active', 'joined_at'];
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

        const [existing] = await db.query(
            'SELECT officer_id FROM officers WHERE officer_id = ?', [id]
        );
        if (existing.length === 0) {
            return res.status(404).json({
                success: false,
                error: `Officer ID ${id} পাওয়া যায়নি`
            });
        }

        const setClause = Object.keys(updates).map(f => `${f} = ?`).join(', ');
        const values = [...Object.values(updates), id];

        await db.query(
            `UPDATE officers SET ${setClause} WHERE officer_id = ?`,
            values
        );

        res.status(200).json({
            success: true,
            message: `Officer ID ${id} আংশিকভাবে আপডেট হয়েছে (PATCH)`,
            data: {
                officer_id: parseInt(id),
                updated_fields: updates,
                updated_at: new Date()
            }
        });
    } catch (error) {
        console.error('patchOfficer error:', error);
        res.status(500).json({ success: false, error: 'অফিসার আপডেট করতে ব্যর্থ' });
    }
};

// ============================================================
// DELETE OFFICER PROFILE
// DELETE /api/officers/:id
// Admin only — officers table থেকে মুছে ফেলা
// ============================================================
const deleteOfficer = async (req, res) => {
    try {
        const { id } = req.params;

        const [existing] = await db.query(`
            SELECT o.officer_id, o.employee_id, o.department, u.name
            FROM officers o
            JOIN users u ON o.user_id = u.user_id
            WHERE o.officer_id = ?
        `, [id]);

        if (existing.length === 0) {
            return res.status(404).json({
                success: false,
                error: `Officer ID ${id} পাওয়া যায়নি`
            });
        }

        const deletedOfficer = existing[0];

        await db.query('DELETE FROM officers WHERE officer_id = ?', [id]);

        res.status(200).json({
            success: true,
            message: `Officer ID ${id} ডেটাবেস থেকে মুছে ফেলা হয়েছে (DELETE)`,
            data: {
                deleted_officer_id: deletedOfficer.officer_id,
                employee_id: deletedOfficer.employee_id,
                name: deletedOfficer.name,
                department: deletedOfficer.department,
                deleted_at: new Date()
            }
        });
    } catch (error) {
        console.error('deleteOfficer error:', error);
        res.status(500).json({ success: false, error: 'অফিসার ডিলিট করতে ব্যর্থ' });
    }
};

module.exports = {
    getAllOfficers,
    getOfficerById,
    createOfficer,
    patchOfficer,
    deleteOfficer
};
