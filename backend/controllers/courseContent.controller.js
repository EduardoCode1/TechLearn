// backend/controllers/courseContent.controller.js
const CourseContent = require('../models/courseContent.model');

exports.addContent = async (req, res) => {
    const { courseId, type, title, url, duration } = req.body;
    try {
        const newContent = new CourseContent({ courseId, type, title, url, duration });
        await newContent.save();
        res.status(201).json(newContent);
    } catch (error) {
        res.status(500).json({ message: "Error al agregar contenido del curso" });
    }
};

exports.getContentByCourse = async (req, res) => {
    const { courseId } = req.params;
    try {
        const content = await CourseContent.find({ courseId });
        res.status(200).json(content);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener contenido del curso" });
    }
};
