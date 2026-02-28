import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const stored = localStorage.getItem('ciphersql_user');
        if (stored) setUser(JSON.parse(stored));
    }, []);

    const saveAuth = (userData, token) => {
        localStorage.setItem('ciphersql_token', token);
        localStorage.setItem('ciphersql_user', JSON.stringify(userData));
        setUser(userData);
    };

    const logout = () => {
        localStorage.removeItem('ciphersql_token');
        localStorage.removeItem('ciphersql_user');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, saveAuth, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
