const express = require('express');
const router = express.Router();
const authenticateToken = require('../middlewares/authMiddleware');
const { getMyOrders } = require('../controllers/orderController');

router.get('/my-orders', authenticateToken, getMyOrders);

module.exports = router;