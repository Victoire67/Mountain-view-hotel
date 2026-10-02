// src/context/AuthContext.tsx
import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

type User = {
    id: number;
    email: string;
    role: string;
    [key: string]: any; // flexible in case your /api/login returns extra fields
};

type AuthContextType = {
    user: User | null;
    login: (userData: User, token: string) => void;
    logout: () => void;
    loading: boolean;
};

// Reads the `exp` claim (seconds) of a JWT; malformed tokens count as expired
function isTokenExpired(token: string) {
    try {
        const payload = JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
        return typeof payload.exp === 'number' && payload.exp * 1000 <= Date.now();
    } catch {
        return true;
    }
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        const storedUserRaw = localStorage.getItem('user');
        if (storedToken && storedUserRaw && !isTokenExpired(storedToken)) {
            try {
                const storedUser: User = JSON.parse(storedUserRaw);
                setUser(storedUser);
            } catch {
                // Corrupted localStorage value — clear it
                localStorage.removeItem('user');
                localStorage.removeItem('token');
            }
        } else if (storedToken) {
            // Expired session — clear it so the user is sent to the login page
            localStorage.removeItem('user');
            localStorage.removeItem('token');
        }
        setLoading(false);
    }, []);

    const login = (userData: User, token: string) => {
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

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}