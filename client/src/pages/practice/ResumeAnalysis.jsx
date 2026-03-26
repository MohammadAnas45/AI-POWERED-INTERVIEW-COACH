import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Upload, FileText, CheckCircle, AlertCircle, Loader2, Sparkles, Target, BarChart, Bug, Lightbulb, ClipboardList, TrendingUp } from 'lucide-react';

const ResumeAnalysis = () => {
    const { user } = useAuth();
    const [resumeFile, setResumeFile] = useState(null);
    const [resumeText, setResumeText] = useState('');
    const [role, setRole] = useState('Developer');
    const [level, setLevel] = useState('Intermediate');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysisResult, setAnalysisResult] = useState(null);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleAnalyze = async () => {
        if (!resumeFile && !resumeText.trim()) {
            setError("Please upload a PDF resume or provide resume text.");
            return;
        }

        setIsAnalyzing(true);
        setError(null);
        setAnalysisResult(null);

        try {
            const token = user?.token;
            if (!token) {
                throw new Error("You must be logged in to analyze a resume.");
            }

            const formData = new FormData();
            formData.append('role', role);
            formData.append('level', level);
            
            if (resumeFile) {
                formData.append('resume', resumeFile);
            } else {
                formData.append('resumeText', resumeText);
            }

            const response = await fetch('/api/practice/analyze-resume', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.message || 'Analysis failed');
            }

            const data = await response.json();
            setAnalysisResult(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsAnalyzing(false);
        }
    };

    const getAtsColor = (score) => {
        if (score >= 80) return 'text-green-500';
        if (score >= 50) return 'text-yellow-500';
        return 'text-red-500';
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="mb-12 text-center">
                    <h1 className="text-4xl sm:text-5xl font-extrabold mb-4 bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                        AI Resume Analysis
                    </h1>
                    <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                        Upload your resume text to get AI-powered insights, ATS scoring, and custom interview questions tailored to your profile.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Input Section */}
                    <div className="lg:col-span-5 space-y-6">
                        <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 backdrop-blur-sm shadow-xl">
                            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                                <FileText className="text-indigo-400 w-5 h-5" />
                                Resume Details
                            </h2>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-2">Target Job Role</label>
                                    <select 
                                        className="w-full bg-slate-800 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 transition-all cursor-pointer"
                                        value={role}
                                        onChange={(e) => setRole(e.target.value)}
                                    >
                                        {['Developer', 'Software Engineer', 'Data Analyst', 'Cyber Security', 'HR', 'Project Manager', 'Customer Support'].map(r => (
                                            <option key={r} value={r}>{r}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-2">Experience Level</label>
                                    <div className="flex gap-2">
                                        {['Beginner', 'Intermediate', 'Pro'].map(l => (
                                            <button
                                                key={l}
                                                onClick={() => setLevel(l)}
                                                className={`flex-1 py-2 rounded-xl text-sm font-medium transition-all ${
                                                    level === l 
                                                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' 
                                                    : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                                                }`}
                                            >
                                                {l}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-4 tracking-wide">Upload PDF Resume</label>
                                    <div 
                                        className={`relative group border-2 border-dashed rounded-3xl p-8 transition-all flex flex-col items-center justify-center text-center cursor-pointer ${
                                            resumeFile ? 'border-indigo-500 bg-indigo-500/5' : 'border-slate-800 hover:border-indigo-500/50 bg-slate-900/50'
                                        }`}
                                        onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
                                        onDrop={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            const file = e.dataTransfer.files[0];
                                            if (file && file.type === 'application/pdf') {
                                                setResumeFile(file);
                                                setError(null);
                                            } else {
                                                setError("Please upload a valid PDF file.");
                                            }
                                        }}
                                        onClick={() => document.getElementById('resume-upload').click()}
                                    >
                                        <input 
                                            id="resume-upload"
                                            type="file" 
                                            className="hidden" 
                                            accept=".pdf"
                                            onChange={(e) => {
                                                const file = e.target.files[0];
                                                if (file) {
                                                    setResumeFile(file);
                                                    setError(null);
                                                }
                                            }}
                                        />
                                        
                                        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110 ${
                                            resumeFile ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/20' : 'bg-slate-800 text-slate-500'
                                        }`}>
                                            <Upload className="w-8 h-8" />
                                        </div>

                                        {resumeFile ? (
                                            <div className="space-y-1">
                                                <p className="text-indigo-400 font-bold max-w-[200px] truncate">{resumeFile.name}</p>
                                                <p className="text-xs text-slate-500">{(resumeFile.size / (1024 * 1024)).toFixed(2)} MB</p>
                                                <button 
                                                    onClick={(e) => { e.stopPropagation(); setResumeFile(null); }}
                                                    className="text-xs text-red-500 hover:text-red-400 font-medium mt-2 underline"
                                                >
                                                    Remove file
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="space-y-1">
                                                <p className="text-slate-300 font-medium">Click to upload or drag & drop</p>
                                                <p className="text-xs text-slate-500">Only PDF files are supported (max 10MB)</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {error && (
                                    <div className="flex items-center gap-2 text-red-400 bg-red-400/10 p-4 rounded-xl text-sm">
                                        <AlertCircle className="shrink-0 w-4 h-4" />
                                        {error}
                                    </div>
                                )}

                                <button
                                    onClick={handleAnalyze}
                                    disabled={isAnalyzing}
                                    className={`w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all ${
                                        isAnalyzing 
                                        ? 'bg-slate-800 text-slate-500 cursor-not-allowed' 
                                        : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-indigo-500/20'
                                    }`}
                                >
                                    {isAnalyzing ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            Analyzing with AI...
                                        </>
                                    ) : (
                                        <>
                                            <Sparkles className="w-5 h-5" />
                                            Analyze Resume
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Results Section */}
                    <div className="lg:col-span-7 space-y-8">
                        {!analysisResult && !isAnalyzing && (
                            <div className="h-full flex flex-col items-center justify-center text-center p-12 border-2 border-dashed border-slate-800 rounded-3xl opacity-50">
                                <Upload className="w-16 h-16 mb-4 text-slate-700" />
                                <h3 className="text-xl font-medium text-slate-500">No Analysis Yet</h3>
                                <p className="text-slate-600">Provide your resume details on the left to start the AI analysis.</p>
                            </div>
                        )}

                        {isAnalyzing && (
                            <div className="h-full flex flex-col items-center justify-center p-12 bg-slate-900/30 border border-slate-800/50 rounded-3xl text-center space-y-6 animate-pulse">
                                <div className="w-20 h-20 bg-indigo-500/20 rounded-full flex items-center justify-center">
                                    <Loader2 className="w-10 h-10 text-indigo-400 animate-spin" />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold text-slate-200">Processing Resume</h3>
                                    <p className="text-slate-500 mt-2 italic">Scanning for skills, identifying gaps, and calculating ATS score...</p>
                                </div>
                            </div>
                        )}

                        {analysisResult && (
                            <div className="space-y-6">
                                {/* Verdict & ATS Card */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl relative overflow-hidden group">
                                        <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                                            <TrendingUp className="w-20 h-20" />
                                        </div>
                                        <h3 className="text-sm font-medium text-slate-500 uppercase tracking-widest mb-4">ATS Optimizer Score</h3>
                                        <div className="flex items-baseline gap-2">
                                            <span className={`text-6xl font-black ${getAtsColor(analysisResult.atsScore)}`}>
                                                {analysisResult.atsScore}
                                            </span>
                                            <span className="text-xl text-slate-600 font-bold">/100</span>
                                        </div>
                                        <p className="mt-4 text-sm text-slate-400">{analysisResult.atsReasoning}</p>
                                    </div>

                                    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl relative overflow-hidden group">
                                        <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                                            <Target className="w-20 h-20" />
                                        </div>
                                        <h3 className="text-sm font-medium text-slate-500 uppercase tracking-widest mb-4">Final Verdict</h3>
                                        <div className={`text-2xl font-bold mb-2 ${
                                            analysisResult.finalVerdict.evaluation === 'Strong Candidate' ? 'text-green-400' : 
                                            analysisResult.finalVerdict.evaluation === 'Intermediate' ? 'text-indigo-400' : 'text-orange-400'
                                        }`}>
                                            {analysisResult.finalVerdict.evaluation}
                                        </div>
                                        <p className="text-sm text-slate-400">{analysisResult.finalVerdict.justification}</p>
                                    </div>
                                </div>

                                {/* Summary */}
                                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
                                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                                        <ClipboardList className="text-indigo-400 w-5 h-5" />
                                        Resume Executive Summary
                                    </h3>
                                    <p className="text-slate-300 leading-relaxed italic border-l-4 border-indigo-500/30 pl-4 py-2">
                                        "{analysisResult.summary}"
                                    </p>
                                </div>

                                {/* Strengths & Weaknesses */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="bg-slate-900/80 border border-emerald-900/30 rounded-3xl p-6">
                                        <h3 className="text-emerald-400 font-bold mb-4 flex items-center gap-2">
                                            <CheckCircle className="w-5 h-5" />
                                            Key Strengths
                                        </h3>
                                        <ul className="space-y-3">
                                            {analysisResult.strengths.map((item, i) => (
                                                <li key={i} className="text-sm text-slate-300 flex items-start gap-2">
                                                    <span className="text-emerald-500/50 mt-1">•</span> {item}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div className="bg-slate-900/80 border border-red-900/30 rounded-3xl p-6">
                                        <h3 className="text-red-400 font-bold mb-4 flex items-center gap-2">
                                            <Bug className="w-5 h-5" />
                                            Gaps & Weaknesses
                                        </h3>
                                        <ul className="space-y-3">
                                            {analysisResult.weaknesses.map((item, i) => (
                                                <li key={i} className="text-sm text-slate-300 flex items-start gap-2">
                                                    <span className="text-red-500/50 mt-1">•</span> {item}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>

                                {/* Skill Analysis */}
                                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
                                    <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                                        <BarChart className="text-purple-400 w-5 h-5" />
                                        Skill Breakdown
                                    </h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                                        <div>
                                            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-tighter mb-3">Technical</h4>
                                            <div className="flex flex-wrap gap-2">
                                                {analysisResult.skillAnalysis.technical.map((s, i) => (
                                                    <span key={i} className="px-2 py-1 bg-indigo-500/10 text-indigo-400 rounded-md text-xs font-medium border border-indigo-500/20">{s}</span>
                                                ))}
                                            </div>
                                        </div>
                                        <div>
                                            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-tighter mb-3">Soft Skills</h4>
                                            <div className="flex flex-wrap gap-2">
                                                {analysisResult.skillAnalysis.soft.map((s, i) => (
                                                    <span key={i} className="px-2 py-1 bg-emerald-500/10 text-emerald-400 rounded-md text-xs font-medium border border-emerald-500/20">{s}</span>
                                                ))}
                                            </div>
                                        </div>
                                        <div>
                                            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-tighter mb-3">Tools</h4>
                                            <div className="flex flex-wrap gap-2">
                                                {analysisResult.skillAnalysis.tools.map((s, i) => (
                                                    <span key={i} className="px-2 py-1 bg-purple-500/10 text-purple-400 rounded-md text-xs font-medium border border-purple-500/20">{s}</span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Custom Questions */}
                                <div className="bg-indigo-950/20 border border-indigo-900/30 rounded-3xl p-6">
                                    <h3 className="text-lg font-bold text-indigo-300 mb-6 flex items-center gap-2">
                                        <Lightbulb className="w-5 h-5" />
                                        Curated Interview Questions
                                    </h3>
                                    <div className="space-y-4">
                                        {analysisResult.interviewQuestions.map((q, i) => (
                                            <div key={i} className="bg-slate-900/50 p-4 rounded-2xl border border-slate-800 hover:border-indigo-500/50 transition-colors group">
                                                <div className="flex justify-between items-start mb-2">
                                                    <span className="text-[10px] font-bold text-indigo-500/70 uppercase tracking-widest">{q.type}</span>
                                                    <span className="text-[10px] text-slate-700 italic group-hover:text-indigo-900/30 transition-colors">Q#{i+1}</span>
                                                </div>
                                                <p className="text-sm text-slate-200 leading-relaxed">{q.question}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Improvement Suggestions */}
                                <div className="bg-gradient-to-br from-indigo-900/40 to-slate-900 border border-indigo-700/30 rounded-3xl p-8 text-center">
                                    <h3 className="text-xl font-bold mb-4">Ready to Level Up?</h3>
                                    <p className="text-slate-400 mb-8 text-sm max-w-md mx-auto">Take these custom questions into our AI Interview Simulation to get real-time feedback and start your preparation.</p>
                                    <button 
                                        onClick={() => navigate('/practice/simulation', { 
                                            state: { 
                                                role, 
                                                level,
                                                customQuestions: analysisResult.interviewQuestions 
                                            } 
                                        })}
                                        className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-indigo-600/30"
                                    >
                                        Start Interview Practice
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResumeAnalysis;
