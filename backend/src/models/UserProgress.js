const mongoose = require('mongoose');

const userProgressSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    assignmentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Assignment',
        required: true,
    },
    completedAt: {
        type: Date,
        default: Date.now,
    },
});

// Ensure a user can only have one progress record per assignment
userProgressSchema.index({ userId: 1, assignmentId: 1 }, { unique: true });

module.exports = mongoose.model('UserProgress', userProgressSchema);
