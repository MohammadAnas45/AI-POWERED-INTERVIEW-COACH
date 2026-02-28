import React, { useEffect, useState } from 'react';
import { ArrowRight, Sparkles, MoveDown, Bot, Code2, Server } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Hero = () => {
    const { user } = useAuth();
    const [offset, setOffset] = useState(0);

    useEffect(() => {
        const handleScroll = () => setOffset(window.pageYOffset * 0.5);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="relative isolate pt-14 lg:pt-20 min-h-screen flex items-center justify-center overflow-hidden">
            {/* Background Gradient Effect */}
            <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80 opacity-40">
                <div
                    className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
                    style={{
                        clipPath:
                            'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
                        transform: `translateY(${offset}px)`
                    }}
                />
            </div>

            <div className="py-24 sm:py-32 lg:pb-40 text-center px-6 lg:px-8 max-w-7xl mx-auto z-10">

                {/* Animated Pill */}
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full ring-1 ring-white/10 bg-white/5 backdrop-blur-sm text-sm font-semibold text-slate-300 mb-8 animate-fade-in-up hover:ring-indigo-500/50 transition-all cursor-default select-none">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    <span>AI Coach v1.0 Live</span>
                </div>

                <h1 className="text-4xl sm:text-7xl font-bold tracking-tight text-white !leading-tight drop-shadow-2xl mb-6">
                    AI-Powered <br className="hidden sm:block" />
                    <span className="bg-gradient-to-r from-blue-400 via-emerald-400 to-purple-500 text-transparent bg-clip-text animate-gradient-text">
                        Interview Coach
                    </span>
                </h1>

                <p className="mt-6 text-xl leading-8 text-slate-400 max-w-2xl mx-auto">
                    Prepare smarter. Practice better. Succeed faster. Master your technical interviews with personalized AI feedback, structured roadmaps, and real-time coding analysis.
                </p>

                <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-6">
                    {user ? (
                        <Link
                            to="/interview"
                            className="group relative inline-flex items-center justify-center gap-2 rounded-full border border-transparent bg-indigo-600 px-8 py-3 text-base font-bold text-white shadow-xl hover:bg-indigo-500 hover:shadow-indigo-500/25 transition-all w-full sm:w-auto overflow-hidden ring-4 ring-transparent hover:ring-indigo-500/20"
                        >
                            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shimmer" />
                            Launch Workspace
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    ) : (
                        <Link
                            to="/register"
                            className="group relative inline-flex items-center justify-center gap-2 rounded-full border border-transparent bg-indigo-600 px-8 py-3 text-base font-bold text-white shadow-xl hover:bg-indigo-500 hover:shadow-indigo-500/25 transition-all w-full sm:w-auto overflow-hidden ring-4 ring-transparent hover:ring-indigo-500/20"
                        >
                            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shimmer" />
                            Get Started Free
                            <Bot className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                        </Link>
                    )}

                    <a
                        href="#roadmap"
                        className="group flex items-center justify-center gap-2 rounded-full ring-1 ring-white/20 bg-white/5 hover:bg-white/10 px-8 py-3 text-base font-semibold text-white transition-all w-full sm:w-auto shadow-lg hover:shadow-white/5 backdrop-blur-sm"
                    >
                        View Roadmap
                        <MoveDown className="w-5 h-5 group-hover:translate-y-1 transition-transform" />
                    </a>
                </div>

                {/* Feature Highlights Mockup */}
                <div className="mt-16 flex justify-center gap-4 text-slate-500 text-sm font-mono opacity-60">
                    <div className="flex items-center gap-1"><Code2 size={14} /> React</div>
                    <div className="flex items-center gap-1">•</div>
                    <div className="flex items-center gap-1"><Bot size={14} /> AI Analysis</div>
                    <div className="flex items-center gap-1">•</div>
                    <div className="flex items-center gap-1"><Server size={14} /> System Design</div>
                </div>
            </div>
        </div>
    );
};

export default Hero;
