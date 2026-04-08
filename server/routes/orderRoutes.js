const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { createOrder, getOrders, updateOrderStatus, getDashboardStats } = require('../controllers/orderController');

router.post('/', createOrder);
router.get('/', protect, getOrders);
router.get('/stats', protect, getDashboardStats);
router.put('/:id/status', protect, updateOrderStatus);

module.exports = router;
