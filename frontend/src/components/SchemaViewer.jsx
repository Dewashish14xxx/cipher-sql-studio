import { useState } from 'react';

// Parse CREATE TABLE SQL to extract column names and types
function parseColumns(schemaSql) {
    const lines = schemaSql.split('\n');
    const cols = [];
    for (const line of lines) {
        const trimmed = line.trim();
        if (
            trimmed.startsWith('CREATE') ||
            trimmed.startsWith(')') ||
            trimmed.startsWith('--') ||
            trimmed === ''
        ) continue;
        // Match: column_name TYPE(constraints)
        const match = trimmed.match(/^["']?(\w+)["']?\s+(\w+)/);
        if (match) {
            const name = match[1];
            const type = match[2].toUpperCase();
            const isPk = trimmed.toUpperCase().includes('PRIMARY KEY');
            if (!['CONSTRAINT', 'FOREIGN', 'UNIQUE', 'INDEX', 'CHECK', 'REFERENCES'].includes(name.toUpperCase())) {
                cols.push({ name, type, isPk });
            }
        }
    }
    return cols;
}

// Parse INSERT INTO ... VALUES seed SQL into a simple 2D array
function parseSeedData(seedSql, tableName) {
    try {
        // Match VALUES groups: VALUES\n  (...),\n  (...)
        const valBlock = seedSql.match(/VALUES\s*([\s\S]+)/i);
        if (!valBlock) return [];
        const valStr = valBlock[1].trim().replace(/;$/, '');
        // Split on "),\n  (" style
        const rowStrings = valStr.split(/\),\s*\n?\s*\(/);
        return rowStrings.slice(0, 5).map((r) => {
            const clean = r.replace(/^\(/, '').replace(/\)$/, '').trim();
            // Simple CSV split (not perfect for complex types but good enough for seed data)
            return clean.split(/,(?=(?:[^']*'[^']*')*[^']*$)/).map((v) => v.trim().replace(/^'(.*)'$/, '$1'));
        });
    } catch {
        return [];
    }
}

function TableCollapse({ table }) {
    const [open, setOpen] = useState(false);
    const [showSample, setShowSample] = useState(false);
    const cols = parseColumns(table.schema_sql);
    const sampleRows = parseSeedData(table.seed_sql, table.name);
    const sampleCols = cols.map((c) => c.name);

    return (
        <div className="schema-viewer__table">
            <button
                className="schema-viewer__table-header"
                onClick={() => setOpen(!open)}
                aria-expanded={open}
                aria-controls={`table-${table.name}`}
            >
                <span className="schema-viewer__table-name">
                    <span className="schema-viewer__table-name-icon">⊞</span>
                    {table.name}
                </span>
                <span className="schema-viewer__table-toggle">{open ? '▲' : '▼'}</span>
            </button>

            {open && (
                <div id={`table-${table.name}`} className="schema-viewer__cols">
                    {cols.map((col) => (
                        <div key={col.name} className="schema-viewer__col">
                            <span className="schema-viewer__col-name">
                                {col.name}
                                {col.isPk && <span className="schema-viewer__col-pk">PK</span>}
                            </span>
                            <span className="schema-viewer__col-type">{col.type}</span>
                        </div>
                    ))}
                    {sampleRows.length > 0 && (
                        <>
                            <div style={{ padding: '6px 16px 0', display: 'flex', justifyContent: 'flex-end' }}>
                                <button
                                    style={{ background: 'none', border: 'none', color: '#7c6af7', fontSize: '0.75rem', cursor: 'pointer' }}
                                    onClick={() => setShowSample(!showSample)}
                                >
                                    {showSample ? 'Hide' : 'Preview'} sample data
                                </button>
                            </div>
                            {showSample && (
                                <div className="schema-viewer__sample-data">
                                    <table>
                                        <thead>
                                            <tr>{sampleCols.map((c) => <th key={c}>{c}</th>)}</tr>
                                        </thead>
                                        <tbody>
                                            {sampleRows.map((row, i) => (
                                                <tr key={i}>
                                                    {row.map((cell, j) => <td key={j}>{cell}</td>)}
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </>
                    )}
                </div>
            )}
        </div>
    );
}

function SchemaViewer({ tables }) {
    return (
        <div className="schema-viewer">
            <div className="schema-viewer__header">
                <span>📋 Tables</span>
                <span style={{ fontSize: '0.75rem' }}>{tables.length} table{tables.length !== 1 ? 's' : ''}</span>
            </div>
            {tables.map((table) => (
                <TableCollapse key={table.name} table={table} />
            ))}
        </div>
    );
}

export default SchemaViewer;
