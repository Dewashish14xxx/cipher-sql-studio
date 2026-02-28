import { useState } from 'react';
import { getHint } from '../api';

function HintPanel({ assignmentId, query, queryResult }) {
    const [open, setOpen] = useState(false);
    const [hint, setHint] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const fetchHint = async () => {
        setLoading(true);
        setError('');
        try {
            const res = await getHint({
                assignmentId,
                query,
                queryResult: queryResult ? JSON.stringify(queryResult) : '',
            });
            setHint(res.data.hint);
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to get hint. Is your GEMINI_API_KEY set?');
        } finally {
            setLoading(false);
        }
    };

    const handleToggle = () => {
        if (!open && !hint) fetchHint();
        setOpen(!open);
    };

    const handleRefresh = () => {
        setHint('');
        fetchHint();
    };

    return (
        <div className="hint-panel">
            <button
                className="hint-panel__toggle"
                onClick={handleToggle}
                aria-expanded={open}
                aria-controls="hint-panel-content"
                id="hint-panel-btn"
            >
                <span className="hint-panel__toggle-label">
                    <span className="hint-panel__toggle-label-icon">💡</span>
                    Get a Hint
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-dim, #555980)' }}>
                    {open ? '▲ Hide' : '▼ Show'}
                </span>
            </button>

            {open && (
                <div className="hint-panel__content" id="hint-panel-content" role="region" aria-live="polite">
                    {loading && (
                        <div className="hint-panel__loading">
                            <div className="spinner" style={{ width: 20, height: 20 }} aria-hidden="true" />
                            <span>Thinking…</span>
                        </div>
                    )}
                    {!loading && error && (
                        <p className="hint-panel__error">{error}</p>
                    )}
                    {!loading && hint && (
                        <>
                            <div className="hint-panel__text">{hint}</div>
                            <div style={{ display: 'flex', gap: 8 }}>
                                <button className="btn btn--ghost btn--sm" onClick={handleRefresh}>
                                    🔄 Another hint
                                </button>
                            </div>
                        </>
                    )}
                </div>
            )}
        </div>
    );
}

export default HintPanel;
