import React from 'react';
import { useAuth } from '../context/AuthContext';
import Footer from '../components/Footer';
import { LayoutDashboard, User, FileText, Settings, LogOut, ArrowRight, Bot, Target, ListChecks } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
    const { user, logout } = useAuth();

    const stats = [
        { name: 'Mock Interviews', value: '12', icon: Bot, color: 'text-indigo-400' },
        { name: 'Average Score', value: '85%', icon: Target, color: 'text-emerald-400' },
        { name: 'Tasks Completed', value: '8/10', icon: ListChecks, color: 'text-purple-400' },
    ];

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col">


            <main className="flex-grow pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
                <div className="flex flex-col md:flex-row gap-8">
                    {/* Sidebar */}
                    <aside className="w-full md:w-64 space-y-2">
                        <Link to="/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-indigo-600/10 text-indigo-400 border border-indigo-500/20 font-medium">
                            <LayoutDashboard size={20} /> Dashboard
                        </Link>
                        <Link to="/profile" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 text-slate-400 hover:text-white transition-colors font-medium">
                            <User size={20} /> My Profile
                        </Link>
                        <Link to="/practice/role" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 text-slate-400 hover:text-white transition-colors font-medium">
                            <Bot size={20} /> AI Interview
                        </Link>
                        <Link to="/practice/history" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 text-slate-400 hover:text-white transition-colors font-medium">
                            <ListChecks size={20} /> My History
                        </Link>
                        <button onClick={logout} className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-500/5 text-slate-400 hover:text-red-400 transition-colors font-medium w-full text-left">
                            <LogOut size={20} /> Logout
                        </button>
                    </aside>

                    {/* Main Content */}
                    <div className="flex-1 space-y-8">
                        {/* Welcome Header */}
                        <div className="bg-slate-900/40 backdrop-blur-xl border border-white/10 p-8 rounded-3xl">
                            <h1 className="text-3xl font-bold text-white mb-2">Welcome back, {user?.fullName}! 👋</h1>
                            <p className="text-slate-400">Here's an overview of your interview preparation progress.</p>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                            {stats.map((stat) => (
                                <div key={stat.name} className="bg-slate-900/40 border border-white/10 p-6 rounded-2xl">
                                    <div className="flex items-center justify-between mb-4">
                                        <stat.icon className={stat.color} size={24} />
                                        <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Status</span>
                                    </div>
                                    <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                                    <div className="text-sm text-slate-400">{stat.name}</div>
                                </div>
                            ))}
                        </div>

                        {/* Quick Actions */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-gradient-to-br from-indigo-500/20 to-purple-600/20 border border-indigo-500/20 p-8 rounded-3xl group cursor-pointer hover:border-indigo-500/40 transition-all">
                                <h3 className="text-xl font-bold text-white mb-4">Start Practicing</h3>
                                <p className="text-slate-400 mb-6">Choose a role and difficulty level to start a session with your AI coach.</p>
                                <Link to="/practice/role" className="inline-flex items-center gap-2 text-indigo-400 font-bold group-hover:gap-3 transition-all">
                                    Start Now <ArrowRight size={18} />
                                </Link>
                            </div>
                            <div className="bg-slate-900/40 border border-white/10 p-8 rounded-3xl">
                                <h3 className="text-xl font-bold text-white mb-4">Resume Analysis</h3>
                                <p className="text-slate-400 mb-6">Upload your resume to get AI-powered insights and custom interview questions.</p>
                                <Link to="/profile" className="inline-flex items-center gap-2 text-indigo-400 font-bold hover:gap-3 transition-all">
                                    Upload Resume <FileText size={18} />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default Dashboard;
