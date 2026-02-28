import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Award, BookOpen, ChevronRight, BarChart3, Clock, ArrowLeft } from 'lucide-react';

const History = () => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const storedUser = JSON.parse(localStorage.getItem('ai_coach_user') || '{}');
                const token = storedUser.token;

                if (!token) {
                    setLoading(false);
                    return;
                }

                const response = await fetch('http://localhost:5000/api/practice/progress', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                const data = await response.json();

                if (response.ok) {
                    setHistory(Array.isArray(data) ? data : []);
                } else {
                    console.error('Failed to fetch history:', data.message);
                    setHistory([]);
                }
                setLoading(false);
            } catch (error) {
                console.error('Error fetching history:', error);
                setHistory([]);
                setLoading(false);
            }
        };
        fetchHistory();
    }, []);

    const safeHistory = Array.isArray(history) ? history : [];

    const stats = {
        total: safeHistory.length,
        avgScore: safeHistory.length > 0 ? Math.round(safeHistory.reduce((acc, curr) => acc + (curr.score || 0), 0) / safeHistory.length) : 0,
        bestRole: safeHistory.length > 0 ? safeHistory.reduce((acc, curr) => ((acc.score || 0) > (curr.score || 0) ? acc : curr)).role : 'N/A'
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-900 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-900 text-white pt-24 pb-12 px-8">
            <div className="max-w-6xl mx-auto">
                <button
                    onClick={() => navigate('/dashboard')}
                    className="flex items-center gap-2 text-slate-400 hover:text-white mb-8 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" /> Back to Dashboard
                </button>

                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">
                            Interview History & Progress
                        </h1>
                        <p className="text-slate-400 mt-1">Track your performance and growth over time.</p>
                    </div>
                    <div className="bg-blue-600 hover:bg-blue-500 px-6 py-2.5 rounded-xl font-semibold transition-all cursor-pointer shadow-lg shadow-blue-600/20" onClick={() => navigate('/practice/role')}>
                        New Practice Session
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <div className="bg-slate-800/40 border border-slate-700 p-6 rounded-2xl">
                        <div className="flex items-center gap-3 text-slate-400 mb-3">
                            <BookOpen className="w-5 h-5" /> Total Sessions
                        </div>
                        <div className="text-3xl font-bold">{stats.total}</div>
                    </div>
                    <div className="bg-slate-800/40 border border-slate-700 p-6 rounded-2xl">
                        <div className="flex items-center gap-3 text-slate-400 mb-3">
                            <BarChart3 className="w-5 h-5" /> Average Score
                        </div>
                        <div className="text-3xl font-bold text-blue-400">{stats.avgScore}%</div>
                    </div>
                    <div className="bg-slate-800/40 border border-slate-700 p-6 rounded-2xl">
                        <div className="flex items-center gap-3 text-slate-400 mb-3">
                            <Award className="w-5 h-5" /> Strongest Role
                        </div>
                        <div className="text-3xl font-bold text-indigo-400 truncate">{stats.bestRole}</div>
                    </div>
                </div>

                {/* History List */}
                <div className="bg-slate-800/20 border border-slate-700/50 rounded-3xl overflow-hidden">
                    <div className="px-8 py-6 border-b border-slate-700/50 bg-slate-800/40">
                        <h2 className="text-xl font-bold flex items-center gap-2">
                            <Clock className="w-5 h-5 text-blue-500" /> Recent Attempts
                        </h2>
                    </div>

                    {safeHistory.length === 0 ? (
                        <div className="p-12 text-center">
                            <p className="text-slate-500 text-lg">No interview sessions found. Start practicing to see your history!</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-slate-700/30">
                            {safeHistory.map((item) => (
                                <div
                                    key={item.id}
                                    className="px-8 py-6 hover:bg-slate-800/30 transition-colors flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
                                >
                                    <div className="flex items-center gap-6">
                                        <div className={`p-4 rounded-2xl ${item.score >= 80 ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                                            item.score >= 60 ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                                                'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                                            }`}>
                                            <Award className="w-8 h-8" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-slate-100">{item.role}</h3>
                                            <div className="flex items-center gap-4 mt-1">
                                                <span className="text-sm px-2 py-0.5 bg-slate-700 text-slate-300 rounded-md">
                                                    {item.level}
                                                </span>
                                                <span className="flex items-center gap-1.5 text-sm text-slate-500">
                                                    <Calendar className="w-4 h-4" />
                                                    {new Date(item.attemptDate).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-8 w-full md:w-auto justify-between md:justify-end">
                                        <div className="text-right">
                                            <div className="text-sm text-slate-500 mb-0.5 uppercase tracking-tighter">Score</div>
                                            <div className={`text-2xl font-bold ${item.score >= 80 ? 'text-emerald-400' :
                                                item.score >= 60 ? 'text-blue-400' :
                                                    'text-amber-400'
                                                }`}>
                                                {item.score}%
                                            </div>
                                        </div>
                                        <button className="p-2 hover:bg-slate-700 rounded-full transition-colors">
                                            <ChevronRight className="w-6 h-6 text-slate-500" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default History;
