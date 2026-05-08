// Server/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { optionalAuth, requireAuth } = require('../middleware/auth');

// Rutas públicas
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/logout', authController.logout);

// Rutas protegidas (requieren autenticación)
router.get('/me', optionalAuth, authController.getMe);
router.get('/check-admin', optionalAuth, authController.checkAdmin);
router.put('/profile', requireAuth, authController.updateProfile);

module.exports = router;