const express = require('express');
const User = require('../models/User');
const router = express.Router();

// Register User
router.post('/signup', async (req, res) => {
  try {
    const { name, rollNumber, phone, email, password } = req.body;

    // Validation
    if (!name || !rollNumber || !phone || !email || !password) {
      return res.status(400).json({ 
        message: 'All fields are required',
        fields: { name, rollNumber, phone, email, password: !!password }
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    // Phone validation (10 digits)
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phone)) {
      return res.status(400).json({ message: 'Phone must be 10 digits' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ 
      $or: [{ email }, { rollNumber }] 
    });
    
    if (existingUser) {
      return res.status(400).json({ 
        message: existingUser.email === email 
          ? 'Email already registered' 
          : 'Roll number already registered'
      });
    }

    // Create new user
    const newUser = new User({
      name,
      rollNumber,
      phone,
      email,
      password
    });

    await newUser.save();

    res.status(201).json({ 
      message: 'User registered successfully',
      user: {
        id: newUser._id,
        name: newUser.name,
        rollNumber: newUser.rollNumber,
        email: newUser.email,
        phone: newUser.phone
      }
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ 
      message: 'Server error during registration',
      error: error.message 
    });
  }
});

// Login User
router.post('/login', async (req, res) => {
  try {
    const { rollNumber, password } = req.body;

    // Validation
    if (!rollNumber || !password) {
      return res.status(400).json({ 
        message: 'Roll number and password are required' 
      });
    }

    // Find user
    const user = await User.findOne({ rollNumber });
    
    if (!user) {
      return res.status(400).json({ 
        message: 'Invalid credentials - user not found' 
      });
    }

    // Compare password
    const isPasswordValid = await user.comparePassword(password);
    
    if (!isPasswordValid) {
      return res.status(400).json({ 
        message: 'Invalid credentials - wrong password' 
      });
    }

    res.status(200).json({ 
      message: 'Login successful',
      user: {
        id: user._id,
        name: user.name,
        rollNumber: user.rollNumber,
        email: user.email,
        phone: user.phone
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      message: 'Server error during login',
      error: error.message 
    });
  }
});

// Get User by ID
router.get('/user/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ user });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ 
      message: 'Server error',
      error: error.message 
    });
  }
});

module.exports = router;