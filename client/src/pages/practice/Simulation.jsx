import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Timer, Send, AlertCircle, CheckCircle } from 'lucide-react';


const Simulation = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { role, level } = location.state || {};

    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answer, setAnswer] = useState('');
    const [sessionId, setSessionId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [timeLeft, setTimeLeft] = useState(600); // 10 minutes total timer
    const textareaRef = useRef(null);

    useEffect(() => {
        if (!role || !level) {
            navigate('/practice/role');
            return;
        }

        const startSession = async () => {
            try {
                const storedUser = JSON.parse(localStorage.getItem('ai_coach_user') || '{}');
                const token = storedUser.token;

                if (!token) {
                    navigate('/login');
                    return;
                }

                const response = await fetch('http://localhost:5000/api/practice/start', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ role, level })
                });
                const data = await response.json();

                if (response.ok) {
                    setQuestions(data.questions || []);
                    setSessionId(data.sessionId);
                } else {
                    console.error('Failed to start session:', data.message);
                }
                setLoading(false);
            } catch (error) {
                console.error('Error starting session:', error);
                setLoading(false);
            }
        };

        startSession();
    }, [role, level, navigate]);

    useEffect(() => {
        if (loading) return;

        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 0) {
                    clearInterval(timer);
                    handleSubmitTest();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [loading]);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const handleAnswerSubmit = async () => {
        if (!answer.trim() || submitting) return;

        setSubmitting(true);
        try {
            const storedUser = JSON.parse(localStorage.getItem('ai_coach_user') || '{}');
            const token = storedUser.token;
            const currentQuestion = questions[currentQuestionIndex];

            await fetch('http://localhost:5000/api/practice/submit-answer', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    sessionId,
                    questionId: currentQuestion.id,
                    questionText: currentQuestion.questionText,
                    answerText: answer
                })
            });

            if (currentQuestionIndex < questions.length - 1) {
                setCurrentQuestionIndex(prev => prev + 1);
                setAnswer('');
                textareaRef.current?.focus();
            } else {
                handleSubmitTest();
            }
        } catch (error) {
            console.error('Error submitting answer:', error);
        } finally {
            setSubmitting(false);
        }
    };

    const handleSubmitTest = async () => {
        setSubmitting(true);
        try {
            const storedUser = JSON.parse(localStorage.getItem('ai_coach_user') || '{}');
            const token = storedUser.token;
            const response = await fetch('http://localhost:5000/api/practice/submit-test', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ sessionId })
            });
            const data = await response.json();
            navigate('/practice/results', { state: { result: data } });
        } catch (error) {
            console.error('Error finalizing test:', error);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <p className="text-slate-400">Preparing your interview session...</p>
                </div>
            </div>
        );
    }

    if (!questions || questions.length === 0) {
        return (
            <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">
                <div className="text-center p-12 bg-slate-800/50 rounded-3xl border border-slate-700 max-w-md mx-auto">
                    <AlertCircle className="w-16 h-16 text-amber-500 mx-auto mb-6" />
                    <h2 className="text-2xl font-bold mb-4">No Questions Found</h2>
                    <p className="text-slate-400 mb-8">We couldn't find any questions for the selected role and level. Our team is working on expanding the question bank!</p>
                    <button
                        onClick={() => navigate('/practice/role')}
                        className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-xl font-bold transition-all"
                    >
                        Try Another Role
                    </button>
                </div>
            </div>
        );
    }

    const progress = ((currentQuestionIndex) / questions.length) * 100;

    return (
        <div className="min-h-screen bg-slate-900 text-white font-sans">


            <div className="pt-20"> {/* Offset for Fixed Navbar */}
                {/* Simulation Stats Bar (Timer & Progress) */}
                <div className="bg-slate-900/50 backdrop-blur-md sticky top-16 z-10 border-b border-slate-800">
                    <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <span className="bg-blue-600/20 text-blue-400 px-3 py-1 rounded-full text-sm font-medium border border-blue-500/30">
                                {role} • {level}
                            </span>
                        </div>

                        <div className="flex items-center gap-6">
                            <div className="flex items-center gap-2 text-slate-300 bg-slate-800 px-4 py-1.5 rounded-lg border border-slate-700">
                                <Timer className={`w-4 h-4 ${timeLeft < 60 ? 'text-red-400 animate-pulse' : 'text-blue-400'}`} />
                                <span className={`font-mono font-bold ${timeLeft < 60 ? 'text-red-400' : ''}`}>
                                    {formatTime(timeLeft)}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Progress bar */}
                    <div className="w-full h-1 bg-slate-800">
                        <div
                            className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-500 ease-out"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>

                <main className="max-w-4xl mx-auto px-6 py-12">
                    <div className="mb-12">
                        <span className="text-blue-400 font-semibold mb-2 block uppercase tracking-wider text-sm">
                            Question {currentQuestionIndex + 1} of {questions.length}
                        </span>
                        <h2 className="text-3xl font-bold leading-tight text-slate-100">
                            {questions[currentQuestionIndex]?.questionText}
                        </h2>
                    </div>

                    <div className="relative group">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl opacity-20 group-focus-within:opacity-40 transition-opacity blur"></div>
                        <textarea
                            ref={textareaRef}
                            value={answer}
                            onChange={(e) => setAnswer(e.target.value)}
                            placeholder="Write your answer here..."
                            className="relative w-full h-64 bg-slate-900 border border-slate-700 rounded-2xl p-6 text-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500/50 transition-all resize-none"
                            autoFocus
                        />
                    </div>

                    <div className="mt-8 flex justify-between items-center">
                        <div className="flex items-center gap-4 text-slate-500 text-sm">
                            <div className="flex items-center gap-1.5">
                                <AlertCircle className="w-4 h-4" />
                                <span>Answers are saved automatically</span>
                            </div>
                        </div>

                        <button
                            onClick={handleAnswerSubmit}
                            disabled={!answer.trim() || submitting}
                            className={`flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 ${answer.trim() && !submitting
                                ? 'bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-600/20 active:scale-95'
                                : 'bg-slate-800 text-slate-600 cursor-not-allowed border border-slate-700'
                                }`}
                        >
                            {submitting ? (
                                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                            ) : (
                                <>
                                    {currentQuestionIndex === questions.length - 1 ? 'Finish Interview' : 'Next Question'}
                                    <Send className="w-5 h-5" />
                                </>
                            )}
                        </button>
                    </div>
                </main>
            </div> {/* End of pt-20 */}
        </div>
    );
};

export default Simulation;
