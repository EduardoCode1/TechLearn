// backend/controllers/authController.js
const User = require('../models/user.model'); // Importación corregida
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
require('dotenv').config();

// Configuración de NodeMailer
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Función para enviar correo de restablecimiento de contraseña
exports.sendResetPasswordEmail = async (req, res) => {
    const { email } = req.body;
    try {
        console.log('Intentando enviar email a:', email);
        const user = await User.findOne({ email });
        if (!user) {
            console.log('Usuario no encontrado');
            return res.status(404).send({ message: "Usuario no encontrado" });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hora
        await user.save();

        const resetLink = `${process.env.FRONTEND_URL}/reset-password/${token}`;
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: "Restablecimiento de contraseña",
            text: `Para restablecer tu contraseña, sigue este enlace: ${resetLink}`
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error enviando el correo:', error);
                return res.status(500).send({ message: "Error enviando el correo" });
            }
            console.log('Correo enviado:', info.response);
            res.status(200).send({ message: "Correo enviado con éxito" });
        });
    } catch (error) {
        console.error("Error del servidor", error);
        res.status(500).send({ message: "Error del servidor" });
    }
};

// Función para verificar el token de restablecimiento de contraseña y actualizar la contraseña
exports.verifyResetTokenAndUpdatePassword = async (req, res) => {
    const { token, password } = req.body;
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);
        if (!user || user.resetPasswordToken !== token || user.resetPasswordExpires < Date.now()) {
            return res.status(400).json({ message: "Token inválido o expirado" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();
        
        res.status(200).json({ message: "Contraseña actualizada con éxito" });
    } catch (error) {
        res.status(500).json({ message: "Error del servidor" });
        console.error("Error del servidor", error);
    }
};

// Función para registrar un nuevo usuario
exports.registerUser = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).send({ message: "Usuario ya registrado" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            name,
            email,
            password: hashedPassword
        });

        await newUser.save();
        res.status(201).send({ message: "Usuario registrado con éxito" });
    } catch (error) {
        res.status(500).send({ message: "Error del servidor" });
        console.error("Error del servidor", error);
    }
};

// Función para iniciar sesión
exports.loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).send({ message: "Usuario no encontrado" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).send({ message: "Contraseña incorrecta" });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ token });
    } catch (error) {
        res.status(500).send({ message: "Error del servidor" });
        console.error("Error del servidor", error);
    }
};
exports.loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).send({ message: "Usuario no encontrado" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).send({ message: "Contraseña incorrecta" });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ token }); // Asegúrate de devolver el token en un objeto JSON
    } catch (error) {
        res.status(500).send({ message: "Error del servidor" });
        console.error("Error del servidor", error);
    }
};
