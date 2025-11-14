// filepath: c:\Users\satis\oose Project\models\Exam.js
const mongoose = require('mongoose');

const examSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  subject: {
    type: String,
    required: true
  },
  registeredAt: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['registered', 'completed', 'pending'],
    default: 'registered'
  }
});

module.exports = mongoose.model('Exam', examSchema);