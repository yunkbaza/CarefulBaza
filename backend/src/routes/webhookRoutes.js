const express = require('express');
const router = express.Router();
const { handleStripeWebhook } = require('../controllers/webhookController');

// A raiz desta rota já é montada com express.raw() no app.js
router.post('/', handleStripeWebhook);

module.exports = router;