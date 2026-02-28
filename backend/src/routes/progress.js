const express = require('express');
const router = express.Router();
const UserProgress = require('../models/UserProgress');
const { protect } = require('../middleware/auth');

// GET /api/progress
// Get all completed assignments for the logged-in user
router.get('/', protect, async (req, res) => {
    try {
        const progress = await UserProgress.find({ userId: req.user.id })
            .select('assignmentId completedAt')
            .lean();

        // Return array of assignment IDs that are completed
        const completedIds = progress.map(p => p.assignmentId.toString());
        res.json({ success: true, data: completedIds });
    } catch (err) {
        console.error('Progress fetch error:', err);
        res.status(500).json({ success: false, error: 'Failed to fetch user progress.' });
    }
});

// POST /api/progress/:assignmentId
// Mark an assignment as completed for the logged-in user
router.post('/:assignmentId', protect, async (req, res) => {
    try {
        // Upsert to handle if they mark it completed multiple times
        await UserProgress.findOneAndUpdate(
            { userId: req.user.id, assignmentId: req.params.assignmentId },
            { $setOnInsert: { completedAt: new Date() } },
            { upsert: true, new: true }
        );

        res.json({ success: true, message: 'Assignment marked as completed.' });
    } catch (err) {
        console.error('Progress update error:', err);
        res.status(500).json({ success: false, error: 'Failed to update progress.' });
    }
});

module.exports = router;
