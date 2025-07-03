const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect('mongodb+srv://georgiHoneyFunny:G2YEpKWxgWx2wSCz@honeyfunny.jspqhva.mongodb.net/?retryWrites=true&w=majority&appName=honeyFunny', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    process.exit(1);
  }
};
module.exports = connectDB;