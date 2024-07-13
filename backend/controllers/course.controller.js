const Course = require('../models/course.model');

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
