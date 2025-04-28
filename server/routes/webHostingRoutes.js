const express = require('express');
const router = express.Router();
const webHostingController = require('../Controllers/webHostingController.js');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

// ✅ Existing routes
router.post('/add-webhosting-user', webHostingController.addWebHostingUser);
router.post('/bulk-upload-webhosting', upload.single('file'), webHostingController.bulkUploadWebHosting);

// ✅ Add this GET route to fetch existing users
router.get('/webhosting-users', webHostingController.getAllWebHostingUsers);

module.exports = router;
