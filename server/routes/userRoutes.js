const express = require('express');
const router = express.Router();
const {
  addUser,
  getAllUsers,
  getUserCount,
  getInvoice
} = require('../Controllers/userController.js');

router.post('/add-user', addUser);
router.get('/users', getAllUsers);
router.get('/user-count', getUserCount);
router.get('/invoice/:id', getInvoice);

module.exports = router;
