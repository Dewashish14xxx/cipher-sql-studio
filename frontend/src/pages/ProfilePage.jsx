import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getUserProfile, updateUserProfile } from '../api';

function ProfilePage() {
    const { user } = useAuth();
    const [profile, setProfile] = useState(null);
    const [stats, setStats] = useState(0);
    const [isEditing, setIsEditing] = useState(false);
    const [bioInput, setBioInput] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) return;
        getUserProfile()
            .then(res => {
                setProfile(res.data.user);
                setStats(res.data.completedCount);
                setBioInput(res.data.user.bio || '');
            })
            .catch(err => console.error("Failed to fetch profile", err))
            .finally(() => setLoading(false));
    }, [user]);

    const handleSave = async () => {
        try {
            const res = await updateUserProfile({ bio: bioInput });
            setProfile(res.data.user);
            setIsEditing(false);
        } catch (err) {
            console.error("Failed to update profile", err);
        }
    };

    if (loading) return <main className="dashboard"><p>Loading profile...</p></main>;
    if (!profile) return <main className="dashboard"><p>Profile not found or you are logged out.</p></main>;

    return (
        <main className="dashboard">
            <header className="dashboard__header">
                <div>
                    <h1 className="dashboard__title">User Profile</h1>
                    <p className="dashboard__subtitle">View your stats and customize your profile.</p>
                </div>
            </header>

            <div className="profile-card" style={{ background: 'var(--color-surface)', padding: 'var(--space-xl)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', marginTop: 'var(--space-lg)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)', marginBottom: 'var(--space-xl)' }}>
                    <div style={{ width: 64, height: 64, borderRadius: 'var(--radius-full)', background: 'var(--color-primary-glow)', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 'bold' }}>
                        {profile.name?.[0]?.toUpperCase()}
                    </div>
                    <div>
                        <h2 style={{ fontSize: '1.5rem', color: 'var(--color-text)', marginBottom: '4px' }}>{profile.name}</h2>
                        <span style={{ color: 'var(--color-text-dim)', fontSize: '0.875rem' }}>{profile.email}</span>
                    </div>
                </div>

                <div style={{ marginBottom: 'var(--space-xl)' }}>
                    <h3 style={{ fontSize: '1rem', color: 'var(--color-text-muted)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Bio</h3>
                    {isEditing ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
                            <textarea
                                value={bioInput}
                                onChange={(e) => setBioInput(e.target.value)}
                                style={{
                                    width: '100%', minHeight: 100, padding: 'var(--space-sm)',
                                    background: 'var(--color-bg)', color: 'var(--color-text)',
                                    border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)'
                                }}
                            />
                            <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
                                <button className="btn btn--primary btn--sm" onClick={handleSave}>Save</button>
                                <button className="btn btn--ghost btn--sm" onClick={() => { setIsEditing(false); setBioInput(profile.bio || ''); }}>Cancel</button>
                            </div>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <p style={{ color: 'var(--color-text)', lineHeight: 1.5, whiteSpace: 'pre-wrap', flex: 1, marginRight: 'var(--space-md)' }}>
                                {profile.bio || <span style={{ color: 'var(--color-text-muted)', fontStyle: 'italic' }}>No bio provided.</span>}
                            </p>
                            <button className="btn btn--ghost btn--sm" onClick={() => setIsEditing(true)}>Edit</button>
                        </div>
                    )}
                </div>

                <div>
                    <h3 style={{ fontSize: '1rem', color: 'var(--color-text-muted)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Stats</h3>
                    <div style={{ display: 'inline-block', background: 'var(--color-bg)', padding: 'var(--space-md) var(--space-xl)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', textAlign: 'center' }}>
                        <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--color-primary)', marginBottom: '4px' }}>{stats}</div>
                        <div style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>Assignments Completed</div>
                    </div>
                </div>
            </div>
        </main>
    );
}

export default ProfilePage;
