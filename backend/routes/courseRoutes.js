// backend/routes/course.routes.js
const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();
const CourseController = require('../controllers/courseController');

// Configuración de multer para almacenar archivos
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

router.get('/', CourseController.getCourses);
router.post('/', CourseController.addCourse);
router.get('/:courseId', CourseController.getCourseDetails);
router.get('/:courseId/content', CourseController.getCourseContent);
router.put('/:courseId', CourseController.updateCourse);
router.put('/:courseId/progress', CourseController.updateCourseProgress);
router.delete('/:courseId', CourseController.deleteCourse);
router.post('/:courseId/content', upload.single('file'), CourseController.addCourseContent);

module.exports = router;
