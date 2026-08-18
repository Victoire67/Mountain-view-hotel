// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children } : any) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check if user token/session exists on initial load
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
            // Optional: You can fetch user profile from /api/me using the token
            const storedUser = JSON.parse(localStorage.getItem('user'));
            setUser(storedUser);
        }
        setLoading(false);
    }, []);

    const login = (userData : any, token : any) => {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);