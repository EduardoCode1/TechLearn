// backend/routes/auth.routes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController'); // Asegúrate de que la ruta es correcta

router.post('/register', authController.registerUser);
router.post('/login', authController.loginUser);
router.post('/send-reset-password-email', authController.sendResetPasswordEmail);
router.post('/verify-reset-password-token', authController.verifyResetTokenAndUpdatePassword);

module.exports = router;
