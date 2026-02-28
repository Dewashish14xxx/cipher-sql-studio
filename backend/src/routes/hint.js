const express = require('express');
const router = express.Router();
const Assignment = require('../models/Assignment');
const { getHint } = require('../services/hintService');

// POST /api/hint - get an LLM hint for the current query attempt
router.post('/', async (req, res) => {
    const { assignmentId, query, queryResult } = req.body;

    if (!assignmentId) {
        return res.status(400).json({ success: false, error: 'assignmentId is required.' });
    }

    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_gemini_api_key_here') {
        return res.status(503).json({
            success: false,
            error: 'LLM hint service is not configured. Please set GEMINI_API_KEY in your .env file.',
        });
    }

    try {
        const assignment = await Assignment.findById(assignmentId);
        if (!assignment) {
            return res.status(404).json({ success: false, error: 'Assignment not found.' });
        }

        const resultStr = queryResult
            ? typeof queryResult === 'object'
                ? JSON.stringify(queryResult).slice(0, 500)
                : String(queryResult).slice(0, 500)
            : '';

        const hint = await getHint(assignment, query || '', resultStr);
        res.json({ success: true, hint });
    } catch (err) {
        res.status(500).json({ success: false, error: 'Failed to get hint: ' + err.message });
    }
});

module.exports = router;
