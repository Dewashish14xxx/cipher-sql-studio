const express = require('express');
const router = express.Router();
const Attempt = require('../models/Attempt');
const { requireAuth } = require('../middleware/auth');

// GET /api/history/:assignmentId
// Get the query history for a specific assignment for the logged-in user
router.get('/:assignmentId', requireAuth, async (req, res) => {
    try {
        const history = await Attempt.find({
            userId: req.user.id,
            assignmentId: req.params.assignmentId,
        })
            .sort({ createdAt: -1 })
            .limit(20); // Return last 20 queries

        res.json({ success: true, data: history });
    } catch (err) {
        console.error('History fetch error:', err);
        res.status(500).json({ success: false, error: 'Failed to fetch query history.' });
    }
});

module.exports = router;
