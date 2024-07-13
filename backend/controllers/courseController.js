// backend/controllers/courseController.js
const Course = require('../models/course.model');
const Content = require('../models/content.model');
const User = require('../models/user.model'); // Asegúrate de importar el modelo de usuario

exports.getCourses = async (req, res) => {
    try {
        const courses = await Course.find();
        res.json(courses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.addCourse = async (req, res) => {
    const { title, instructor, progress, image } = req.body;
    const newCourse = new Course({ title, instructor, progress, image });

    try {
        await newCourse.save();
        res.status(201).json(newCourse);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.getCourseDetails = async (req, res) => {
    try {
        const course = await Course.findById(req.params.courseId);
        if (!course) {
            return res.status(404).json({ message: 'Curso no encontrado' });
        }
        res.json(course);
    } catch (error) {
        res.status(400).json({ message: 'Error al obtener los detalles del curso' });
    }
};

exports.getCourseContent = async (req, res) => {
    try {
        const contents = await Content.find({ courseId: req.params.courseId });
        res.json(contents);
    } catch (error) {
        res.status(400).json({ message: 'Error al obtener el contenido del curso' });
    }
};

exports.updateCourse = async (req, res) => {
    const { title, instructor, progress, image } = req.body;
    try {
        const course = await Course.findByIdAndUpdate(req.params.courseId, { title, instructor, progress, image }, { new: true });
        if (!course) {
            return res.status(404).json({ message: 'Curso no encontrado' });
        }
        res.json(course);
    } catch (error) {
        res.status(400).json({ message: 'Error actualizando el curso' });
    }
};

exports.updateCourseProgress = async (req, res) => {
    const { progress } = req.body;
    try {
        const course = await Course.findByIdAndUpdate(req.params.courseId, { progress }, { new: true });
        if (!course) {
            return res.status(404).json({ message: 'Curso no encontrado' });
        }
        res.json(course);
    } catch (error) {
        res.status(400).json({ message: 'Error actualizando el progreso del curso' });
    }
};

exports.deleteCourse = async (req, res) => {
    try {
        const course = await Course.findByIdAndDelete(req.params.courseId);
        if (!course) {
            return res.status(404).json({ message: 'Curso no encontrado' });
        }
        res.json({ message: 'Curso eliminado correctamente' });
    } catch (error) {
        res.status(400).json({ message: 'Error al eliminar el curso' });
    }
};

exports.addCourseContent = async (req, res) => {
    const { title, type, url } = req.body;
    const { courseId } = req.params;
    let filePath = '';

    if (req.file) {
        filePath = req.file.path;
    }

    if (!courseId || !title || !type) {
        return res.status(400).json({ message: 'courseId, title, and type are required' });
    }

    if (type === 'pdf' && !filePath && !url) {
        return res.status(400).json({ message: 'Either file or url is required for pdf content' });
    }

    const newContent = new Content({
        courseId,
        title,
        type,
        url,
        filePath
    });

    try {
        await newContent.save();
        res.status(201).json(newContent);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.updateContentCompletion = async (req, res) => {
    const { completed } = req.body;
    try {
        const content = await Content.findByIdAndUpdate(req.params.contentId, { completed }, { new: true });
        if (!content) {
            return res.status(404).json({ message: 'Contenido no encontrado' });
        }
        const contents = await Content.find({ courseId: content.courseId });
        const completedCount = contents.filter(c => c.completed).length;
        const progress = (completedCount / contents.length) * 100;

        await Course.findByIdAndUpdate(content.courseId, { progress: progress.toFixed(0) }, { new: true });

        res.json({ content, progress });
    } catch (error) {
        res.status(400).json({ message: 'Error actualizando el estado de completado del contenido' });
    }
};

exports.updateContent = async (req, res) => {
    const { contentId } = req.params;
    const { title, type, url, description } = req.body;
    const updateData = { title, type, url, description };

    if (req.file) {
        updateData.filePath = req.file.path;
    }

    try {
        const content = await Content.findByIdAndUpdate(contentId, updateData, { new: true });
        if (!content) {
            return res.status(404).json({ message: 'Contenido no encontrado' });
        }
        res.json(content);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteContent = async (req, res) => {
    const { contentId } = req.params;

    try {
        const content = await Content.findByIdAndDelete(contentId);
        if (!content) {
            return res.status(404).json({ message: 'Contenido no encontrado' });
        }
        res.json({ message: 'Contenido eliminado' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.starCourse = async (req, res) => {
    try {
        const user = await User.findById(req.userId);
        if (!user.starredCourses.includes(req.params.courseId)) {
            user.starredCourses.push(req.params.courseId);
        } else {
            user.starredCourses = user.starredCourses.filter(courseId => courseId.toString() !== req.params.courseId);
        }
        await user.save();
        res.json({ starredCourses: user.starredCourses });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
