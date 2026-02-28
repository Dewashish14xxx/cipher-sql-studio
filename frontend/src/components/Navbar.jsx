import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

function Navbar() {
    const { user, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <nav className="navbar" aria-label="Main navigation">
            <Link to="/" className="navbar__brand" aria-label="CipherSQL Studio home">
                <div className="navbar__brand-logo" aria-hidden="true">{'{ }'}</div>
                <span className="navbar__brand-name">
                    Cipher<span>SQL</span>Studio
                </span>
            </Link>
            <div className="navbar__nav">
                {user ? (
                    <>
                        <Link to="/leaderboard" className="btn btn--ghost btn--sm">Leaderboard</Link>

                        <Link to="/profile" className="navbar__user" style={{ textDecoration: 'none' }}>
                            <div className="navbar__user-avatar">{user.name?.[0]?.toUpperCase()}</div>
                            <span>{user.name}</span>
                        </Link>

                        <button className="btn btn--ghost btn--sm" onClick={toggleTheme} aria-label="Toggle theme" title="Toggle theme">
                            {theme === 'dark' ? '☀️' : '🌙'}
                        </button>

                        <button
                            className="btn btn--ghost btn--sm"
                            onClick={handleLogout}
                            aria-label="Logout"
                        >
                            Sign Out
                        </button>
                    </>
                ) : (
                    <>
                        <button className="btn btn--ghost btn--sm" onClick={toggleTheme} aria-label="Toggle theme" title="Toggle theme">
                            {theme === 'dark' ? '☀️' : '🌙'}
                        </button>
                        <Link to="/login" className="btn btn--ghost btn--sm">Sign In</Link>
                        <Link to="/register" className="btn btn--primary btn--sm">Sign Up</Link>
                    </>
                )}
            </div>
        </nav>
    );
}

export default Navbar;
