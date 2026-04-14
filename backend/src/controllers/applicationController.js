const db   = require('../config/database');
const path = require('path');
const { createNotification } = require('./notificationController');

// Generate unique tracking ID

function generateTrackingId() {
    const prefix = 'SCST';
    const year   = new Date().getFullYear();
    const random = Math.floor(10000 + Math.random() * 90000);
    return `${prefix}-${year}-${random}`;
}

// GET LOGGED-IN CITIZEN'S OWN APPLICATIONS
// HTTP Method: GET
// Route: GET /api/applications/my


const getMyApplications = async (req, res) => {
    try {
        const user_id = req.user.userId;

        const [applications] = await db.query(`
            SELECT
                a.app_id,
                a.tracking_id,
                a.child_name_en,
                a.child_name_bn,
                a.birth_date,
                a.gender,
                a.status,
                a.fee_amount,
                a.rejection_reason,
                a.submitted_at,
                a.approved_at,
                a.completed_at
            FROM applications a
            WHERE a.user_id = ?
            ORDER BY a.submitted_at DESC
        `, [user_id]);

        res.status(200).json({
            success: true,
            message: 'আপনার আবেদনসমূহ পাওয়া গেছে',
            total: applications.length,
            data: applications
        });

    } catch (error) {
        console.error('Get my applications error:', error);
        res.status(500).json({ success: false, error: 'আবেদন তালিকা আনতে ব্যর্থ হয়েছে' });
    }
};

// GET ALL APPLICATIONS
// HTTP Method: GET
// Route: GET /api/applications
// Access: Admin / Officer

const getAllApplications = async (req, res) => {
    try {
        const [applications] = await db.query(`
            SELECT 
                a.app_id,
                a.tracking_id,
                a.child_name_en,
                a.child_name_bn,
                a.birth_date,
                a.gender,
                a.status,
                a.fee_amount,
                a.submitted_at,
                u.name   AS applicant_name,
                u.mobile AS applicant_mobile
            FROM applications a
            JOIN users u ON a.user_id = u.user_id
            ORDER BY a.submitted_at DESC
        `);

        res.status(200).json({
            success: true,
            message: 'সকল আবেদন সফলভাবে পাওয়া গেছে',
            total: applications.length,
            data: applications
        });

    } catch (error) {
        console.error('Get all applications error:', error);
        res.status(500).json({ success: false, error: 'আবেদন তালিকা আনতে ব্যর্থ হয়েছে' });
    }
};

// GET SINGLE APPLICATION BY ID
// HTTP Method: GET
// Route: GET /api/applications/:id
// Access: Citizen (own) / Officer / Admin

const getApplicationById = async (req, res) => {
    try {
        const { id } = req.params;

        const [applications] = await db.query(`
            SELECT 
                a.*,
                u.name   AS applicant_name,
                u.mobile AS applicant_mobile,
                u.email  AS applicant_email
            FROM applications a
            JOIN users u ON a.user_id = u.user_id
            WHERE a.app_id = ?
        `, [id]);

        if (applications.length === 0) {
            return res.status(404).json({
                success: false,
                error: `ID ${id} এর কোনো আবেদন পাওয়া যায়নি`
            });
        }

            const [docs] = await db.query(
            'SELECT doc_id, doc_type, file_name, file_path, mime_type, uploaded_at FROM documents WHERE app_id = ?',
            [id]
        );

        res.status(200).json({
            success: true,
            message: 'আবেদন সফলভাবে পাওয়া গেছে',
            data: { ...applications[0], documents: docs }
        });

    } catch (error) {
        console.error('Get application by id error:', error);
        res.status(500).json({ success: false, error: 'আবেদন আনতে ব্যর্থ হয়েছে' });
    }
};


// CREATE NEW APPLICATION
// HTTP Method: POST
// Route: POST /api/applications
// Access: Citizen (authenticated)

const createApplication = async (req, res) => {
    try {
     
        const user_id = req.user.userId;

        const {
            child_name_bn,
            child_name_en,
            birth_date,
            birth_place,
            gender,
            father_name_bn,
            father_name_en,
            father_nationality,
            mother_name_bn,
            mother_name_en,
            mother_nationality,
            permanent_address,
            fee_amount
        } = req.body;

        if (!child_name_bn || !birth_date || !gender) {
            return res.status(400).json({
                success: false,
                error: 'child_name_bn, birth_date এবং gender আবশ্যক'
            });
        }

        if (!father_name_en || !father_name_en.trim()) {
            return res.status(400).json({
                success: false,
                error: "Father's name in English is required"
            });
        }

        if (!mother_name_en || !mother_name_en.trim()) {
            return res.status(400).json({
                success: false,
                error: "Mother's name in English is required"
            });
        }

        const tracking_id = generateTrackingId();

        const [result] = await db.query(`
            INSERT INTO applications (
                user_id, tracking_id,
                child_name_bn, child_name_en,
                birth_date, birth_place, gender,
                father_name_bn, father_name_en, father_nationality,
                mother_name_bn, mother_name_en, mother_nationality,
                permanent_address, status, fee_amount
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', ?)
        `, [
            user_id, tracking_id,
            child_name_bn || null, child_name_en || null,
            birth_date, birth_place || null, gender,
            father_name_bn || null, father_name_en.trim(), father_nationality || null,
            mother_name_bn || null, mother_name_en.trim(), mother_nationality || null,
            permanent_address || null, fee_amount || 100
        ]);

        const app_id = result.insertId;

        if (req.files && req.files.length > 0) {
            const docValues = req.files.map(file => [
                app_id,
                'application_document',          
                file.originalname,              
                file.path,
                file.size,                       
                file.mimetype,                   
                user_id                          
            ]);

            await db.query(`
                INSERT INTO documents
                    (app_id, doc_type, file_name, file_path, file_size, mime_type, uploaded_by)
                VALUES ?
            `, [docValues]);
        }

        // Audit log
        await db.query(
            `INSERT INTO audit_logs (user_id, action, target_type, target_id, details)
             VALUES (?, 'application_create', 'application', ?, ?)`,
            [user_id, app_id, JSON.stringify({ tracking_id, timestamp: new Date() })]
        );

        res.status(201).json({
            success: true,
            message: 'আবেদন সফলভাবে জমা দেওয়া হয়েছে',
            data: {
                app_id,
                tracking_id,
                status: 'pending',
                documents_uploaded: req.files ? req.files.length : 0
            }
        });

    } catch (error) {
        console.error('Create application error:', error);
        res.status(500).json({ success: false, error: 'আবেদন জমা দিতে ব্যর্থ হয়েছে' });
    }
};



// HTTP Method: PUT
// Route: PUT /api/applications/:id
// Access: Citizen (own application)

const updateApplication = async (req, res) => {
    try {
        const { id }     = req.params;
        const user_id    = req.user.userId;
        const {
            child_name_bn, child_name_en,
            birth_date, birth_place, gender,
            father_name_bn, father_name_en, father_nationality,
            mother_name_bn, mother_name_en, mother_nationality,
            permanent_address, fee_amount
        } = req.body;

        const [existing] = await db.query(
            'SELECT * FROM applications WHERE app_id = ?', [id]
        );

        if (existing.length === 0) {
            return res.status(404).json({
                success: false,
                error: `ID ${id} এর কোনো আবেদন পাওয়া যায়নি`
            });
        }

       
        if (req.user.role === 'citizen' && existing[0].user_id !== user_id) {
            return res.status(403).json({
                success: false,
                error: 'এই আবেদন সম্পাদনার অনুমতি নেই'
            });
        }

        if (existing[0].status !== 'pending') {
            return res.status(400).json({
                success: false,
                error: 'শুধুমাত্র pending আবেদন সম্পাদনা করা যাবে'
            });
        }

        await db.query(`
            UPDATE applications SET
                child_name_bn     = ?,
                child_name_en     = ?,
                birth_date        = ?,
                birth_place       = ?,
                gender            = ?,
                father_name_bn    = ?,
                father_name_en    = ?,
                father_nationality        = ?,
                mother_name_bn    = ?,
                mother_name_en    = ?,
                mother_nationality        = ?,
                permanent_address = ?,
                fee_amount        = ?,
                updated_at        = NOW()
            WHERE app_id = ?
        `, [
            child_name_bn, child_name_en,
            birth_date, birth_place, gender,
            father_name_bn, father_name_en, father_nationality,
            mother_name_bn, mother_name_en, mother_nationality,
            permanent_address, fee_amount,
            id
        ]);

        res.status(200).json({
            success: true,
            message: `আবেদন ID ${id} সম্পূর্ণরূপে আপডেট করা হয়েছে (PUT)`,
            data: { app_id: parseInt(id), updated_at: new Date() }
        });

    } catch (error) {
        console.error('Update application error:', error);
        res.status(500).json({ success: false, error: 'আবেদন আপডেট করতে ব্যর্থ হয়েছে' });
    }
};



// HTTP Method: PATCH
// Route: PATCH /api/applications/:id/status
// Access: Officer / Admin

const updateApplicationStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, rejection_reason, assigned_officer_id } = req.body;

        const validStatuses = ['pending', 'processing', 'verified', 'approved', 'rejected', 'completed'];

        if (!status || !validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                error: `Status অবশ্যই এগুলোর একটি হতে হবে: ${validStatuses.join(', ')}`
            });
        }

        const [existing] = await db.query(
            'SELECT * FROM applications WHERE app_id = ?', [id]
        );

        if (existing.length === 0) {
            return res.status(404).json({
                success: false,
                error: `ID ${id} এর কোনো আবেদন পাওয়া যায়নি`
            });
        }

        const oldStatus = existing[0].status;

        let updateFields = 'status = ?, updated_at = NOW()';
        let values = [status];

        if (status === 'approved')  { updateFields += ', approved_at = NOW()'; }
        if (status === 'completed') { updateFields += ', completed_at = NOW()'; }
        if (status === 'rejected' && rejection_reason) {
            updateFields += ', rejection_reason = ?';
            values.push(rejection_reason);
        }
        if (assigned_officer_id) {
            updateFields += ', assigned_officer_id = ?';
            values.push(assigned_officer_id);
        }

        values.push(id);

        await db.query(
            `UPDATE applications SET ${updateFields} WHERE app_id = ?`,
            values
        );

        // Status change history save
        await db.query(`
            INSERT INTO application_status_history
                (app_id, old_status, new_status, changed_by, remarks)
            VALUES (?, ?, ?, ?, ?)
        `, [id, oldStatus, status, req.user.userId, rejection_reason || null]);

      
        const app = existing[0];
        const citizenId = app.user_id;
        const trackingId = app.tracking_id;
        const childName = app.child_name_bn || app.child_name_en || 'আবেদনকারী';

        if (status === 'processing') {
            await createNotification(
                citizenId, parseInt(id),
                'আবেদন অনুমোদিত হয়েছে',
                `প্রিয় ${childName}, আপনার জন্ম নিবন্ধন আবেদন (${trackingId}) অনুমোদিত হয়েছে এবং এখন In Progress অবস্থায় আছে।`
            );
        } else if (status === 'completed') {
            await createNotification(
                citizenId, parseInt(id),
                'আবেদন সম্পন্ন হয়েছে',
                `প্রিয় ${childName}, আপনার জন্ম নিবন্ধন সনদ (${trackingId}) প্রস্তুত।`
            );
        } else if (status === 'rejected') {
            await createNotification(
                citizenId, parseInt(id),
                'আবেদন বাতিল হয়েছে',
                `প্রিয় ${childName}, আপনার আবেদন (${trackingId}) বাতিল করা হয়েছে। কারণ: ${rejection_reason || 'তথ্য যাচাই ব্যর্থ'}`
            );
        }

        res.status(200).json({
            success: true,
            message: `আবেদন ID ${id} এর status আপডেট করা হয়েছে`,
            data: {
                app_id: parseInt(id),
                old_status: oldStatus,
                new_status: status,
                updated_at: new Date()
            }
        });

    } catch (error) {
        console.error('Update status error:', error);
        res.status(500).json({ success: false, error: 'Status আপডেট করতে ব্যর্থ হয়েছে' });
    }
};



// DELETE APPLICATION
// HTTP Method: DELETE
// Route: DELETE /api/applications/:id
// Access: Admin only

const deleteApplication = async (req, res) => {
    try {
        const { id } = req.params;

        const [existing] = await db.query(
            'SELECT app_id, tracking_id, child_name_en, status FROM applications WHERE app_id = ?',
            [id]
        );

        if (existing.length === 0) {
            return res.status(404).json({
                success: false,
                error: `ID ${id} এর কোনো আবেদন পাওয়া যায়নি`
            });
        }

        const deletedApp = existing[0];

        await db.query('DELETE FROM applications WHERE app_id = ?', [id]);

        res.status(200).json({
            success: true,
            message: `আবেদন ID ${id} ডেটাবেস থেকে সফলভাবে মুছে ফেলা হয়েছে`,
            data: {
                deleted_app_id: deletedApp.app_id,
                tracking_id:    deletedApp.tracking_id,
                child_name:     deletedApp.child_name_en,
                previous_status: deletedApp.status,
                deleted_at:     new Date()
            }
        });

    } catch (error) {
        console.error('Delete application error:', error);
        res.status(500).json({ success: false, error: 'আবেদন ডিলিট করতে ব্যর্থ হয়েছে' });
    }
};


module.exports = {
    getMyApplications,
    getAllApplications,
    getApplicationById,
    createApplication,
    updateApplication,
    updateApplicationStatus,
    deleteApplication
};
