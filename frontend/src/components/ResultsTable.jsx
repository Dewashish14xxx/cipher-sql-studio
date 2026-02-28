function ResultsTable({ columns, rows }) {
    if (!columns || columns.length === 0) {
        return (
            <div className="results-section__empty">
                <span style={{ fontSize: '2rem' }}>📊</span>
                <span>Run a query to see results here</span>
            </div>
        );
    }

    return (
        <table className="results-table" role="table" aria-label="Query results">
            <thead className="results-table__head">
                <tr>
                    {columns.map((col) => (
                        <th key={col} className="results-table__th" scope="col">{col}</th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {rows.map((row, rowIdx) => (
                    <tr key={rowIdx}>
                        {columns.map((col) => (
                            <td key={col} className="results-table__td" title={String(row[col] ?? '')}>
                                {row[col] === null || row[col] === undefined ? (
                                    <span className="results-table__null">NULL</span>
                                ) : (
                                    String(row[col])
                                )}
                            </td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    );
}

export default ResultsTable;
