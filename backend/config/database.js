const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('DB connected');
    } catch (err) {
        console.error('DB connection error:', err);
        process.exit(1);
    }
};

module.exports = connectDB;
