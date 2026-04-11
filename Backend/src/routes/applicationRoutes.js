const express  = require('express');
const router   = express.Router();
const multer   = require('multer');
const path     = require('path');
const fs       = require('fs');

const {
    getMyApplications,
    getAllApplications,
    getApplicationById,
    createApplication,
    updateApplication,
    updateApplicationStatus,
    deleteApplication
} = require('../Controllers/applicationController');

const authMiddleware = require('../middleware/authMiddleware');

// ==========================================

// ==========================================

// uploads/ ফোল্ডার না থাকলে তৈরি করো
const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => {
        // Unique filename: timestamp + random + original extension
        const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        cb(null, unique + path.extname(file.originalname));
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        const allowed = /jpeg|jpg|png|pdf/;
        const ext  = allowed.test(path.extname(file.originalname).toLowerCase());
        const mime = allowed.test(file.mimetype);
        if (ext && mime) return cb(null, true);
        cb(new Error('শুধুমাত্র JPG, PNG এবং PDF ফাইল আপলোড করা যাবে'));
    }
});

// ============================================================
//  REST API — HTTP Methods
// ============================================================
//
//  HTTP METHOD  | ROUTE                              | কাজ
//  -------------|------------------------------------|-----------------------
//  GET          | /api/applications                  | সব আবেদন দেখা
//  GET          | /api/applications/:id              | একটি আবেদন দেখা
//  POST         | /api/applications                  | নতুন আবেদন তৈরি
//  PUT          | /api/applications/:id              | পুরো আবেদন আপডেট
//  PATCH        | /api/applications/:id/status       | শুধু status আপডেট
//  DELETE       | /api/applications/:id              | আবেদন ডিলিট
// ============================================================

// GET
router.get('/', authMiddleware, getAllApplications);
router.get('/my', authMiddleware, getMyApplications);

// GET
router.get('/:id', authMiddleware, getApplicationById);

// POST

router.post('/', authMiddleware, upload.array('documents', 10), createApplication);

// PUT — সম্পূর্ণ আবেদন আপডেট
router.put('/:id', authMiddleware, updateApplication);

// PATCH — শুধু status আপডেট
router.patch('/:id/status', authMiddleware, updateApplicationStatus);

// DELETE — আবেদন ডেটাবেস থেকে মুছে ফেলা
router.delete('/:id', authMiddleware, deleteApplication);

module.exports = router;
