// backend/routes/test.routes.js
const express = require('express');
const router = express.Router();
const testController = require('../controllers/testController');

router.post('/', testController.createTest);
router.get('/:testId', testController.getTestById);

module.exports = router;
