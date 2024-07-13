// backend/routes/courseContent.routes.js
const express = require('express');
const router = express.Router();
const courseContentController = require('../controllers/courseContent.controller');

router.post('/add', courseContentController.addContent);
router.get('/:courseId', courseContentController.getContentByCourse);
router.delete('/:contentId', courseContentController.deleteContent);

module.exports = router;
