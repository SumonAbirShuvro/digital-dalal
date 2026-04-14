const express = require('express');
const router = express.Router();
const {
    getAllUsers,
    getUserById,
    getUsersByRole,
    patchUser,
    deleteUser
} = require('../controllers/userController');

const authMiddleware  = require('../middleware/authMiddleware');
const roleMiddleware  = require('../middleware/roleMidlleware');

// ============================================================
//  USER REST API — সব HTTP Methods
// ============================================================
//
//  METHOD  | ROUTE                    | কাজ
//  --------|--------------------------|---------------------------
//  GET     | /api/users               | সব user দেখা
//  GET     | /api/users/:id           | একজন user দেখা
//  GET     | /api/users/role/:role    | role অনুযায়ী user দেখা
//  PATCH   | /api/users/:id           | user আংশিক আপডেট
//  DELETE  | /api/users/:id           | user ডিলিট
// ============================================================

// GET
router.get('/', authMiddleware, roleMiddleware('admin'), getAllUsers);
router.get('/role/:role', authMiddleware, roleMiddleware('admin'), getUsersByRole);

// GET
router.get('/:id', authMiddleware, getUserById);

// PATCH — user এর যেকোনো field আংশিক আপডেট (Admin)
router.patch('/:id', authMiddleware, roleMiddleware('admin'), patchUser);

// DELETE — user ডিলিট (Admin)
router.delete('/:id', authMiddleware, roleMiddleware('admin'), deleteUser);

module.exports = router;
