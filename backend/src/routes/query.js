const express = require('express');
const router = express.Router();
const Assignment = require('../models/Assignment');
const Attempt = require('../models/Attempt');
const { executeQuery } = require('../services/queryService');

// POST /api/query - run a SQL query against an assignment's sandbox
router.post('/', async (req, res) => {
    const { assignmentId, query, userId } = req.body;

    if (!assignmentId || !query) {
        return res
            .status(400)
            .json({ success: false, error: 'assignmentId and query are required.' });
    }

    try {
        const assignment = await Assignment.findById(assignmentId);
        if (!assignment) {
            return res.status(404).json({ success: false, error: 'Assignment not found.' });
        }

        const { columns, rows, rowCount } = await executeQuery(assignment, query);

        // Save the attempt to MongoDB
        await Attempt.create({
            userId: userId || null,
            assignmentId,
            query,
            success: true,
            rowCount,
        });

        res.json({ success: true, columns, rows, rowCount });
    } catch (err) {
        // Save failed attempt
        try {
            await Attempt.create({
                userId: req.body.userId || null,
                assignmentId,
                query,
                success: false,
                error: err.message,
            });
        } catch (_) { /* ignore attempt save error */ }

        res.status(400).json({ success: false, error: err.message });
    }
});

module.exports = router;
