const mongoose = require('mongoose');

const connectDB = async (uri) => {
    try {
        await mongoose.connect(uri, {
            serverSelectionTimeoutMS: 5000
        });
        mongoose.set('bufferCommands', false);
        console.log('🚀 MongoDB connected');
    } catch(err) {
        console.log('MongoDB connection error:', err);
        throw err;
    }
};

module.exports = {connectDB};