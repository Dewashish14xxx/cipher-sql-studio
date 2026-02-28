import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login as loginApi, register as registerApi } from '../api';
import { useAuth } from '../context/AuthContext';

function AuthPage({ mode }) {
    const isLogin = mode === 'login';
    const navigate = useNavigate();
    const { saveAuth } = useAuth();

    const [form, setForm] = useState({ name: '', email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const res = isLogin
                ? await loginApi({ email: form.email, password: form.password })
                : await registerApi({ name: form.name, email: form.email, password: form.password });
            saveAuth(res.data.user, res.data.token);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.error || 'Something went wrong.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="auth-page" aria-label={isLogin ? 'Sign in' : 'Sign up'}>
            <div className="auth-page__card">
                <div className="auth-page__logo">
                    <div className="auth-page__logo-icon">{'{ }'}</div>
                </div>
                <h1 className="auth-page__title">{isLogin ? 'Welcome back' : 'Join CipherSQL'}</h1>
                <p className="auth-page__subtitle">
                    {isLogin ? 'Sign in to track your progress.' : 'Create an account to get started.'}
                </p>

                <form className="auth-page__form" onSubmit={handleSubmit} noValidate>
                    {!isLogin && (
                        <div className="auth-page__field">
                            <label className="auth-page__label" htmlFor="name">Full Name</label>
                            <input
                                id="name"
                                name="name"
                                type="text"
                                className="auth-page__input"
                                placeholder="Jane Doe"
                                value={form.name}
                                onChange={handleChange}
                                required
                                autoComplete="name"
                            />
                        </div>
                    )}
                    <div className="auth-page__field">
                        <label className="auth-page__label" htmlFor="email">Email</label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            className="auth-page__input"
                            placeholder="you@example.com"
                            value={form.email}
                            onChange={handleChange}
                            required
                            autoComplete="email"
                        />
                    </div>
                    <div className="auth-page__field">
                        <label className="auth-page__label" htmlFor="password">Password</label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            className="auth-page__input"
                            placeholder="••••••••"
                            value={form.password}
                            onChange={handleChange}
                            required
                            autoComplete={isLogin ? 'current-password' : 'new-password'}
                        />
                    </div>

                    {error && <div className="auth-page__error" role="alert">{error}</div>}

                    <button
                        type="submit"
                        className="btn btn--primary auth-page__submit"
                        disabled={loading}
                        id="auth-submit-btn"
                    >
                        {loading ? 'Please wait…' : isLogin ? 'Sign In' : 'Create Account'}
                    </button>
                </form>

                <p className="auth-page__switch">
                    {isLogin ? (
                        <>Don't have an account? <Link to="/register">Sign up</Link></>
                    ) : (
                        <>Already have an account? <Link to="/login">Sign in</Link></>
                    )}
                </p>
            </div>
        </main>
    );
}

export default AuthPage;
