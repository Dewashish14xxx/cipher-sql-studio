import { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getAssignment, runQuery, saveProgress, getProgress } from '../api';
import SchemaViewer from '../components/SchemaViewer';
import SqlEditor from '../components/SqlEditor';
import ResultsTable from '../components/ResultsTable';
import HintPanel from '../components/HintPanel';
import HistoryPanel from '../components/HistoryPanel';
import { useAuth } from '../context/AuthContext';

function AttemptPage() {
    const { id } = useParams();
    const { user } = useAuth();

    const [assignment, setAssignment] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [query, setQuery] = useState('-- Write your SQL query here\nSELECT * FROM ');
    const [executing, setExecuting] = useState(false);
    const [result, setResult] = useState(null); // { columns, rows, rowCount }
    const [queryError, setQueryError] = useState('');
    const [isCompleted, setIsCompleted] = useState(false);
    const [markingCompleted, setMarkingCompleted] = useState(false);

    useEffect(() => {
        getAssignment(id)
            .then((res) => {
                const a = res.data.data;
                setAssignment(a);
                // Pre-fill query with first table name
                if (a.tables?.length && !query) {
                    setQuery(`-- Write your SQL query here\nSELECT * FROM ${a.tables[0].name} LIMIT 10;`);
                }
            })
            .catch((err) => setError(err.response?.data?.error || 'Assignment not found.'))
            .finally(() => setLoading(false));

        if (user) {
            getProgress()
                .then(res => {
                    if (res.data?.data?.includes(id)) {
                        setIsCompleted(true);
                    }
                })
                .catch(err => console.error('Failed to load progress', err));
        }
    }, [id, user]);

    const executeQuery = useCallback(async () => {
        if (!query.trim() || executing) return;
        setExecuting(true);
        setQueryError('');
        setResult(null);
        try {
            const res = await runQuery({
                assignmentId: id,
                query,
                userId: user?.id || null,
            });
            setResult({
                columns: res.data.columns,
                rows: res.data.rows,
                rowCount: res.data.rowCount,
            });
        } catch (err) {
            setQueryError(err.response?.data?.error || 'Query execution failed.');
        } finally {
            setExecuting(false);
        }
    }, [id, query, executing, user]);

    const handleMarkCompleted = async () => {
        if (!user || markingCompleted || isCompleted) return;
        setMarkingCompleted(true);
        try {
            await saveProgress(id);
            setIsCompleted(true);
        } catch (err) {
            console.error('Failed to mark completed', err);
        } finally {
            setMarkingCompleted(false);
        }
    };

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
                <div className="spinner" aria-label="Loading assignment" />
            </div>
        );
    }

    if (error) {
        return (
            <div style={{ textAlign: 'center', padding: '48px', color: '#f4607a' }}>
                <p style={{ fontSize: '1.1rem', marginBottom: 12 }}>⚠️ {error}</p>
                <Link to="/" className="btn btn--ghost">← Back to assignments</Link>
            </div>
        );
    }

    const diffClass = assignment.difficulty;

    return (
        <div className="attempt-page">
            <div className="attempt-page__top">
                {/* Sidebar */}
                <aside className="attempt-page__sidebar" aria-label="Assignment details">
                    <Link to="/" className="attempt-page__back" aria-label="Back to assignments">
                        ← All Assignments
                    </Link>

                    {/* Question Panel */}
                    <div className="question-panel">
                        <div className="question-panel__header">
                            <h1 className="question-panel__title">{assignment.title}</h1>
                            <span className={`assignment-card__badge assignment-card__badge--${diffClass}`}>
                                {diffClass}
                            </span>
                        </div>
                        <div className="question-panel__label">Objective</div>
                        <p className="question-panel__description">{assignment.description}</p>
                        {assignment.expected_concepts?.length > 0 && (
                            <>
                                <div className="question-panel__label">SQL Concepts</div>
                                <div className="question-panel__concepts">
                                    {assignment.expected_concepts.map((c) => (
                                        <span key={c} className="question-panel__concept">{c}</span>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>

                    {/* Schema Viewer */}
                    {assignment.tables?.length > 0 && (
                        <SchemaViewer tables={assignment.tables} />
                    )}
                </aside>

                {/* Main panel */}
                <div className="attempt-page__main">
                    {/* Editor */}
                    <div className="editor-section">
                        <div className="editor-section__header">
                            <div className="editor-section__title">
                                <span>✏️</span> SQL Editor
                                <span style={{ fontSize: '0.72rem', color: '#555980', marginLeft: 8 }}>
                                    Ctrl+Enter to run
                                </span>
                            </div>
                            <div className="editor-section__actions">
                                {user && (
                                    <button
                                        className={`btn ${isCompleted ? 'btn--ghost' : 'btn--outline'}`}
                                        onClick={handleMarkCompleted}
                                        disabled={markingCompleted || isCompleted}
                                        style={{ marginRight: '8px' }}
                                    >
                                        {isCompleted ? '✅ Completed' : markingCompleted ? '...' : 'Mark as Completed'}
                                    </button>
                                )}
                                <button
                                    id="execute-btn"
                                    className="btn btn--accent"
                                    onClick={executeQuery}
                                    disabled={executing || !query.trim()}
                                    aria-label="Execute SQL query"
                                >
                                    {executing ? (
                                        <>
                                            <span className="spinner" style={{ width: 14, height: 14 }} aria-hidden="true" />
                                            Running…
                                        </>
                                    ) : (
                                        '▶ Run Query'
                                    )}
                                </button>
                            </div>
                        </div>
                        <SqlEditor
                            value={query}
                            onChange={(v) => setQuery(v || '')}
                            onExecute={executeQuery}
                            isLoading={executing}
                        />
                    </div>

                    {/* Results */}
                    <div className="results-section">
                        <div className="results-section__header">
                            <div className="results-section__title">📊 Results</div>
                            {result && (
                                <div className="results-section__meta">
                                    {result.rowCount} row{result.rowCount !== 1 ? 's' : ''}
                                </div>
                            )}
                        </div>
                        <div className="results-section__body">
                            {queryError ? (
                                <div className="results-section__error" role="alert">
                                    <strong>Error:</strong> {queryError}
                                </div>
                            ) : (
                                <ResultsTable
                                    columns={result?.columns}
                                    rows={result?.rows}
                                />
                            )}
                        </div>
                    </div>

                    {/* Hint */}
                    <HintPanel
                        assignmentId={id}
                        query={query}
                        queryResult={result}
                    />

                    {/* History */}
                    {user && (
                        <HistoryPanel
                            assignmentId={id}
                            onSelectQuery={(q) => setQuery(q)}
                            user={user}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}

export default AttemptPage;
