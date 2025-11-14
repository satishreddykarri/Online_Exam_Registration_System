const express = require('express');
const Payment = require('../models/Payment');
const Exam = require('../models/Exam');
const router = express.Router();

// Create payment
router.post('/create', async (req, res) => {
  try {
    const { userId, examId, transactionId, cardLastDigits } = req.body;

    if (!userId || !examId || !transactionId) {
      return res.status(400).json({ 
        message: 'Missing required fields: userId, examId, transactionId' 
      });
    }

    // Check if transaction already exists
    const existingPayment = await Payment.findOne({ transactionId });
    if (existingPayment) {
      return res.status(400).json({ 
        message: 'Transaction ID already exists' 
      });
    }

    const payment = new Payment({
      userId,
      examId,
      transactionId,
      cardLastDigits,
      status: 'completed',
      amount: 500
    });

    await payment.save();

    // Update exam status
    await Exam.findByIdAndUpdate(examId, { status: 'completed' });

    res.status(201).json({ 
      message: 'Payment recorded successfully',
      payment 
    });
  } catch (error) {
    console.error('Payment creation error:', error);
    res.status(500).json({ 
      message: 'Server error during payment',
      error: error.message 
    });
  }
});

// Get payment by transaction ID
router.get('/transaction/:transactionId', async (req, res) => {
  try {
    const payment = await Payment.findOne({ 
      transactionId: req.params.transactionId 
    }).populate('userId', 'name email')
     .populate('examId', 'subject');
    
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    res.status(200).json({ payment });
  } catch (error) {
    console.error('Get payment error:', error);
    res.status(500).json({ 
      message: 'Server error',
      error: error.message 
    });
  }
});

// Get payments by user
router.get('/user/:userId', async (req, res) => {
  try {
    const payments = await Payment.find({ userId: req.params.userId })
      .populate('examId', 'subject')
      .populate('userId', 'name email');
    
    res.status(200).json({ payments });
  } catch (error) {
    console.error('Get user payments error:', error);
    res.status(500).json({ 
      message: 'Server error',
      error: error.message 
    });
  }
});

module.exports = router;