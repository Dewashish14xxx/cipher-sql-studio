const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const signToken = (user) =>
    jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, {
        expiresIn: '7d',
    });

// POST /api/auth/register
router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        return res.status(400).json({ success: false, error: 'All fields are required.' });
    }
    try {
        const existing = await User.findOne({ email });
        if (existing) {
            return res.status(409).json({ success: false, error: 'Email already registered.' });
        }
        const user = await User.create({ name, email, passwordHash: password });
        const token = signToken(user);
        res.status(201).json({
            success: true,
            token,
            user: { id: user._id, name: user.name, email: user.email },
        });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ success: false, error: 'Email and password are required.' });
    }
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ success: false, error: 'Invalid credentials.' });
        }
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ success: false, error: 'Invalid credentials.' });
        }
        const token = signToken(user);
        res.json({
            success: true,
            token,
            user: { id: user._id, name: user.name, email: user.email },
        });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

module.exports = router;
