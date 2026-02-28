import { useState, useEffect } from 'react';
import { getLeaderboard } from '../api';

function LeaderboardPage() {
    const [leaderboard, setLeaderboard] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getLeaderboard()
            .then(res => setLeaderboard(res.data.leaderboard))
            .catch(err => console.error("Failed to load leaderboard", err))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <main className="dashboard"><p>Loading leaderboard...</p></main>;

    return (
        <main className="dashboard">
            <header className="dashboard__header">
                <div>
                    <h1 className="dashboard__title">Global Leaderboard</h1>
                    <p className="dashboard__subtitle">See who has conquered the most SQL challenges.</p>
                </div>
            </header>

            <div className="leaderboard" style={{ marginTop: 'var(--space-lg)' }}>
                {leaderboard.length === 0 ? (
                    <p style={{ color: 'var(--color-text-muted)' }}>No progress recorded yet.</p>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
                        {leaderboard.map((user, index) => (
                            <div key={user._id} style={{
                                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                background: index === 0 ? 'var(--color-primary-glow)' : 'var(--color-surface)',
                                border: index === 0 ? '1px solid var(--color-primary)' : '1px solid var(--color-border)',
                                padding: 'var(--space-md) var(--space-xl)', borderRadius: 'var(--radius-md)',
                                transition: 'transform 0.2s',
                            }}
                                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-lg)' }}>
                                    <div style={{
                                        width: 32, height: 32, borderRadius: 'var(--radius-full)',
                                        background: index === 0 ? 'var(--color-primary)' : 'var(--color-bg)',
                                        color: index === 0 ? '#fff' : 'var(--color-text)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontWeight: 'bold'
                                    }}>
                                        #{index + 1}
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
                                        <div style={{ width: 40, height: 40, borderRadius: 'var(--radius-full)', background: 'var(--color-bg-2)', border: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-dim)', fontWeight: 'bold' }}>
                                            {user.name?.[0]?.toUpperCase()}
                                        </div>
                                        <div>
                                            <div style={{ fontWeight: 500, color: index === 0 ? 'var(--color-primary)' : 'var(--color-text)' }}>{user.name}</div>
                                            {user.bio && <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: 2, maxWidth: 300, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.bio}</div>}
                                        </div>
                                    </div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--color-text)' }}>{user.completedCount}</div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Completed</div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}

export default LeaderboardPage;
