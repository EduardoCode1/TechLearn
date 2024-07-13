// backend/models/courseContent.model.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const courseContentSchema = new Schema({
    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true
    },
    type: {
        type: String,
        enum: ['video', 'pdf'],
        required: true
    },
    title: {
        type: String,
        required: true
    },
    url: {
        type: String,
        default: ""
    },
    filePath: {
        type: String,
        default: ""
    }
});

module.exports = mongoose.model('CourseContent', courseContentSchema);
