const express = require('express');
const router = express.Router();
const Assignment = require('../models/Assignment');

// GET /api/assignments - list all assignments
router.get('/', async (req, res) => {
    try {
        const assignments = await Assignment.find(
            {},
            'title description difficulty expected_concepts createdAt'
        ).sort({ createdAt: 1 });
        res.json({ success: true, data: assignments });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// GET /api/assignments/:id - get a single assignment with full table data
router.get('/:id', async (req, res) => {
    try {
        const assignment = await Assignment.findById(req.params.id);
        if (!assignment) {
            return res.status(404).json({ success: false, error: 'Assignment not found' });
        }
        res.json({ success: true, data: assignment });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

module.exports = router;
