const express = require('express');
const router = express.Router();
const {
    getAllOfficers,
    getOfficerById,
    createOfficer,
    patchOfficer,
    deleteOfficer
} = require('../Controllers/officerController');

const authMiddleware  = require('../middleware/authMiddleware');
const roleMiddleware  = require('../middleware/roleMidlleware');

// ============================================================
//  OFFICER REST API — সব HTTP Methods
// ============================================================
//
//  METHOD  | ROUTE                | কাজ
//  --------|----------------------|----------------------------
//  GET     | /api/officers        | সব officer দেখা
//  GET     | /api/officers/:id    | একজন officer দেখা
//  POST    | /api/officers        | নতুন officer profile তৈরি
//  PATCH   | /api/officers/:id    | officer আংশিক আপডেট
//  DELETE  | /api/officers/:id    | officer ডিলিট
// ============================================================

// GET
router.get('/', authMiddleware, roleMiddleware('admin'), getAllOfficers);

// GET
router.get('/:id', authMiddleware, roleMiddleware('admin'), getOfficerById);

// POST
router.post('/', authMiddleware, roleMiddleware('admin'), createOfficer);

// PATCH — officer এর যেকোনো field আংশিক আপডেট
router.patch('/:id', authMiddleware, roleMiddleware('admin'), patchOfficer);

// DELETE — officer ডিলিট
router.delete('/:id', authMiddleware, roleMiddleware('admin'), deleteOfficer);

module.exports = router;
