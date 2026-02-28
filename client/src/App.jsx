import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Interview from './pages/Interview';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import RoleSelection from './pages/practice/RoleSelection';
import LevelSelection from './pages/practice/LevelSelection';
import Simulation from './pages/practice/Simulation';
import Results from './pages/practice/Results';
import History from './pages/practice/History';

import Navbar from './components/Navbar';

// Scroll to top helper
const ScrollToTop = () => {
    const { pathname } = useLocation();
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);
    return null;
};

function App() {
    return (
        <AuthProvider>
            <Router>
                <ScrollToTop />
                <Navbar />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />

                    {/* Protected Routes */}
                    <Route
                        path="/dashboard"
                        element={
                            <ProtectedRoute>
                                <Dashboard />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/profile"
                        element={
                            <ProtectedRoute>
                                <Profile />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/interview"
                        element={
                            <ProtectedRoute>
                                <Interview />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/practice/role"
                        element={
                            <ProtectedRoute>
                                <RoleSelection />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/practice/level"
                        element={
                            <ProtectedRoute>
                                <LevelSelection />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/practice/simulation"
                        element={
                            <ProtectedRoute>
                                <Simulation />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/practice/results"
                        element={
                            <ProtectedRoute>
                                <Results />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/practice/history"
                        element={
                            <ProtectedRoute>
                                <History />
                            </ProtectedRoute>
                        }
                    />
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;
