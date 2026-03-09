import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Award, CheckCircle2, LayoutDashboard, RotateCcw, Calendar, BarChart3, TrendingUp, Zap, AlertTriangle, Lightbulb, UserCheck, PlayCircle, ListChecks, Maximize } from 'lucide-react';

const Results = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { result } = location.state || {};
    const [isFullScreen, setIsFullScreen] = useState(!!document.fullscreenElement);

    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullScreen(!!document.fullscreenElement);
        };

        const handleEscape = (e) => {
            if (e.key === 'Escape') {
                if (document.fullscreenElement) {
                    // Just exit fullscreen if in fullscreen
                    if (document.exitFullscreen) document.exitFullscreen();
                } else {
                    // If already not in fullscreen, go back to dashboard
                    navigate('/dashboard');
                }
            }
        };

        document.addEventListener('fullscreenchange', handleFullscreenChange);
        document.addEventListener('keydown', handleEscape);

        return () => {
            document.removeEventListener('fullscreenchange', handleFullscreenChange);
            document.removeEventListener('keydown', handleEscape);
        };
    }, [navigate]);

    if (!result) {
        navigate('/dashboard');
        return null;
    }

    const {
        score, role, level, totalQuestions, attemptDate,
        ai_feedback, reasoning, strengths, weaknesses, suggestions, analytics, readinessCheck
    } = result;

    const getScoreColor = (s) => {
        if (s >= 80) return 'text-emerald-400';
        if (s >= 60) return 'text-blue-400';
        return 'text-amber-400';
    };

    return (
        <div className="min-h-screen bg-slate-900 text-white pt-24 pb-12 px-8">
            <div className="max-w-5xl mx-auto">
                <div className="bg-slate-800/50 border border-slate-700 rounded-3xl p-10 text-center relative overflow-hidden mb-8">
                    {/* Decorative Background Glows */}
                    <div className="absolute top-0 left-0 w-64 h-64 bg-blue-600/10 blur-[100px] -z-10"></div>
                    <div className="absolute bottom-0 right-0 w-64 h-64 bg-indigo-600/10 blur-[100px] -z-10"></div>

                    <div className="flex justify-center mb-6 relative">
                        <div className="p-4 bg-blue-500/10 rounded-full border border-blue-500/20">
                            <Award className="w-16 h-16 text-blue-500" />
                        </div>
                        <button
                            onClick={() => {
                                if (document.fullscreenElement) {
                                    document.exitFullscreen();
                                } else {
                                    document.documentElement.requestFullscreen();
                                }
                            }}
                            className="absolute top-0 right-0 p-2 text-slate-500 hover:text-white transition-colors"
                            title="Toggle Fullscreen"
                        >
                            <Maximize size={20} />
                        </button>
                    </div>

                    <h1 className="text-4xl font-bold mb-2">Interview Completed!</h1>
                    <div className={`text-xl font-medium mb-8 ${getScoreColor(score)}`}>
                        {ai_feedback || "Analyzing your performance..."}
                    </div>

                    <div className="grid md:grid-cols-5 gap-4 mb-10">
                        <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-700">
                            <div className="text-slate-500 text-[10px] mb-1 uppercase tracking-wider">Total Marks</div>
                            <div className={`text-2xl font-bold ${getScoreColor(score)}`}>{analytics?.totalMarks || 0}</div>
                            <div className="text-[10px] text-slate-500">of {analytics?.maxPossible || 100}</div>
                        </div>
                        <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-700">
                            <div className="text-slate-500 text-[10px] mb-1 uppercase tracking-wider">Percentage</div>
                            <div className={`text-3xl font-bold ${getScoreColor(score)}`}>{score}%</div>
                        </div>
                        <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-700">
                            <div className="text-slate-500 text-[10px] mb-1 uppercase tracking-wider">Correct</div>
                            <div className="text-3xl font-bold text-emerald-400">{analytics?.correctAnswers || 0}</div>
                            <div className="text-[10px] text-slate-500">High impact</div>
                        </div>
                        <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-700">
                            <div className="text-slate-500 text-[10px] mb-1 uppercase tracking-wider">Weak</div>
                            <div className="text-3xl font-bold text-amber-500">{analytics?.weakAnswers || 0}</div>
                            <div className="text-[10px] text-slate-500">Needs focus</div>
                        </div>
                        <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-700">
                            <div className="text-slate-500 text-[10px] mb-1 uppercase tracking-wider">Trend</div>
                            <div className="text-xl font-bold text-blue-400 flex items-center justify-center gap-1 mt-1">
                                <TrendingUp className="w-4 h-4" /> {analytics?.performanceTrend || "Stable"}
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row gap-4 justify-center">
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="flex items-center justify-center gap-2 px-8 py-4 bg-slate-700 hover:bg-slate-600 rounded-xl font-bold transition-all"
                        >
                            <LayoutDashboard className="w-5 h-5" />
                            Dashboard
                        </button>
                        <button
                            onClick={() => navigate('/practice/role')}
                            className="flex items-center justify-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-500 rounded-xl font-bold shadow-lg shadow-blue-600/20 transition-all"
                        >
                            <RotateCcw className="w-5 h-5" />
                            Try Next Exam
                        </button>
                    </div>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    <div className="md:col-span-2 space-y-8">
                        {/* Performance Summary Highlight */}
                        <section className="bg-gradient-to-r from-blue-600/20 to-indigo-600/20 border border-blue-500/30 rounded-2xl p-8 shadow-xl">
                            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                                <BarChart3 className="w-5 h-5 text-blue-400" /> Performance Summary
                            </h2>
                            <div className="grid grid-cols-2 gap-8">
                                <div>
                                    <div className="text-sm text-slate-400 mb-1">Success Rate</div>
                                    <div className="text-5xl font-black text-white">{score}%</div>
                                    <div className="text-xs text-slate-500 mt-2">Based on AI evaluation criteria</div>
                                </div>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center bg-slate-900/40 p-3 rounded-xl border border-slate-700/50">
                                        <span className="text-xs text-slate-400">Total Marks</span>
                                        <span className="font-bold text-blue-400">{analytics?.totalMarks} / {analytics?.maxPossible}</span>
                                    </div>
                                    <div className="flex justify-between items-center bg-slate-900/40 p-3 rounded-xl border border-slate-700/50">
                                        <span className="text-xs text-slate-400">Correct Answers</span>
                                        <span className="font-bold text-emerald-400">{analytics?.correctAnswers}</span>
                                    </div>
                                    <div className="flex justify-between items-center bg-slate-900/40 p-3 rounded-xl border border-slate-700/50">
                                        <span className="text-xs text-slate-400">Weak Areas</span>
                                        <span className="font-bold text-amber-500">{analytics?.weakAnswers}</span>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Detailed AI Feedback Section */}
                        <section className="bg-slate-800/30 border border-slate-700 rounded-2xl p-8">
                            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                                <Zap className="w-5 h-5 text-yellow-400" /> AI Insights & Reasoning
                            </h2>
                            <div className="bg-slate-900/40 p-6 rounded-xl border border-slate-700/50 mb-6">
                                <p className="text-slate-300 leading-relaxed italic">
                                    "{reasoning || "Your answers are being evaluated for depth and technical accuracy. Based on your length and structure, we see strong potential."}"
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                                    <div className="flex items-center gap-2 text-emerald-400 font-bold mb-2">
                                        <CheckCircle2 size={16} /> Strengths
                                    </div>
                                    <p className="text-sm text-slate-400">{strengths || "Analytical thinking, Logical flow"}</p>
                                </div>
                                <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl">
                                    <div className="flex items-center gap-2 text-amber-400 font-bold mb-2">
                                        <AlertTriangle size={16} /> Weaknesses
                                    </div>
                                    <p className="text-sm text-slate-400">{weaknesses || "Detail in technical terms"}</p>
                                </div>
                            </div>
                        </section>

                        {/* Improvements Section */}
                        <section className="bg-slate-800/30 border border-slate-700 rounded-2xl p-8">
                            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                                <Lightbulb className="w-5 h-5 text-blue-400" /> Suggestions for Improvement
                            </h2>
                            <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl text-slate-300">
                                {suggestions || "Try to use more industry-specific keywords and provide real-world examples from your past projects."}
                            </div>
                        </section>

                        {/* Detailed Question breakdown */}
                        <section className="bg-slate-800/20 border border-slate-700/50 rounded-2xl p-8">
                            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                                <ListChecks className="w-5 h-5 text-indigo-400" /> Question-wise Evaluation
                            </h2>
                            <div className="space-y-6">
                                {analytics?.perAnswerEvaluation?.map((evalItem, idx) => (
                                    <div key={idx} className="bg-slate-900/60 rounded-xl p-6 border border-slate-800">
                                        <div className="flex justify-between items-start mb-4">
                                            <span className="bg-slate-800 text-[10px] text-slate-400 px-2 py-1 rounded border border-slate-700">Q{idx + 1}</span>
                                            <span className={`text-sm font-bold ${evalItem.score >= 7 ? 'text-emerald-400' : 'text-amber-500'}`}>Score: {evalItem.score}/10</span>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs mb-4">
                                            <div className="p-3 bg-red-400/5 rounded-lg border border-red-400/10">
                                                <div className="text-red-400/50 mb-1 font-bold lowercase tracking-widest">Your Answer</div>
                                                <div className="text-slate-300 line-clamp-3 italic">"{evalItem.userAnswer || "No transcript recorded"}"</div>
                                            </div>
                                            <div className="p-3 bg-emerald-400/5 rounded-lg border border-emerald-400/10">
                                                <div className="text-emerald-400/50 mb-1 font-bold lowercase tracking-widest">Ideal Response</div>
                                                <div className="text-slate-300 line-clamp-3 italic">"{evalItem.referenceAnswer || "N/A"}"</div>
                                            </div>
                                            <div className="p-3 bg-blue-400/5 rounded-lg border border-blue-400/10">
                                                <div className="text-blue-400/50 mb-1 font-bold lowercase tracking-widest">AI's Reasoning</div>
                                                <div className="text-slate-300 italic">"{evalItem.reasoning}"</div>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-4 gap-2">
                                            {Object.entries(evalItem.criteria || {}).map(([key, value]) => (
                                                <div key={key} className="bg-slate-800/50 p-2 rounded text-center border border-slate-700/50">
                                                    <div className="text-[8px] text-slate-500 uppercase">{key}</div>
                                                    <div className="text-[10px] text-slate-300 font-bold">{value}</div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>

                    <div className="space-y-8">
                        {/* Session Meta */}
                        <div className="bg-slate-800/30 border border-slate-700 rounded-2xl p-6">
                            <div className="flex items-center gap-3 mb-6">
                                <Calendar className="w-5 h-5 text-slate-500" />
                                <div>
                                    <div className="text-[10px] text-slate-500 uppercase tracking-tighter">Attempt Date</div>
                                    <div className="text-sm font-semibold text-slate-200">
                                        {new Date(attemptDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Readiness Check Section */}
                        <section className="bg-gradient-to-br from-indigo-900/40 to-slate-800/40 border border-indigo-500/30 rounded-2xl p-6">
                            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                                <UserCheck className="w-5 h-5 text-indigo-400" /> Readiness Check
                            </h2>

                            <div className="space-y-4">
                                <div>
                                    <div className="text-xs text-slate-400 mb-1">Lagging Skills identified:</div>
                                    <div className="flex flex-wrap gap-2">
                                        {(readinessCheck?.laggingSkills || weaknesses || "Observation").split(',').map((skill, i) => (
                                            <span key={i} className="px-2 py-1 bg-slate-800 rounded-md text-[10px] text-slate-300 border border-slate-700">
                                                {skill.trim()}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {readinessCheck?.targetedQuestions && (
                                    <div className="pt-4 border-t border-slate-700">
                                        <div className="text-xs text-indigo-300 mb-3 flex items-center gap-1">
                                            <PlayCircle size={14} /> Recommended Focus Questions:
                                        </div>
                                        <div className="space-y-2">
                                            {readinessCheck.targetedQuestions.slice(0, 3).map((q, i) => (
                                                <div key={i} className="p-3 bg-slate-900/50 rounded-lg text-[11px] text-slate-400 border border-slate-700/50 italic">
                                                    "{q.questionText}"
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Results;

