const express = require('express');
const router = express.Router();

// 📦 Importamos o controlador completo
const productController = require('../controllers/productController');

// 🔍 Rotas públicas de leitura (Catálogo)
router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);

// 🚀 NOVA ROTA: Importador do AliExpress
router.post('/import-aliexpress', productController.importFromAliExpress);

module.exports = router;