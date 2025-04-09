const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.post('/add-user', userController.addUser);
router.get('/users', userController.getAllUsers);
router.get('/user-count', userController.getUserCount);

module.exports = router;
