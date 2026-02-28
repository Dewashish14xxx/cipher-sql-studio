const { Pool } = require('pg');

const pool = new Pool({
    host: process.env.PG_HOST || 'localhost',
    port: parseInt(process.env.PG_PORT || '5432'),
    user: process.env.PG_USER || 'postgres',
    password: process.env.PG_PASSWORD || '',
    database: process.env.PG_DATABASE || 'ciphersql_sandbox',
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000,
    statement_timeout: 5000, // 5 second query timeout
    ...(process.env.PG_SSL === 'true' ? { ssl: { rejectUnauthorized: false } } : {}),
});

pool.on('error', (err) => {
    console.error('PG pool error:', err.message);
});

module.exports = pool;
