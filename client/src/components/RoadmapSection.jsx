import React, { useState } from 'react';
import { Target, ListChecks, Database, BookOpen, Code2, Check, ExternalLink } from 'lucide-react';

const RoadmapSection = ({ data }) => {
    const { goals, deliverables, learningFocus } = data;

    return (
        <section id="roadmap" className="py-24 relative overflow-hidden bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a]">
            {/* Dynamic Background Elements */}
            <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-3xl -z-10 animate-pulse-slow" />
            <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-3xl -z-10 animate-pulse-slow" style={{ animationDelay: '2s' }} />

            <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
                <div className="text-center mb-16">
                    <span className="inline-block px-4 py-2 rounded-full bg-slate-800/50 border border-slate-700/50 text-indigo-400 font-semibold mb-4 backdrop-blur-sm">
                        Week 1 Focus
                    </span>
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-indigo-200">
                        {data.subtitle}
                    </h2>
                    <p className="text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed">
                        Establishing the architectural foundation and core infrastructure for the AI Interview Coach.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">

                    {/* Section: Goals */}
                    <div className="bg-slate-800/40 backdrop-blur-md rounded-2xl border border-slate-700/50 p-8 transform transition-transform hover:-translate-y-2 hover:border-emerald-500/30 group">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="bg-emerald-500/10 p-3 rounded-lg text-emerald-400 group-hover:scale-110 transition-transform">
                                <Target className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold text-white">Project Goals</h3>
                        </div>
                        <ul className="space-y-4">
                            {goals.map((goal, index) => (
                                <li key={index} className="flex items-start gap-3 group/item">
                                    <div className={`mt-1 w-5 h-5 rounded-full border flex items-center justify-center transition-all ${goal.completed
                                            ? 'bg-emerald-500 border-emerald-500'
                                            : 'border-slate-500 bg-transparent'
                                        }`}>
                                        {goal.completed && <Check size={12} className="text-white" />}
                                    </div>
                                    <span className={`text-sm ${goal.completed ? 'text-slate-300 line-through decoration-slate-500' : 'text-slate-200 group-hover/item:text-white transition-colors'}`}>
                                        {goal.text}
                                    </span>
                                </li>
                            ))}
                        </ul>
                        <div className="mt-6 pt-6 border-t border-slate-700/50 flex items-center justify-between text-xs text-slate-500 font-mono">
                            <span>PROGRESS</span>
                            <span>2/4 COMPLETE</span>
                        </div>
                    </div>

                    {/* Section: Deliverables */}
                    <div className="bg-slate-800/40 backdrop-blur-md rounded-2xl border border-slate-700/50 p-8 transform transition-transform hover:-translate-y-2 hover:border-indigo-500/30 group relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/10 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110" />

                        <div className="flex items-center gap-4 mb-6 relative z-10">
                            <div className="bg-indigo-500/10 p-3 rounded-lg text-indigo-400 group-hover:scale-110 transition-transform">
                                <ListChecks className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold text-white">Deliverables</h3>
                        </div>

                        <div className="grid gap-4 relative z-10">
                            {deliverables.map((item, index) => (
                                <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-slate-900/50 border border-slate-700/50 hover:bg-slate-800 hover:border-indigo-500/50 transition-all cursor-default">
                                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 shadow-[0_0_8px_rgba(129,140,248,0.8)]" />
                                    <div>
                                        <p className="font-semibold text-white text-sm">{item.title}</p>
                                        <p className="text-xs text-slate-400">{item.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Section: Learning Focus */}
                    <div className="bg-slate-800/40 backdrop-blur-md rounded-2xl border border-slate-700/50 p-8 transform transition-transform hover:-translate-y-2 hover:border-purple-500/30 group">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="bg-purple-500/10 p-3 rounded-lg text-purple-400 group-hover:scale-110 transition-transform">
                                <BookOpen className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold text-white">Learning Focus</h3>
                        </div>

                        <div className="space-y-4">
                            {learningFocus.map((item, index) => (
                                <div key={index} className="group/card relative pl-4 border-l-2 border-slate-700 hover:border-purple-500 transition-colors">
                                    <h4 className="font-semibold text-slate-200 group-hover/card:text-purple-300 transition-colors flex items-center gap-2">
                                        {item.title}
                                        <ExternalLink size={12} className="opacity-0 group-hover/card:opacity-100 transition-opacity" />
                                    </h4>
                                    <p className="text-sm text-slate-500 mt-1 line-clamp-2 hover:line-clamp-none transition-all">
                                        {item.description}
                                    </p>
                                </div>
                            ))}
                        </div>

                        <div className="mt-8">
                            <button className="w-full py-2 bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 rounded text-sm font-medium transition-colors flex items-center justify-center gap-2">
                                View Learning Resources <ExternalLink size={14} />
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default RoadmapSection;
