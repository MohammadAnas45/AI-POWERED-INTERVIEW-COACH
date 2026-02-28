import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Award, CheckCircle2, LayoutDashboard, RotateCcw, Calendar, BarChart3 } from 'lucide-react';

const Results = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { result } = location.state || {};

    if (!result) {
        navigate('/dashboard');
        return null;
    }

    const { score, role, level, totalQuestions, attemptDate } = result;

    const getScoreColor = (s) => {
        if (s >= 80) return 'text-emerald-400';
        if (s >= 60) return 'text-blue-400';
        return 'text-amber-400';
    };

    const getScoreMessage = (s) => {
        if (s >= 90) return 'Exceptional Performance!';
        if (s >= 80) return 'Great Job! You are ready.';
        if (s >= 70) return 'Good attempt! Keep practicing.';
        return 'Needs Improvement.';
    };

    return (
        <div className="min-h-screen bg-slate-900 text-white pt-24 pb-12 px-8">
            <div className="max-w-4xl mx-auto">
                <div className="bg-slate-800/50 border border-slate-700 rounded-3xl p-12 text-center relative overflow-hidden">
                    {/* Decorative Background Glows */}
                    <div className="absolute top-0 left-0 w-64 h-64 bg-blue-600/10 blur-[100px] -z-10"></div>
                    <div className="absolute bottom-0 right-0 w-64 h-64 bg-indigo-600/10 blur-[100px] -z-10"></div>

                    <div className="flex justify-center mb-6">
                        <div className="p-4 bg-blue-500/10 rounded-full border border-blue-500/20">
                            <Award className="w-16 h-16 text-blue-500" />
                        </div>
                    </div>

                    <h1 className="text-4xl font-bold mb-2">Interview Completed!</h1>
                    <p className="text-slate-400 text-lg mb-8">{getScoreMessage(score)}</p>

                    <div className="grid md:grid-cols-3 gap-6 mb-12">
                        <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-700">
                            <div className="text-slate-500 text-sm mb-1 uppercase tracking-wider">Overall Score</div>
                            <div className={`text-4xl font-bold ${getScoreColor(score)}`}>{score}%</div>
                        </div>
                        <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-700">
                            <div className="text-slate-500 text-sm mb-1 uppercase tracking-wider">Role & Level</div>
                            <div className="text-xl font-bold text-slate-200">{role}</div>
                            <div className="text-sm text-slate-400">{level}</div>
                        </div>
                        <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-700">
                            <div className="text-slate-500 text-sm mb-1 uppercase tracking-wider">Questions Answered</div>
                            <div className="text-4xl font-bold text-slate-200">{totalQuestions}</div>
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row gap-4 justify-center">
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="flex items-center justify-center gap-2 px-8 py-4 bg-slate-700 hover:bg-slate-600 rounded-xl font-bold transition-all"
                        >
                            <LayoutDashboard className="w-5 h-5" />
                            Back to Dashboard
                        </button>
                        <button
                            onClick={() => navigate('/practice/role')}
                            className="flex items-center justify-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-500 rounded-xl font-bold shadow-lg shadow-blue-600/20 transition-all"
                        >
                            <RotateCcw className="w-5 h-5" />
                            New Practice Session
                        </button>
                    </div>
                </div>

                <div className="mt-12">
                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                        <BarChart3 className="w-5 h-5 text-blue-400" /> Session Analytics
                    </h2>
                    <div className="bg-slate-800/30 border border-slate-700 rounded-2xl p-6">
                        <div className="flex items-center justify-between p-4 bg-slate-900/40 rounded-xl mb-4 border border-slate-700/50">
                            <div className="flex items-center gap-3">
                                <Calendar className="w-5 h-5 text-slate-500" />
                                <div>
                                    <div className="text-sm text-slate-500">Attempt Date</div>
                                    <div className="font-semibold text-slate-200">
                                        {new Date(attemptDate).toLocaleDateString('en-US', {
                                            weekday: 'long',
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 text-emerald-400 text-sm bg-emerald-400/10 px-3 py-1 rounded-full border border-emerald-400/20">
                                <CheckCircle2 className="w-4 h-4" />
                                Verified Successfully
                            </div>
                        </div>

                        <p className="text-slate-400 text-sm leading-relaxed text-center px-12 italic">
                            "AI Evaluation is coming soon! You will be able to see detailed feedback on each answer, including areas of improvement and sample best-practice responses."
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Results;
