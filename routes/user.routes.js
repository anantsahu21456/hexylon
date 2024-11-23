const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const { authMiddleware } = require('../middlewares/auth.middleware');

const router = express.Router();

// Registration API
router.post('/register', async (req, res) => {
  try {

    const { name, email, password, board, field, standard, dob, age } = req.body;

    const user = new User({ name, email, password, board, field, standard, dob, age });

    await user.save();
    res.status(201).json({ message: 'User registered successfully.' });

  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Login API
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    // Generate JWT
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.cookie('token', token, { httpOnly: true });
    res.status(200).json({ message: 'Login successful.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update User Info API
router.put('/update/:id', async (req, res) => {
    try {
      const userId = req.params.id; // Extract the user ID from the URL
      const updates = req.body; // Get the updated fields from the request body
  
      // Find the user by ID and update their details
      const updatedUser = await User.findByIdAndUpdate(userId, updates, { new: true, runValidators: true });
  
      // If no user is found, return a 404 error
      if (!updatedUser) {
        return res.status(404).json({ error: 'User not found.' });
      }
  
      // Return the updated user details
      res.status(200).json({
        message: 'User updated successfully.',
        updatedUser,
      });
    } catch (error) {
      // Handle any errors
      res.status(500).json({ error: error.message });
    }
  });
  

module.exports = router;
