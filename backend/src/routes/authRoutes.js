const express = require('express');
const router = express.Router();
const { register, verifyEmail, resendVerification, login, updateProfile, forgotPassword, resetPassword } = require('../controllers/authController');
const authenticateToken = require('../middlewares/authMiddleware');

router.post('/register', register);
router.post('/verify-email', verifyEmail);
router.post('/resend-verification', resendVerification);
router.post('/login', login);
router.put('/profile', authenticateToken, updateProfile);

// 🚀 As duas novas rotas abertas para o Frontend bater:
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

module.exports = router;