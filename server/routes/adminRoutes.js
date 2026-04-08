const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { loginAdmin, setupAdmin, getAdminProfile } = require('../controllers/adminController');

router.post('/login', loginAdmin);
router.post('/setup', setupAdmin);
router.get('/profile', protect, getAdminProfile);

module.exports = router;
