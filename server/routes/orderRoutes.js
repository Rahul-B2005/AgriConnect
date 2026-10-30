const express = require('express');
const router = express.Router();
const {
  placeOrder, myOrders, incomingOrders, updateStatus,
} = require('../controllers/orderController');
const { protect, requireRole } = require('../middleware/authMiddleware');

router.post('/', protect, requireRole('buyer'), placeOrder);
router.get('/mine', protect, requireRole('buyer'), myOrders);
router.get('/incoming', protect, requireRole('farmer'), incomingOrders);
router.put('/:id/status', protect, requireRole('farmer'), updateStatus);

module.exports = router;
