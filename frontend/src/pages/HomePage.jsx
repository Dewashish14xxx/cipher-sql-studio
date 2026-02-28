import { useState, useEffect } from 'react';
import AssignmentCard from '../components/AssignmentCard';
import { getAssignments, getProgress } from '../api';
import { useAuth } from '../context/AuthContext';

const DIFFICULTIES = ['all', 'easy', 'medium', 'hard'];

function HomePage() {
    const { user } = useAuth();
    const [assignments, setAssignments] = useState([]);
    const [completedAssignments, setCompletedAssignments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        const fetchAssignments = async () => {
            try {
                const res = await getAssignments();
                setAssignments(res.data.data || []);

                // If logged in, fetch progress
                if (user) {
                    try {
                        const progRes = await getProgress();
                        setCompletedAssignments(progRes.data.data || []);
                    } catch (err) {
                        console.error('Failed to fetch progress', err);
                    }
                }
            } catch (err) {
                setError(err.response?.data?.error || 'Failed to load assignments.');
            } finally {
                setLoading(false);
            }
        };

        fetchAssignments();
    }, [user]);

    const filtered = filter === 'all'
        ? assignments
        : assignments.filter((a) => a.difficulty === filter);

    return (
        <main className="home-page">
            {/* Hero */}
            <section className="home-page__hero" aria-label="Hero section">
                <span className="home-page__hero-eyebrow">SQL Learning Platform</span>
                <h1 className="home-page__hero-title">
                    Master SQL with <span>real queries</span>
                </h1>
                <p className="home-page__hero-sub">
                    Practice SQL against live PostgreSQL databases. Get intelligent hints,
                    see instant results, and level up your query skills.
                </p>
                <div className="home-page__stats" role="list" aria-label="Platform statistics">
                    <div className="home-page__stat" role="listitem">
                        <span className="home-page__stat-value">{assignments.length}</span>
                        <span className="home-page__stat-label">Assignments</span>
                    </div>
                    <div className="home-page__stat" role="listitem">
                        <span className="home-page__stat-value">Live</span>
                        <span className="home-page__stat-label">PostgreSQL</span>
                    </div>
                    <div className="home-page__stat" role="listitem">
                        <span className="home-page__stat-value">AI</span>
                        <span className="home-page__stat-label">Hints</span>
                    </div>
                </div>
            </section>

            {/* Assignment grid */}
            <section className="home-page__content" aria-label="Assignments">
                <div className="home-page__section-header">
                    <h2 className="home-page__section-title">
                        📂 Assignments
                    </h2>
                    <div className="home-page__filter" role="group" aria-label="Filter by difficulty">
                        {DIFFICULTIES.map((d) => (
                            <button
                                key={d}
                                className={`home-page__filter-btn${filter === d ? ' active' : ''}`}
                                onClick={() => setFilter(d)}
                                aria-pressed={filter === d}
                            >
                                {d.charAt(0).toUpperCase() + d.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>

                {loading && (
                    <div className="home-page__loading" role="status" aria-live="polite">
                        <div className="spinner" aria-hidden="true" />
                        <span>Loading assignments…</span>
                    </div>
                )}

                {error && (
                    <div className="home-page__error" role="alert">
                        <span style={{ fontSize: '2rem' }}>⚠️</span>
                        <strong>Could not load assignments</strong>
                        <span>{error}</span>
                        <span style={{ fontSize: '0.8rem', color: '#9094c0' }}>
                            Make sure the backend is running on port 5000.
                        </span>
                    </div>
                )}

                {!loading && !error && (
                    <div className="home-page__grid" role="list" aria-label="Assignment list">
                        {filtered.map((a) => (
                            <div key={a._id} role="listitem">
                                <AssignmentCard
                                    assignment={a}
                                    isCompleted={completedAssignments.includes(a._id)}
                                />
                            </div>
                        ))}
                        {filtered.length === 0 && (
                            <p style={{ color: '#9094c0', gridColumn: '1 / -1' }}>
                                No assignments found for this filter.
                            </p>
                        )}
                    </div>
                )}
            </section>
        </main>
    );
}

export default HomePage;
