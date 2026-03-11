const express = require('express');
const router = express.Router();
const { chatComIA, debugGemini } = require('../controllers/aiController');

router.post('/chat', chatComIA);
router.get('/debug-gemini', debugGemini);

module.exports = router;