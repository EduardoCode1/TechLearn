// backend/models/course.model.js
const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    title: { type: String, required: true },
    instructor: { type: String, required: true },
    image: { type: String, required: true },
    progress: { type: Number, default: 0 },
    description: { type: String },
    contents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Content' }]
});

module.exports = mongoose.model('Course', courseSchema);
