import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaceDetector, FilesetResolver } from '@mediapipe/tasks-vision';
import { Timer, Send, AlertCircle, CheckCircle, Sparkles, Mic, MicOff, Camera, Maximize, Play, Type, AlertTriangle } from 'lucide-react';


const Simulation = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { role, level } = location.state || {};

    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answer, setAnswer] = useState('');
    const [sessionId, setSessionId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showStartOverlay, setShowStartOverlay] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [timeLeft, setTimeLeft] = useState(600); // 10 minutes total timer
    const [startCount, setStartCount] = useState(null);
    const [showReference, setShowReference] = useState(false);
    const [inputMode, setInputMode] = useState('text'); // 'text' or 'voice'
    const textareaRef = useRef(null);

    // Camera & Recording
    const [isRecording, setIsRecording] = useState(false);
    const [cameraStream, setCameraStream] = useState(null);
    const videoRef = useRef(null);
    const streamRef = useRef(null);
    const mediaRecorderRef = useRef(null);
    const chunksRef = useRef([]);

    // Speech to Text
    const [isListening, setIsListening] = useState(false);
    const recognitionRef = useRef(null);

    // Face Detection
    const [isFaceDetectionReady, setIsFaceDetectionReady] = useState(false);
    const [showWarningOverlay, setShowWarningOverlay] = useState(false);
    const [warningMessage, setWarningMessage] = useState('');
    const faceDetectorRef = useRef(null);
    const animationFrameIdRef = useRef(null);
    const faceViolationStartTimeRef = useRef(null);
    const VIOLATION_THRESHOLD_MS = 2000;
    const lastVideoTimeRef = useRef(-1);

    // Full Screen State
    const [isFullScreen, setIsFullScreen] = useState(false);

    // Camera Visibility Fix
    useEffect(() => {
        if (videoRef.current && cameraStream) {
            videoRef.current.srcObject = cameraStream;
        }
    }, [cameraStream, loading, showStartOverlay, startCount, showWarningOverlay]);

    useEffect(() => {
        if (!role || !level) {
            navigate('/practice/role');
            return;
        }

        let isMounted = true;

        const setupInterview = async () => {
            try {
                // 1. Setup Camera (request permission early)
                if (isMounted) await startCamera();

                // 2. Start Session & Get Questions
                if (!isMounted) return;
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

        setupInterview();

        return () => {
            isMounted = false;
            stopCamera();
            stopRecording();
        };
    }, [role, level, navigate]);

    useEffect(() => {
        const initFaceDetector = async () => {
            try {
                const vision = await FilesetResolver.forVisionTasks(
                    "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/wasm"
                );
                const detector = await FaceDetector.createFromOptions(vision, {
                    baseOptions: {
                        modelAssetPath: `https://storage.googleapis.com/mediapipe-models/face_detector/blaze_face_short_range/float16/1/blaze_face_short_range.tflite`,
                        delegate: "GPU"
                    },
                    runningMode: "VIDEO"
                });
                faceDetectorRef.current = detector;
                setIsFaceDetectionReady(true);
            } catch (error) {
                console.error("Failed to initialize face detector", error);
            }
        };
        initFaceDetector();

        return () => {
            if (faceDetectorRef.current) {
                faceDetectorRef.current.close();
            }
            if (animationFrameIdRef.current) {
                cancelAnimationFrame(animationFrameIdRef.current);
            }
        };
    }, []);

    useEffect(() => {
        if (!isFaceDetectionReady || !cameraStream || !videoRef.current || loading || showStartOverlay || startCount !== 0) {
            return;
        }

        const detectFace = () => {
            const video = videoRef.current;
            if (video && video.readyState >= 2 && faceDetectorRef.current) {
                let startTimeMs = performance.now();
                if (video.currentTime !== lastVideoTimeRef.current) {
                    lastVideoTimeRef.current = video.currentTime;
                    const detections = faceDetectorRef.current.detectForVideo(video, startTimeMs).detections;
                    
                    if (detections.length !== 1) {
                        if (!faceViolationStartTimeRef.current) {
                            faceViolationStartTimeRef.current = startTimeMs;
                        } else if (startTimeMs - faceViolationStartTimeRef.current > VIOLATION_THRESHOLD_MS) {
                            setWarningMessage(detections.length === 0 ? "No face detected in the frame." : "Multiple faces detected in the frame.");
                            setShowWarningOverlay(true);
                        }
                    } else {
                        faceViolationStartTimeRef.current = null;
                        setShowWarningOverlay(false);
                    }
                }
            }
            animationFrameIdRef.current = requestAnimationFrame(detectFace);
        };

        detectFace();

        return () => {
            if (animationFrameIdRef.current) {
                cancelAnimationFrame(animationFrameIdRef.current);
            }
        };
    }, [isFaceDetectionReady, cameraStream, loading, showStartOverlay, startCount]);

    useEffect(() => {
        if (loading || showStartOverlay || startCount !== 0 || showWarningOverlay) return;

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
    }, [loading, showStartOverlay, startCount]);

    // Handle Fullscreen Changes
    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullScreen(!!document.fullscreenElement);
        };

        const handleKeyDown = (e) => {
            if (e.key === 'Escape' && document.fullscreenElement) {
                // Browser handles exiting fullscreen on Esc, 
                // but we can add additional logic here if needed.
                console.log('User pressed Esc to exit fullscreen');
            }
        };

        document.addEventListener('fullscreenchange', handleFullscreenChange);
        document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
        document.addEventListener('mozfullscreenchange', handleFullscreenChange);
        document.addEventListener('MSFullscreenChange', handleFullscreenChange);
        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('fullscreenchange', handleFullscreenChange);
            document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
            document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
            document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    // Full Screen Logic
    const enterFullScreen = () => {
        const elem = document.documentElement;
        try {
            if (elem.requestFullscreen) {
                elem.requestFullscreen();
            } else if (elem.webkitRequestFullscreen) {
                elem.webkitRequestFullscreen();
            } else if (elem.msRequestFullscreen) {
                elem.msRequestFullscreen();
            }
        } catch (error) {
            console.error("Error entering fullscreen:", error);
        }
    };

    const exitFullScreen = () => {
        try {
            if (document.fullscreenElement) {
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                } else if (document.webkitExitFullscreen) {
                    document.webkitExitFullscreen();
                } else if (document.msExitFullscreen) {
                    document.msExitFullscreen();
                }
            }
        } catch (error) {
            console.error("Error exiting fullscreen:", error);
        }
    };

    // Camera Logic
    const startCamera = async () => {
        if (streamRef.current) return;
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            streamRef.current = stream;
            setCameraStream(stream);
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
        } catch (err) {
            console.error("Camera error:", err);
            const errorMsg = err.name === 'NotAllowedError'
                ? "Camera permission was denied. Please click the camera icon in your browser's address bar to allow access and refresh the page."
                : (err.name === 'NotReadableError' || err.name === 'TrackStartError')
                    ? "Camera is already in use by another application (like Zoom, Teams, or another browser tab). Please close them and refresh."
                    : "Could not access camera. Please ensure it's connected and not being used by another app.";
            alert(errorMsg);
        }
    };

    const stopCamera = () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }
        setCameraStream(null);
    };


    // Recording Logic
    const startRecording = () => {
        if (!cameraStream) return;

        chunksRef.current = [];
        const mediaRecorder = new MediaRecorder(cameraStream);
        mediaRecorderRef.current = mediaRecorder;

        mediaRecorder.ondataavailable = (e) => {
            if (e.data.size > 0) {
                chunksRef.current.push(e.data);
            }
        };

        mediaRecorder.start();
        setIsRecording(true);
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
        }
    };

    const handleActualStart = () => {
        if (!questions || questions.length === 0) {
            alert("No questions available for this session. Please try a different role.");
            return;
        }

        enterFullScreen();
        setStartCount(3);
        setShowStartOverlay(false);

        const countInt = setInterval(() => {
            setStartCount(prev => {
                if (prev <= 1) {
                    clearInterval(countInt);
                    startRecording();
                    // Force video stream attachment after countdown
                    setTimeout(() => {
                        if (videoRef.current && streamRef.current) {
                            videoRef.current.srcObject = streamRef.current;
                        }
                    }, 100);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };

    // Speech Recognition Logic
    const toggleListening = () => {
        if (isListening) {
            recognitionRef.current?.stop();
            setIsListening(false);
        } else {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            if (!SpeechRecognition) {
                alert("Speech recognition not supported in this browser.");
                return;
            }

            const rec = new SpeechRecognition();
            rec.continuous = true;
            rec.interimResults = true;
            rec.lang = 'en-US';

            rec.onresult = (event) => {
                let interimTranscript = '';
                let finalTranscript = '';

                for (let i = event.resultIndex; i < event.results.length; ++i) {
                    if (event.results[i].isFinal) {
                        finalTranscript += event.results[i][0].transcript;
                    } else {
                        interimTranscript += event.results[i][0].transcript;
                    }
                }

                if (finalTranscript) {
                    setAnswer(prev => prev + (prev.length > 0 ? ' ' : '') + finalTranscript);
                }
            };

            rec.onerror = (event) => {
                console.error("Speech error:", event.error);
                setIsListening(false);
            };

            rec.onend = () => {
                setIsListening(false);
            };

            rec.start();
            recognitionRef.current = rec;
            setIsListening(true);
        }
    };

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
                setShowReference(false);
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
        stopRecording();

        try {
            const storedUser = JSON.parse(localStorage.getItem('ai_coach_user') || '{}');
            const token = storedUser.token;

            // Wait a bit for recorder chunks
            setTimeout(async () => {
                // 1. Upload Video
                if (chunksRef.current.length > 0) {
                    const blob = new Blob(chunksRef.current, { type: 'video/webm' });
                    const formData = new FormData();
                    formData.append('video', blob, 'interview.webm');
                    formData.append('sessionId', sessionId);

                    await fetch('http://localhost:5000/api/practice/upload-video', {
                        method: 'POST',
                        headers: { 'Authorization': `Bearer ${token}` },
                        body: formData
                    });
                }

                // 2. Submit Final result
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
            }, 500);

        } catch (error) {
            console.error('Error finalizing test:', error);
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

    if (showStartOverlay) {
        return (
            <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white px-6">
                <div className="max-w-xl w-full bg-slate-800 border border-slate-700 rounded-3xl p-10 text-center shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-10">
                        <Camera size={120} />
                    </div>

                    <h2 className="text-3xl font-bold mb-4">Ready to start?</h2>
                    <p className="text-slate-400 mb-8 leading-relaxed">
                        This session will be recorded. Please ensure you are in a quiet environment.
                        The exam will switch to <b>full screen</b> mode for focus.
                    </p>

                    <div className="aspect-video bg-slate-900 rounded-xl mb-8 border border-slate-700 overflow-hidden relative group">
                        <video ref={videoRef} autoPlay muted playsInline className="w-full h-full object-cover" />
                        {!cameraStream && (
                            <div className="absolute inset-0 flex items-center justify-center text-slate-500 bg-slate-950/50">
                                Requesting Camera...
                            </div>
                        )}
                    </div>

                    <button
                        onClick={handleActualStart}
                        className="w-full bg-blue-600 hover:bg-blue-500 text-white py-4 rounded-2xl font-bold text-xl transition-all flex items-center justify-center gap-3 shadow-lg shadow-blue-600/20 active:scale-95"
                    >
                        <Play fill="currentColor" /> Start Interview
                    </button>
                </div>
            </div>
        );
    }

    if (startCount !== null && startCount > 0) {
        return (
            <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white overflow-hidden">
                <div className="text-center relative">
                    {/* Pulsing glow background */}
                    <div className="absolute inset-0 bg-blue-500/20 blur-[100px] rounded-full animate-pulse transition-all"></div>

                    <div className="relative">
                        <div className="text-[12rem] font-black text-blue-500 animate-bounce leading-none drop-shadow-[0_0_30px_rgba(59,130,246,0.5)]">
                            {startCount}
                        </div>
                        <p className="text-3xl font-bold text-slate-400 uppercase tracking-[0.5em] mt-4 animate-pulse">
                            Get Ready
                        </p>
                    </div>
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

            {/* Camera Overlay */}
            <div className="fixed bottom-6 right-6 z-[110] w-64 h-48 bg-slate-800 rounded-2xl border-2 border-blue-500 overflow-hidden shadow-2xl transition-transform hover:scale-110">
                <video ref={videoRef} autoPlay muted playsInline className="w-full h-full object-cover" />
                <div className="absolute top-2 left-2 px-2 py-0.5 bg-red-600 text-[10px] font-bold rounded flex items-center gap-1">
                    <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                    LIVE Recording
                </div>
            </div>

            {showWarningOverlay && (
                <div className="fixed inset-0 z-[100] bg-slate-950/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center">
                    <AlertTriangle className="w-24 h-24 text-red-500 mb-6 animate-pulse" />
                    <h2 className="text-4xl font-bold text-white mb-4">Exam Warning</h2>
                    <p className="text-xl text-red-200 max-w-2xl bg-black/50 p-6 rounded-2xl border border-red-500/30">
                        {warningMessage}
                        <br/><br/>
                        Please ensure you are sitting clearly in front of the camera and no one else is visible.
                        The exam will resume automatically when a single face is properly detected.
                    </p>
                </div>
            )}

            <div className="pt-20"> {/* Offset for Fixed Navbar */}
                {/* Simulation Stats Bar (Timer & Progress) */}
                <div className="bg-slate-900/50 backdrop-blur-md sticky top-16 z-10 border-b border-slate-800">
                    <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <span className="bg-blue-600/20 text-blue-400 px-3 py-1 rounded-full text-sm font-medium border border-blue-500/30">
                                {role} • {level}
                            </span>
                            {!isFullScreen && (
                                <button
                                    onClick={enterFullScreen}
                                    className="flex items-center gap-2 text-amber-400 bg-amber-400/10 px-3 py-1 rounded-full text-xs font-bold border border-amber-400/20 animate-pulse hover:bg-amber-400/20 transition-all"
                                >
                                    <AlertCircle size={14} />
                                    Re-enter Focus Mode
                                </button>
                            )}
                        </div>

                        <div className="flex items-center gap-6">
                            <div className="flex items-center gap-2 text-slate-300 bg-slate-800 px-4 py-1.5 rounded-lg border border-slate-700">
                                <Timer className={`w-4 h-4 ${timeLeft < 60 ? 'text-red-400 animate-pulse' : 'text-blue-400'}`} />
                                <span className={`font-mono font-bold ${timeLeft < 60 ? 'text-red-400' : ''}`}>
                                    {formatTime(timeLeft)}
                                </span>
                            </div>
                            <button
                                onClick={isFullScreen ? exitFullScreen : enterFullScreen}
                                className={`${isFullScreen ? 'text-blue-400' : 'text-slate-400'} hover:text-white transition-colors p-2 hover:bg-slate-800 rounded-lg`}
                                title={isFullScreen ? "Exit Fullscreen (Esc)" : "Enter Fullscreen"}
                            >
                                <Maximize size={20} />
                            </button>
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

                    <div className="flex items-center gap-4 mb-4">
                        <button
                            onClick={() => setInputMode('text')}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${inputMode === 'text'
                                ? 'bg-blue-600 text-white'
                                : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                                }`}
                        >
                            <Type className="w-4 h-4" />
                            Type Answer
                        </button>
                        <button
                            onClick={() => setInputMode('voice')}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${inputMode === 'voice'
                                ? 'bg-blue-600 text-white'
                                : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                                }`}
                        >
                            <Mic className="w-4 h-4" />
                            Speak Answer
                        </button>
                    </div>

                    <div className="relative group">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl opacity-20 group-focus-within:opacity-40 transition-opacity blur"></div>

                        {inputMode === 'text' ? (
                            <textarea
                                ref={textareaRef}
                                value={answer}
                                onChange={(e) => setAnswer(e.target.value)}
                                placeholder="Write your answer here..."
                                className="relative w-full h-64 bg-slate-900 border border-slate-700 rounded-2xl p-6 text-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500/50 transition-all resize-none"
                                autoFocus
                            />
                        ) : (
                            <div className="relative w-full h-64 bg-slate-900 border border-slate-700 rounded-2xl p-6 flex flex-col items-center justify-center">
                                <textarea
                                    className="w-full flex-1 bg-transparent border-none text-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-0 resize-none mb-4 custom-scrollbar"
                                    value={answer}
                                    onChange={(e) => setAnswer(e.target.value)}
                                    placeholder="Your speech will appear here... (You can also edit this text manually)"
                                />
                                <button
                                    onClick={toggleListening}
                                    className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold transition-all shadow-lg ${isListening
                                        ? 'bg-red-500/20 text-red-400 border border-red-500/50 hover:bg-red-500/30 animate-pulse'
                                        : 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-600/20'
                                        }`}
                                >
                                    {isListening ? (
                                        <>
                                            <MicOff className="w-5 h-5" />
                                            Stop Recording
                                        </>
                                    ) : (
                                        <>
                                            <Mic className="w-5 h-5" />
                                            Start Recording
                                        </>
                                    )}
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Reference Answer Section */}
                    <div className="mt-8">
                        <button
                            onClick={() => setShowReference(!showReference)}
                            className="flex items-center gap-2 text-blue-400 hover:text-blue-300 font-medium transition-colors mb-4"
                        >
                            <Sparkles size={18} />
                            {showReference ? 'Hide Reference Answer' : 'See Reference Answer'}
                        </button>

                        {showReference && (
                            <div className="bg-blue-600/10 border border-blue-500/20 rounded-2xl p-6 animate-in slide-in-from-top-4 duration-300">
                                <h4 className="flex items-center gap-2 text-blue-400 font-bold mb-3">
                                    <CheckCircle size={18} />
                                    Ideal Response
                                </h4>
                                <p className="text-slate-300 leading-relaxed italic">
                                    "{questions[currentQuestionIndex]?.answerText || 'No reference answer available for this question.'}"
                                </p>
                            </div>
                        )}
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
