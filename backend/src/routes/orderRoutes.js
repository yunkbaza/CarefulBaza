const express = require('express');
const router = express.Router();
const authenticateToken = require('../middlewares/authMiddleware');
const { getMyOrders, trackOrder } = require('../controllers/orderController');

// Rota privada: Só vê quem está logado
router.get('/my-orders', authenticateToken, getMyOrders);

// 🚀 Rota pública: O Frontend vai chamar esta para a página de Rastreio
router.get('/track/:code', trackOrder);

module.exports = router;