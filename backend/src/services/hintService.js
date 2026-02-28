const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Get an LLM hint for the user's SQL attempt.
 * @param {Object} assignment - the Mongoose assignment doc
 * @param {string} userQuery - what the user has typed
 * @param {string} queryResult - stringified result or error message
 */
const getHint = async (assignment, userQuery, queryResult) => {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    // Summarize table schemas for the prompt
    const schemaSummary = assignment.tables
        .map((t) => `Table: ${t.name}\n${t.schema_sql}`)
        .join('\n\n');

    const concepts =
        assignment.expected_concepts.length > 0
            ? `Relevant SQL concepts for this assignment: ${assignment.expected_concepts.join(', ')}.`
            : '';

    const prompt = `
You are a friendly SQL tutor helping a student learn SQL.

Assignment Title: "${assignment.title}"
Assignment Description: "${assignment.description}"
${concepts}

Available table schemas:
${schemaSummary}

The student's current SQL query:
\`\`\`sql
${userQuery || '(the student has not written any query yet)'}
\`\`\`

Result or error from running the query:
${queryResult || 'No query run yet.'}

${assignment.hint_context ? `Additional context: ${assignment.hint_context}` : ''}

IMPORTANT INSTRUCTIONS:
- Provide a HINT only — do NOT write complete SQL code for them.
- Do NOT reveal the full answer or solution.
- Guide the student to think about what SQL concept, clause, or function they might be missing or using incorrectly.
- Keep your response concise — under 100 words.
- Be encouraging and positive.
`.trim();

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    return text;
};

module.exports = { getHint };
