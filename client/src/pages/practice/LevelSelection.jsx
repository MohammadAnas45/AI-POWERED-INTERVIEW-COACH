import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Zap, Target, Award, ArrowLeft } from 'lucide-react';

const LevelSelection = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { role } = location.state || {};
    const [selectedLevel, setSelectedLevel] = useState('');

    const levels = [
        {
            name: 'Beginner',
            icon: <Zap className="w-8 h-8 text-emerald-400" />,
            description: 'Foundation level questions focusing on core concepts and basics.',
            accent: 'emerald'
        },
        {
            name: 'Intermediate',
            icon: <Target className="w-8 h-8 text-blue-400" />,
            description: 'Scenario-based questions and medium-difficulty technical challenges.',
            accent: 'blue'
        },
        {
            name: 'Pro',
            icon: <Award className="w-8 h-8 text-purple-400" />,
            description: 'Advanced problem solving, architecture-level questions, and deep dives.',
            accent: 'purple'
        }
    ];

    const handleStart = () => {
        if (selectedLevel) {
            navigate('/practice/simulation', { state: { role, level: selectedLevel } });
        }
    };

    if (!role) {
        navigate('/practice/role');
        return null;
    }

    return (
        <div className="min-h-screen bg-slate-900 text-white pt-24 pb-12 px-8">
            <div className="max-w-4xl mx-auto">
                <button
                    onClick={() => navigate('/practice/role')}
                    className="flex items-center gap-2 text-slate-400 hover:text-white mb-8 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" /> Back to Role Selection
                </button>

                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">
                        Choose Your Difficulty
                    </h1>
                    <p className="text-slate-400 text-lg">
                        You've selected <span className="text-blue-400 font-semibold">{role}</span>. Now pick a level.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                    {levels.map((level) => (
                        <button
                            key={level.name}
                            onClick={() => setSelectedLevel(level.name)}
                            className={`p-6 rounded-2xl border transition-all duration-300 text-left flex flex-col gap-4 ${selectedLevel === level.name
                                ? `bg-${level.accent}-600/10 border-${level.accent}-500 shadow-[0_0_20px_rgba(0,0,0,0.3)] scale-[1.02]`
                                : 'bg-slate-800/40 border-slate-700 hover:border-slate-500'
                                }`}
                        >
                            <div className={`p-3 rounded-lg w-fit ${selectedLevel === level.name ? `bg-${level.accent}-500/20` : 'bg-slate-700/50'
                                }`}>
                                {level.icon}
                            </div>
                            <h3 className="text-xl font-bold text-slate-100">{level.name}</h3>
                            <p className="text-slate-400 text-sm leading-relaxed">
                                {level.description}
                            </p>
                        </button>
                    ))}
                </div>

                {/* Inline styles for dynamic border/bg because Tailwind jit doesn't always pick up concatenated classes */}
                <style dangerouslySetInnerHTML={{
                    __html: `
                    .bg-emerald-600\\/10 { background-color: rgba(16, 185, 129, 0.1); }
                    .border-emerald-500 { border-color: #10b981; }
                    .bg-blue-600\\/10 { background-color: rgba(37, 99, 235, 0.1); }
                    .border-blue-500 { border-color: #3b82f6; }
                    .bg-purple-600\\/10 { background-color: rgba(147, 51, 234, 0.1); }
                    .border-purple-500 { border-color: #a855f7; }
                `}} />

                <div className="mt-12 flex justify-center">
                    <button
                        onClick={handleStart}
                        disabled={!selectedLevel}
                        className={`px-16 py-4 rounded-full font-bold text-lg transition-all duration-300 ${selectedLevel
                            ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:shadow-lg hover:shadow-blue-500/25 transform hover:-translate-y-1'
                            : 'bg-slate-700 text-slate-500 cursor-not-allowed'
                            }`}
                    >
                        Start Simulation
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LevelSelection;
