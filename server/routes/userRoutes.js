const express = require('express');
const router = express.Router();
const {
  addUser,
  getAllUsers,
  getUserCount,
  getInvoice,      // if implemented
  getUserById,
  updateUser,      // ✅ added
  deleteUser,      // ✅ added
  bulkAddUsers
} = require('../Controllers/userController.js');

// Create a user
router.post('/add-user', addUser);

// Read
router.get('/users', getAllUsers);
router.get('/user-count', getUserCount);
router.get('/user/:id', getUserById);

// ✅ Update
router.put('/user/:id', updateUser);

// ✅ Delete
router.delete('/user/:id', deleteUser);

// Bulk upload
router.post('/bulk-add-users', bulkAddUsers);

module.exports = router;
