import React, { useState, useEffect } from 'react';
import { Bot, Menu, X, Github, Target, ListChecks, Database, LogIn, LogOut, User } from 'lucide-react';
import { useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const location = useLocation();
    const { user, logout } = useAuth();

    const isHome = location.pathname === '/';
    const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'Roadmap', href: isHome ? '#roadmap' : '/#roadmap' },
        { name: 'Features', href: isHome ? '#features' : '/#features' },
        { name: 'Tasks', href: isHome ? '#tasks' : '/#tasks' },
    ];

    return (
        <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled || !isHome || isOpen ? 'bg-slate-950/80 backdrop-blur-md border-b border-white/10' : 'bg-transparent'
            }`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2 group cursor-pointer transition-transform hover:scale-105 active:scale-95">
                        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-2 rounded-lg shadow-lg shadow-indigo-500/20 group-hover:shadow-[0_0_20px_rgba(99,102,241,0.5)] transition-shadow">
                            <Bot className="w-6 h-6 text-white" />
                        </div>
                        <span className="font-bold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                            AI Coach
                        </span>
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden md:block">
                        <div className="ml-10 flex items-center space-x-6">
                            {!isAuthPage && navLinks.map((link) => (
                                <a
                                    key={link.name}
                                    href={link.href}
                                    className="text-sm font-medium text-slate-300 hover:text-white px-3 py-2 rounded-md transition-all relative group"
                                >
                                    {link.name}
                                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-500 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300" />
                                </a>
                            ))}

                            <div className="h-4 w-px bg-white/10 mx-2" />

                            {user ? (
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
                                        <div className="w-6 h-6 rounded-full bg-indigo-500 flex items-center justify-center text-[10px] font-bold">
                                            {user.fullName.split(' ').map(n => n[0]).join('')}
                                        </div>
                                        <span className="text-sm font-medium text-slate-200">{user.fullName}</span>
                                    </div>
                                    <button
                                        onClick={logout}
                                        className="text-slate-400 hover:text-red-400 transition-colors flex items-center gap-2 text-sm"
                                        title="Logout"
                                    >
                                        <LogOut size={18} />
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <Link
                                        to="/login"
                                        className="text-sm font-medium text-slate-300 hover:text-white transition-colors"
                                    >
                                        Log In
                                    </Link>

                                    <Link
                                        to="/register"
                                        className={`
                                            relative px-5 py-2 rounded-full text-sm font-bold transition-all flex items-center gap-2 overflow-hidden group
                                            ${location.pathname === '/register'
                                                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25'
                                                : 'bg-white text-slate-900 hover:bg-slate-200 hover:scale-105'}
                                        `}
                                    >
                                        <span className="relative z-10 flex items-center gap-2">
                                            Sign Up
                                        </span>
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="-mr-2 flex md:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-slate-400 hover:text-white hover:bg-white/10 focus:outline-none transition-colors"
                        >
                            <span className="sr-only">Open main menu</span>
                            {isOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <div className={`md:hidden transition-all duration-300 ${isOpen ? 'max-h-[30rem] opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
                <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-slate-950/95 backdrop-blur-xl border-b border-white/10 shadow-xl">
                    {user && (
                        <div className="px-3 py-3 mb-2 flex items-center gap-3 border-b border-white/5">
                            <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center font-bold">
                                {user.fullName.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div>
                                <div className="text-white font-bold">{user.fullName}</div>
                                <div className="text-xs text-slate-400">{user.email}</div>
                            </div>
                        </div>
                    )}

                    {!isAuthPage && navLinks.map((link) => (
                        <a
                            key={link.name}
                            href={link.href}
                            onClick={() => setIsOpen(false)}
                            className="block px-3 py-2 rounded-md text-base font-medium text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
                        >
                            {link.name}
                        </a>
                    ))}

                    <div className="pt-4 pb-2 border-t border-white/5 mt-2 flex flex-col gap-2">
                        {user ? (
                            <button
                                onClick={() => {
                                    logout();
                                    setIsOpen(false);
                                }}
                                className="flex items-center justify-center gap-2 w-full text-center text-red-400 px-4 py-3 rounded-md font-medium hover:bg-red-500/10 transition-colors"
                            >
                                <LogOut size={18} />
                                Sign Out
                            </button>
                        ) : (
                            <>
                                <Link
                                    to="/login"
                                    onClick={() => setIsOpen(false)}
                                    className="block w-full text-center text-slate-300 px-4 py-3 rounded-md font-medium hover:bg-white/5 transition-colors"
                                >
                                    Log In
                                </Link>
                                <Link
                                    to="/register"
                                    onClick={() => setIsOpen(false)}
                                    className="block w-full text-center bg-indigo-600 text-white px-4 py-3 rounded-md font-bold hover:bg-indigo-500 transition-colors shadow-lg shadow-indigo-500/20"
                                >
                                    Sign Up Free
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
