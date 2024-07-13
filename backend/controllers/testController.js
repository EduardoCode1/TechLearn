// backend/controllers/testController.js
const Test = require('../models/test.model');

exports.createTest = async (req, res) => {
    const { courseId, title, questions, passingGrade } = req.body;

    const newTest = new Test({
        courseId,
        title,
        questions,
        passingGrade
    });

    try {
        await newTest.save();
        res.status(201).json(newTest);
    } catch (error) {
        res.status(500).json({ message: 'Error creando el test', error });
    }
};

exports.getTestsByCourse = async (req, res) => {
    const { courseId } = req.params;
    try {
        const tests = await Test.find({ courseId });
        res.status(200).json(tests);
    } catch (error) {
        res.status(500).json({ message: 'Error obteniendo los tests', error });
    }
};

exports.getTestById = async (req, res) => {
    const { testId } = req.params;
    try {
        const test = await Test.findById(testId);
        if (!test) {
            return res.status(404).json({ message: 'Test no encontrado' });
        }
        res.status(200).json(test);
    } catch (error) {
        res.status(500).json({ message: 'Error obteniendo el test', error });
    }
};

exports.submitTest = async (req, res) => {
    const { testId, answers } = req.body;
    try {
        const test = await Test.findById(testId);
        if (!test) {
            return res.status(404).json({ message: 'Test no encontrado' });
        }

        let score = 0;
        test.questions.forEach((question, index) => {
            if (question.correctOption === answers[index]) {
                score += 1;
            }
        });

        const result = {
            score,
            passed: score >= test.passingGrade
        };

        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: 'Error al enviar el test', error });
    }
};
