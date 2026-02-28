const express = require('express');
const router = express.Router();
const User = require('../models/User');
const UserProgress = require('../models/UserProgress');
const { requireAuth } = require('../middleware/auth');

// GET /api/users/profile
router.get('/profile', requireAuth, async (req, res, next) => {
    try {
        const user = await User.findById(req.userId).select('-passwordHash');
        if (!user) return res.status(404).json({ error: 'User not found' });

        const completedCount = await UserProgress.countDocuments({ userId: req.userId });

        res.json({
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                bio: user.bio,
                createdAt: user.createdAt
            },
            completedCount
        });
    } catch (err) {
        next(err);
    }
});

// PUT /api/users/profile
router.put('/profile', requireAuth, async (req, res, next) => {
    try {
        const { name, bio } = req.body;

        const updateData = {};
        if (name !== undefined) updateData.name = name;
        if (bio !== undefined) updateData.bio = bio;

        const updatedUser = await User.findByIdAndUpdate(
            req.userId,
            updateData,
            { new: true, runValidators: true }
        ).select('-passwordHash');

        if (!updatedUser) return res.status(404).json({ error: 'User not found' });

        res.json({ user: updatedUser });
    } catch (err) {
        next(err);
    }
});

module.exports = router;
