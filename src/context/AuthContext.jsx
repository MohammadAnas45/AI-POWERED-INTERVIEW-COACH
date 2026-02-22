import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check if user is already logged in (check session first, then permanent)
        const sessionUser = sessionStorage.getItem('ai_coach_user');
        const permanentUser = localStorage.getItem('ai_coach_user');

        if (sessionUser) {
            setUser(JSON.parse(sessionUser));
        } else if (permanentUser) {
            setUser(JSON.parse(permanentUser));
        }
        setLoading(false);
    }, []);

    const login = (email, password, rememberMe = false) => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const users = JSON.parse(localStorage.getItem('ai_coach_registered_users') || '[]');
                const foundUser = users.find(u => u.email === email && u.password === password);

                if (foundUser) {
                    const userData = { email: foundUser.email, fullName: foundUser.fullName };

                    if (rememberMe) {
                        localStorage.setItem('ai_coach_user', JSON.stringify(userData));
                    } else {
                        sessionStorage.setItem('ai_coach_user', JSON.stringify(userData));
                    }

                    setUser(userData);
                    resolve(userData);
                } else {
                    reject(new Error('Invalid email or password. Please check your credentials and try again.'));
                }
            }, 800);
        });
    };

    const register = (fullName, email, password) => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const users = JSON.parse(localStorage.getItem('ai_coach_registered_users') || '[]');
                const userExists = users.some(u => u.email === email);

                if (userExists) {
                    reject(new Error('An account with this email already exists.'));
                } else {
                    const newUser = { fullName, email, password };
                    users.push(newUser);
                    localStorage.setItem('ai_coach_registered_users', JSON.stringify(users));

                    const userData = { email, fullName };
                    // Default to session storage for registration
                    sessionStorage.setItem('ai_coach_user', JSON.stringify(userData));
                    setUser(userData);
                    resolve(userData);
                }
            }, 1000);
        });
    };

    const logout = () => {
        localStorage.removeItem('ai_coach_user');
        sessionStorage.removeItem('ai_coach_user');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
