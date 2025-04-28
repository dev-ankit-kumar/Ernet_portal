const express = require('express');
const router = express.Router();
const vmController = require('../controllers/vmController');

router.post('/add-vm', vmController.addVm);
router.get('/vms', vmController.getAllVms);
router.get('/vm-count', vmController.getVmCount); // ✅ Add this
router.post('/bulk-add-vms', vmController.bulkAddVms);


module.exports = router;
