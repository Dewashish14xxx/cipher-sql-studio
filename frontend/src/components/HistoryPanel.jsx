import { useState, useEffect } from 'react';
import { getHistory } from '../api';

function HistoryPanel({ assignmentId, onSelectQuery, user }) {
    const [history, setHistory] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!isOpen || !user) return;

        let isMounted = true;
        setLoading(true);

        getHistory(assignmentId)
            .then(res => {
                if (isMounted && res.data.success) {
                    setHistory(res.data.data || []);
                }
            })
            .catch(err => console.error('Failed to fetch history', err))
            .finally(() => {
                if (isMounted) setLoading(false);
            });

        return () => { isMounted = false; };
    }, [isOpen, assignmentId, user]);

    // Format date string nicely
    const formatDate = (dateString) => {
        const d = new Date(dateString);
        return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    };

    if (!user) return null; // Don't show history if logged out

    return (
        <div className="hint-panel" style={{ borderTop: 'none', borderBottom: '1px solid var(--color-border)' }}>
            <button
                className="hint-panel__toggle"
                onClick={() => setIsOpen(!isOpen)}
                aria-expanded={isOpen}
            >
                <div className="hint-panel__toggle-label">
                    <span className="hint-panel__toggle-label-icon">🕒</span>
                    Query History
                </div>
                <span>{isOpen ? '▼' : '▶'}</span>
            </button>

            {isOpen && (
                <div className="hint-panel__content">
                    {loading ? (
                        <div className="hint-panel__loading">
                            <span className="spinner" style={{ width: 14, height: 14 }} aria-hidden="true" />
                            Loading past queries...
                        </div>
                    ) : history.length === 0 ? (
                        <div className="hint-panel__text" style={{ textAlign: 'center', opacity: 0.7 }}>
                            No past queries found for this assignment. Run a query to see it here!
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            {history.map((h) => (
                                <button
                                    key={h._id}
                                    onClick={() => onSelectQuery(h.query)}
                                    style={{
                                        display: 'block',
                                        width: '100%',
                                        textAlign: 'left',
                                        background: h.success ? 'rgba(34, 211, 168, 0.05)' : 'rgba(244, 96, 122, 0.05)',
                                        border: `1px solid ${h.success ? 'rgba(34, 211, 168, 0.2)' : 'rgba(244, 96, 122, 0.2)'}`,
                                        padding: '12px',
                                        borderRadius: 'var(--radius-md)',
                                        cursor: 'pointer',
                                        fontFamily: 'var(--font-mono)',
                                        fontSize: '0.8rem',
                                        color: 'var(--color-text)'
                                    }}
                                    title="Click to copy back to editor"
                                >
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.7rem', color: 'var(--color-text-dim)', fontFamily: 'var(--font-sans)', textTransform: 'uppercase' }}>
                                        <span>{h.success ? '✅ Success' : '❌ Failed'}</span>
                                        <span>{formatDate(h.createdAt)}</span>
                                    </div>
                                    <div style={{ whiteSpace: 'pre-wrap', color: 'var(--color-text-muted)' }}>
                                        {h.query.length > 100 ? h.query.substring(0, 100) + '...' : h.query}
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default HistoryPanel;
