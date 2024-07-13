// backend/models/test.model.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const optionSchema = new Schema({
    optionText: { type: String, required: true },
    isCorrect: { type: Boolean, required: true }
});

const questionSchema = new Schema({
    questionText: { type: String, required: true },
    options: [optionSchema]
});

const testSchema = new Schema({
    courseId: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
    title: { type: String, required: true },
    passingScore: { type: Number, required: true },
    questions: [questionSchema]
});

const Test = mongoose.model('Test', testSchema);

module.exports = Test;
