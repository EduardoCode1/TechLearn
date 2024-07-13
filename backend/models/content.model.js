// backend/models/content.model.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const contentSchema = new Schema({
    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    url: {
        type: String,
    },
    type: {
        type: String,
        enum: ['video', 'pdf'],
        required: true
    },
    filePath: {
        type: String,
    },
    completed: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model('Content', contentSchema);
