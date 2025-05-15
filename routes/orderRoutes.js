const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { authenticate } = require('../middleware/authMiddleware');

router.post('/orders', orderController.placeOrder);
router.get('/orders', authenticate, orderController.getOrders);
router.put('/orders/:orderId/status', authenticate, orderController.updateOrderStatus);

module.exports = router;
