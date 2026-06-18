const jwt = require('jsonwebtoken');
const User = require('../models/User');

function generateToken(userId) {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  });
}

// POST /api/auth/register
exports.register = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email and password are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(409).json({ message: 'An account with this email already exists' });
    }

    const user = await User.create({ name, email, password, phone });
    const token = generateToken(user._id);

    res.status(201).json({
      message: 'Account created successfully',
      token,
      user
    });
  } catch (err) {
    console.error('register error:', err.message);
    res.status(500).json({ message: 'Something went wrong while creating your account' });
  }
};

// POST /api/auth/login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = generateToken(user._id);

    res.json({
      message: 'Logged in successfully',
      token,
      user
    });
  } catch (err) {
    console.error('login error:', err.message);
    res.status(500).json({ message: 'Something went wrong while logging in' });
  }
};

// GET /api/auth/me
exports.getMe = async (req, res) => {
  // req.user is already set by the protect middleware
  res.json({ user: req.user });
};

// PUT /api/auth/me
exports.updateMe = async (req, res) => {
  try {
    const { name, phone, addresses } = req.body;

    if (name !== undefined) req.user.name = name;
    if (phone !== undefined) req.user.phone = phone;
    if (addresses !== undefined) req.user.addresses = addresses;

    await req.user.save();
    res.json({ message: 'Profile updated', user: req.user });
  } catch (err) {
    console.error('updateMe error:', err.message);
    res.status(500).json({ message: 'Could not update profile' });
  }
};
