const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/User');

const router = express.Router();

router.post("/signup", async (req, res) => {
  const { email, password, phone } = req.body;

  try {
    // Check if the user with the provided email or phone number exists
    const existingUser = await User.findOne().or([{ email }, { phone }]);

    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user with hashed password
    const newUser = new User({
      email,
      password: hashedPassword,
      phone,
    });

    // Save the user to the database
    await newUser.save();

    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post("/signin", async (req, res) => {
    const { email, password, phone } = req.body;
  
    try {
      // Check if the user with the provided email or phone number exists
      const user = await User.findOne().or([{ email }, { phone }]);
  
      if (!user) {
        return res.status(404).json({ message: 'Email/Number entered does not exist' });
      }
  
      // Check if the provided password matches the hashed password in the database
      const passwordMatch = await bcrypt.compare(password, user.password);
  
      if (!passwordMatch) {
        return res.status(401).json({ message: 'Entered password is incorrect' });
      }
  
      // Password matches, user is authenticated - You might implement JWT or session management here
  
      res.status(200).json({ message: 'Login successful' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  });

module.exports = router;
