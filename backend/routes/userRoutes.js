const express = require('express');
const { protect, adminOnly } = require('../middlewares/authMiddleware');
const { getUser, getUserById, deleteUser } = require('../controllers/userController');

const router = express.Router();

// user Management routes would go here
router.get('/', protect, adminOnly, getUser); // Get all users (admin only)
router.get('/:id', protect, getUserById); // Get a specific user by ID
router.delete('/:id', protect, adminOnly, deleteUser); // Delete a user (admin only)
module.exports = router;