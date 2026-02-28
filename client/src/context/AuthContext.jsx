import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

const API_URL = 'http://localhost:5000/api';

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem('ai_coach_user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            const response = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Login failed');
            }

            localStorage.setItem('ai_coach_user', JSON.stringify(data));
            setUser(data);
            return data;
        } catch (error) {
            throw error;
        }
    };

    const register = async (fullName, email, password) => {
        try {
            const response = await fetch(`${API_URL}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ fullName, email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Registration failed');
            }

            localStorage.setItem('ai_coach_user', JSON.stringify(data));
            setUser(data);
            return data;
        } catch (error) {
            throw error;
        }
    };

    const logout = () => {
        localStorage.removeItem('ai_coach_user');
        setUser(null);
    };

    const updateProfile = async (fullName, email) => {
        try {
            const response = await fetch(`${API_URL}/users/profile`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify({ fullName, email }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Update failed');
            }

            const updatedUser = { ...user, ...data };
            localStorage.setItem('ai_coach_user', JSON.stringify(updatedUser));
            setUser(updatedUser);
            return updatedUser;
        } catch (error) {
            throw error;
        }
    };

    const uploadResume = async (file) => {
        try {
            const formData = new FormData();
            formData.append('resume', file);

            const response = await fetch(`${API_URL}/users/resume`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${user.token}`
                },
                body: formData,
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Upload failed');
            }

            return data;
        } catch (error) {
            throw error;
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, updateProfile, uploadResume, loading }}>
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
