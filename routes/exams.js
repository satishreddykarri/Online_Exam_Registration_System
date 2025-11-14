const express = require('express');
const Exam = require('../models/Exam');
const User = require('../models/User');
const router = express.Router();

// Register for exam
router.post('/register', async (req, res) => {
  try {
    const { userId, subject } = req.body;

    if (!userId || !subject) {
      return res.status(400).json({ 
        message: 'User ID and subject are required' 
      });
    }

    // Verify user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const exam = new Exam({
      userId,
      subject,
      status: 'registered'
    });

    await exam.save();

    res.status(201).json({ 
      message: 'Exam registered successfully',
      exam 
    });
  } catch (error) {
    console.error('Exam registration error:', error);
    res.status(500).json({ 
      message: 'Server error during exam registration',
      error: error.message 
    });
  }
});

// Get exams by user
router.get('/user/:userId', async (req, res) => {
  try {
    const exams = await Exam.find({ userId: req.params.userId })
      .populate('userId', 'name rollNumber email');
    
    res.status(200).json({ exams });
  } catch (error) {
    console.error('Get exams error:', error);
    res.status(500).json({ 
      message: 'Server error',
      error: error.message 
    });
  }
});

// Get all exams
router.get('/', async (req, res) => {
  try {
    const exams = await Exam.find()
      .populate('userId', 'name rollNumber email');
    
    res.status(200).json({ exams });
  } catch (error) {
    console.error('Get all exams error:', error);
    res.status(500).json({ 
      message: 'Server error',
      error: error.message 
    });
  }
});

module.exports = router;