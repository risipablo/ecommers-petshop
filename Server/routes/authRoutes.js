// Server/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { optionalAuth, requireAuth } = require('../middleware/auth');
const { EmailComment } = require('../controllers/resendController');

// Verificar que todas las funciones existen
console.log('Controladores cargados:', Object.keys(authController));

// Rutas públicas
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);

// Rutas protegidas
router.get('/me', optionalAuth, authController.getMe);
router.get('/check-admin', optionalAuth, authController.checkAdmin);
router.put('/change-name', requireAuth, authController.changeName);
router.put('/change-password', requireAuth, authController.changePassword);

router.post('/send-email',EmailComment)

module.exports = router;