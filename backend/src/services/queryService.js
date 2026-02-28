const pool = require('../config/pgPool');

// Only allow plain SELECT queries (validate the ORIGINAL user query before qualification)
const isSelectOnly = (query) => {
    const trimmed = query.trim().toLowerCase();
    const startsWithSelect = trimmed.startsWith('select');
    const blockedKeywords = [
        'insert', 'update', 'delete', 'drop', 'alter', 'create',
        'truncate', 'grant', 'revoke', 'exec', 'execute', 'pg_', 'copy',
    ];
    const hasBlockedKeyword = blockedKeywords.some((kw) => {
        const regex = new RegExp(`\\b${kw}\\b`, 'i');
        return regex.test(trimmed);
    });
    return startsWithSelect && !hasBlockedKeyword;
};

/**
 * Strip REFERENCES(...) foreign key inline constraints from a CREATE TABLE
 * statement so tables can be created in any order in the sandbox.
 */
const stripForeignKeys = (sql) => {
    // Remove "REFERENCES tablename(col)" including optional ON DELETE/UPDATE clauses
    return sql.replace(/\s+REFERENCES\s+\w+\s*\([^)]+\)(\s+ON\s+(DELETE|UPDATE)\s+\w+)*/gi, '');
};

/**
 * Qualify all table names in a SQL string with the given schema.
 */
const qualifyTableNames = (sql, schemaName, tableNames) => {
    let q = sql;
    for (const name of tableNames) {
        // Replace bare table names not already prefixed by a dot
        const regex = new RegExp(`(?<![."])\\b${name}\\b`, 'gi');
        q = q.replace(regex, `"${schemaName}"."${name}"`);
    }
    return q;
};

/**
 * Ensure the assignment's schema + tables exist in PG with seed data.
 * Drops and recreates tables fresh on each call.
 * Does NOT use transactions (avoids Neon pooler transaction issues).
 * Strips foreign key constraints so table creation order doesn't matter.
 */
const ensureSchema = async (assignment) => {
    const schemaName = `assignment_${assignment._id.toString()}`;
    const tableNames = assignment.tables.map((t) => t.name);
    const client = await pool.connect();
    try {
        // Create schema
        await client.query(`CREATE SCHEMA IF NOT EXISTS "${schemaName}"`);

        // Drop all tables first (cascade handles FK deps)
        for (const table of assignment.tables) {
            await client.query(`DROP TABLE IF EXISTS "${schemaName}"."${table.name}" CASCADE`);
        }

        // Create tables (with FK constraints stripped)
        for (const table of assignment.tables) {
            const cleanDDL = stripForeignKeys(table.schema_sql);
            const qualifiedDDL = qualifyTableNames(cleanDDL, schemaName, tableNames);
            await client.query(qualifiedDDL);
        }

        // Insert seed data for all tables
        for (const table of assignment.tables) {
            const qualifiedSeed = table.seed_sql.replace(
                new RegExp(`\\bINSERT INTO\\s+${table.name}\\b`, 'gi'),
                `INSERT INTO "${schemaName}"."${table.name}"`
            );
            await client.query(qualifiedSeed);
        }

        return schemaName;
    } catch (err) {
        console.error(`[ensureSchema] Error: ${err.message}`);
        throw err;
    } finally {
        client.release();
    }
};

/**
 * Execute a user SQL query in the assignment's sandboxed schema.
 * Table names in the user's query are automatically schema-qualified.
 */
const executeQuery = async (assignment, userQuery) => {
    // Validate ORIGINAL query before any qualification
    if (!isSelectOnly(userQuery)) {
        throw new Error('Only SELECT queries are allowed in the sandbox.');
    }

    // Set up sandbox schema + seed data
    const schemaName = await ensureSchema(assignment);

    // Qualify bare table names in user query so they resolve without search_path
    const tableNames = assignment.tables.map((t) => t.name);
    const qualifiedQuery = qualifyTableNames(userQuery, schemaName, tableNames);

    // Execute
    const client = await pool.connect();
    try {
        const result = await client.query(qualifiedQuery);
        const columns = result.fields ? result.fields.map((f) => f.name) : [];
        const rows = result.rows || [];
        return { columns, rows: rows.slice(0, 500), rowCount: rows.length };
    } catch (err) {
        throw new Error(err.message);
    } finally {
        client.release();
    }
};

module.exports = { executeQuery };
