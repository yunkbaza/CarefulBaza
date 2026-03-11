const express = require('express');
const router = express.Router();
const authenticateToken = require('../middlewares/authMiddleware');
const { register, resendVerification, verifyEmail, login, updateProfile } = require('../controllers/authController');

router.post('/register', register);
router.post('/resend-verification', resendVerification);
router.post('/verify-email', verifyEmail);
router.post('/login', login);
router.put('/profile', authenticateToken, updateProfile);

module.exports = router;