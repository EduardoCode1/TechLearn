// backend/controllers/userController.js
const mongoose = require('mongoose');
const User = require('../models/user.model');

exports.toggleFavoriteCourse = async (req, res) => {
    const { userId } = req.body;
    const { courseId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ message: 'ID de usuario no válido' });
    }

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        const courseIndex = user.favoriteCourses.indexOf(courseId);
        if (courseIndex === -1) {
            user.favoriteCourses.push(courseId);
        } else {
            user.favoriteCourses.splice(courseIndex, 1);
        }

        await user.save();
        res.json({ favoriteCourses: user.favoriteCourses });
    } catch (error) {
        console.error('Error en toggleFavoriteCourse:', error);
        res.status(500).json({ message: error.message });
    }
};

exports.getFavoriteCourses = async (req, res) => {
    const { userId } = req.params; // Cambiado a req.params para obtener el userId de la URL

    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ message: 'ID de usuario no válido' });
    }

    try {
        const user = await User.findById(userId).populate('favoriteCourses');
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        res.json(user.favoriteCourses);
    } catch (error) {
        console.error('Error en getFavoriteCourses:', error);
        res.status(500).json({ message: error.message });
    }
};
