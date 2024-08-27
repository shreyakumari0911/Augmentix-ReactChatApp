const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { check, validationResult } = require('express-validator');
const User = require('../models/User');
const authorize = require('../middlewares/auth');

const router = express.Router();

// Register
router.post('/register', [
  check('username')
    .notEmpty()
    .withMessage('Username is required')
    .isLength({ min: 3 })
    .withMessage('Name must be at least 3 characters long'),
  check('email', 'Email is required').notEmpty().isEmail().withMessage('Invalid email format'),
  check('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 6, max: 20 })
    .withMessage('Password should be between 6 to 20 characters long'),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
    });

    const savedUser = await newUser.save();
    res.status(201).json({
      message: 'User successfully created!',
      result: savedUser,
    });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(401).json({ message: 'Authentication failed' });
    }

    const isPasswordValid = await bcrypt.compare(req.body.password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Authentication failed' });
    }

    // Uncomment this section to include JWT generation if needed
    // const jwtToken = jwt.sign(
    //   { email: user.email, userId: user._id },
    //   'longer-secret-is-better',
    //   { expiresIn: '1h' }
    // );

    // res.status(200).json({
    //   token: jwtToken,
    //   expiresIn: 3600,
    //   _id: user._id,
    //   user: user
    // });

    res.status(200).send(user); // Sending the user object as response
  } catch (err) {
    console.error('Error during login:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;
