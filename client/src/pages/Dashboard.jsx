import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Footer from '../components/Footer';
import { LayoutDashboard, User, FileText, Bot, ListChecks, LogOut, ArrowRight, Target, Flame, Calendar, CheckCircle2, X, AlertCircle } from 'lucide-react';
import { useRef } from 'react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
    const { user, logout } = useAuth();
    const [showQuest, setShowQuest] = useState(false);
    const [questData, setQuestData] = useState(null);
    const [questCompleted, setQuestCompleted] = useState(false);
    const [input, setInput] = useState('');
    const [feedback, setFeedback] = useState('');
    
    // Proctoring states for Daily Quest
    const videoRef = useRef(null);
    const faceMeshRef = useRef(null);
    const previousStatusRef = useRef('Face detected');
    const [faceStatus, setFaceStatus] = useState('Face detected');
    const [faceWarning, setFaceWarning] = useState('');
    const [alertCount, setAlertCount] = useState(0);
    const lastLogTimeRef = useRef(0);
    const alertTimeoutRef = useRef(null);

    useEffect(() => {
        const fetchQuest = async () => {
            const token = user?.token;
            if (!token) return;

            try {
                const res = await fetch('http://localhost:5000/api/practice/daily-quest', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await res.json();
                if (data.questions && data.questions.length > 0) {
                    setQuestQuestions(data.questions);
                    setDayCount(data.dayCount);
                    setShowQuest(true);
                    startCamera();
                } else if (data.completed) {
                    setQuestCompleted(true);
                }
            } catch (err) {
                console.error("Daily Quest Error:", err);
            }
        };

        fetchQuest();
        
        return () => {
            if (faceMeshRef.current) faceMeshRef.current.close();
            stopCamera();
        };
    }, [user?.token]);

    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
        } catch (err) {
            console.error("Camera error:", err);
        }
    };

    const stopCamera = () => {
        if (videoRef.current && videoRef.current.srcObject) {
            videoRef.current.srcObject.getTracks().forEach(track => track.stop());
        }
    };

    useEffect(() => {
        if (showQuest && videoRef.current && !faceMeshRef.current) {
            const initFaceMesh = async () => {
                if (typeof window.FaceMesh === 'undefined') return;

                const faceMesh = new window.FaceMesh({
                    locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`
                });

                faceMesh.setOptions({
                    maxNumFaces: 2,
                    refineLandmarks: true,
                    minDetectionConfidence: 0.5,
                    minTrackingConfidence: 0.5
                });

                faceMesh.onResults((results) => {
                    const faceLandmarks = results.multiFaceLandmarks;
                    let currentWarning = '';
                    let currentStatus = 'Face detected';

                    if (!faceLandmarks || faceLandmarks.length === 0) {
                        currentStatus = 'No face detected';
                        currentWarning = '⚠️ Face not detected. Please stay in front of the camera.';
                        incrementViolation('noFace', 'Face not detected during quest');
                    } else if (faceLandmarks.length > 1) {
                        currentStatus = 'Multiple faces detected';
                        currentWarning = '⚠️ Multiple faces detected. Please ensure you are alone.';
                        incrementViolation('multipleFaces', 'More than one face detected');
                    } else {
                        const landmarks = faceLandmarks[0];
                        
                        // Looking Away Detection
                        const noseX = landmarks[1].x;
                        const eyeWidth = landmarks[263].x - landmarks[33].x;
                        const noseRelative = (noseX - landmarks[33].x) / eyeWidth;
                        
                        if (noseRelative < 0.35 || noseRelative > 0.65) {
                            currentStatus = 'Looking away';
                            currentWarning = '⚠️ Please look at the screen. You are being monitored.';
                            incrementViolation('lookingAway', 'User looked away from screen');
                        } else {
                            currentStatus = 'Face detected';
                        }
                    }

                    if (currentStatus !== 'Face detected') {
                        setFaceWarning(currentWarning);
                        if (alertTimeoutRef.current) clearTimeout(alertTimeoutRef.current);
                    } else if (previousStatusRef.current !== 'Face detected') {
                        setFaceWarning(`✅ Behavior Corrected (${alertCount}/3)`);
                        if (alertTimeoutRef.current) clearTimeout(alertTimeoutRef.current);
                        alertTimeoutRef.current = setTimeout(() => {
                            setFaceWarning('');
                        }, 2000);
                    }

                    previousStatusRef.current = currentStatus;
                    setFaceStatus(currentStatus);
                });

                faceMeshRef.current = faceMesh;

                const camera = new window.Camera(videoRef.current, {
                    onFrame: async () => {
                        if (faceMeshRef.current) {
                            try {
                                await faceMeshRef.current.send({ image: videoRef.current });
                            } catch (e) {}
                        }
                    },
                    width: 640,
                    height: 480
                });
                camera.start();
            };

            initFaceMesh();
        }
    }, [showQuest]);

    const incrementViolation = async (type = 'other', desc = '') => {
        const now = Date.now();
        if (now - lastLogTimeRef.current < 3000) return;
        lastLogTimeRef.current = now;
        
        setAlertCount(prev => {
            const next = prev + 1;
            // Only alert here if it's the 3rd strike
            if (next >= 3) {
                // Terminate via local state first
                setTimeout(() => {
                    setShowQuest(false);
                    stopCamera();
                    alert("❌ Quest terminated due to repeated violations (3/3).");
                    setQuestCompleted(true);
                }, 100);
            }
            return next;
        });

        // Log to backend if possible (Quest doesn't have a sessionId but we can use userId)
        // For now, only log to console as Daily Quest doesn't create a formal 'session' in interview_sessions
        console.warn(`Quest Violation [${type}]: ${desc}`);
    };

    // Remove the separate alertCount useEffect as it's merged into incrementViolation
    // to avoid race conditions or dual alerts

    const [questQuestions, setQuestQuestions] = useState([]);
    const [currentQuestIdx, setCurrentQuestIdx] = useState(0);
    const [dayCount, setDayCount] = useState(0);
    const [selectedOption, setSelectedOption] = useState('');

    const handleQuestSubmit = async () => {
        const currentQuest = questQuestions[currentQuestIdx];
        if (selectedOption === currentQuest.correctAnswer) {
            setFeedback('Correct! Well done.');
            
            if (currentQuestIdx < questQuestions.length - 1) {
                // Next question
                setTimeout(() => {
                    setCurrentQuestIdx(prev => prev + 1);
                    setSelectedOption('');
                    setFeedback('');
                }, 1000);
            } else {
                // All questions completed
                try {
                    await fetch('http://localhost:5000/api/practice/complete-quest', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${user.token}`
                        }
                    });
                    setTimeout(() => {
                        setShowQuest(false);
                        setQuestCompleted(true);
                    }, 1500);
                } catch (err) {
                    console.error(err);
                }
            }
        } else {
            setFeedback('Incorrect. Try again!');
        }
    };

    const currentQuest = questQuestions[currentQuestIdx];

    const stats = [
        { name: 'Mock Interviews', value: '12', icon: Bot, color: 'text-indigo-400' },
        { name: 'Average Score', value: '85%', icon: Target, color: 'text-emerald-400' },
        { name: 'Login Streak', value: `🔥 ${user?.streak_count || 1} Days`, icon: Flame, color: 'text-orange-500' },
    ];

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col">
            {/* Daily Quest Popup */}
            {showQuest && currentQuest && (
                <div className="fixed inset-0 z-[100] bg-slate-950/90 backdrop-blur-xl flex items-center justify-center p-6 text-center animate-in fade-in duration-500">
                    <div className="max-w-2xl w-full bg-slate-900 border border-blue-500/30 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4">
                            <button onClick={() => setShowQuest(false)} className="text-slate-500 hover:text-white transition-colors">
                                <X size={24} />
                            </button>
                        </div>
                        
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2 text-blue-400 font-bold">
                                <Calendar size={20} /> Daily Quest - Day {dayCount}
                            </div>
                            <div className="flex items-center gap-4">
                                <div className={`text-[10px] font-bold px-3 py-1 rounded-full border ${faceStatus === 'Face detected' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-red-500 text-white'}`}>
                                    {faceStatus}
                                </div>
                                <div className="text-xs text-slate-500">
                                    Question {currentQuestIdx + 1} of {questQuestions.length}
                                </div>
                            </div>
                        </div>

                        {/* Camera Preview */}
                        <div className="mb-6 relative h-40 bg-slate-950 rounded-2xl border border-white/5 overflow-hidden group">
                            <video ref={videoRef} autoPlay muted playsInline className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" />
                            {faceWarning && (
                                <div className={`absolute top-2 left-2 right-2 ${faceWarning.includes('✅') ? 'bg-emerald-600/90' : 'bg-red-600/90'} text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider animate-pulse flex items-center justify-between gap-2 shadow-lg`}>
                                    <div className="flex items-center gap-2">
                                        <AlertCircle size={14} /> {faceWarning}
                                    </div>
                                    {alertCount > 0 && !faceWarning.includes('✅') && (
                                        <div className="bg-white/20 px-2 py-0.5 rounded text-[8px] font-bold">
                                            {alertCount} / 3 VIOLATIONS
                                        </div>
                                    )}
                                </div>
                            )}
                            <div className="absolute bottom-2 right-2 px-2 py-0.5 bg-white/5 backdrop-blur-md rounded text-[8px] text-slate-500 font-bold uppercase tracking-widest">
                                Live Monitoring Active
                            </div>
                        </div>
                        
                        <h2 className="text-xl font-bold mb-6 text-left whitespace-pre-wrap font-mono bg-slate-950 p-4 rounded-xl border border-white/5">
                            {currentQuest.questionText}
                        </h2>

                        <div className="grid grid-cols-1 gap-3 mb-8">
                            {currentQuest.options?.map((opt, i) => (
                                <button 
                                    key={i}
                                    onClick={() => setSelectedOption(opt)}
                                    className={`p-4 rounded-xl text-left transition-all border ${selectedOption === opt ? 'bg-blue-600 border-blue-400 text-white' : 'bg-slate-800 border-white/5 text-slate-400 hover:border-white/20'}`}
                                >
                                    {opt}
                                </button>
                            ))}
                        </div>

                        {feedback && (
                            <div className={`mb-4 font-bold ${feedback.includes('Correct') ? 'text-emerald-400' : 'text-red-400'}`}>
                                {feedback}
                            </div>
                        )}

                        <button 
                            onClick={handleQuestSubmit}
                            disabled={!selectedOption}
                            className={`w-full py-4 rounded-xl font-bold transition-all shadow-lg ${selectedOption ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-600/20' : 'bg-slate-800 text-slate-500 cursor-not-allowed'}`}
                        >
                            {currentQuestIdx < questQuestions.length - 1 ? 'Next Question' : 'Complete Quest'}
                        </button>
                    </div>
                </div>
            )}

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
                        <div className="bg-slate-900/40 backdrop-blur-xl border border-white/10 p-8 rounded-3xl flex justify-between items-center">
                            <div>
                                <h1 className="text-3xl font-bold text-white mb-2">Welcome back, {user?.fullName}! 👋</h1>
                                <p className="text-slate-400">Here's an overview of your interview preparation progress.</p>
                            </div>
                            {questCompleted && (
                                <div className="hidden md:flex flex-col items-center bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-2xl">
                                    <CheckCircle2 className="text-emerald-400 mb-1" size={24} />
                                    <span className="text-[10px] text-emerald-400 font-bold uppercase">Today's Quest Done</span>
                                </div>
                            )}
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
                                <Link to="/practice/resume-analysis" className="inline-flex items-center gap-2 text-indigo-400 font-bold hover:gap-3 transition-all">
                                    Analyze Now <FileText size={18} />
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
