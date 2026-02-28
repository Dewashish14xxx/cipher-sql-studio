const mongoose = require('mongoose');

const tableSchema = new mongoose.Schema({
    name: { type: String, required: true },
    schema_sql: { type: String, required: true },  // CREATE TABLE ...
    seed_sql: { type: String, required: true },     // INSERT INTO ...
});

const assignmentSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        description: { type: String, required: true },
        difficulty: {
            type: String,
            enum: ['easy', 'medium', 'hard'],
            default: 'easy',
        },
        tables: [tableSchema],
        expected_concepts: [String], // e.g. ['JOIN', 'GROUP BY', 'HAVING']
        hint_context: { type: String, default: '' }, // extra context for LLM hints
    },
    { timestamps: true }
);

module.exports = mongoose.model('Assignment', assignmentSchema);
