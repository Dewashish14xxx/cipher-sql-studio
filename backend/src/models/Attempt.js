const mongoose = require('mongoose');

const attemptSchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
        assignmentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Assignment',
            required: true,
        },
        query: { type: String, required: true },
        success: { type: Boolean, default: false },
        error: { type: String, default: null },
        rowCount: { type: Number, default: 0 },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Attempt', attemptSchema);
