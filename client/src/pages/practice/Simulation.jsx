import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaceDetector, FilesetResolver } from '@mediapipe/tasks-vision';
import { Timer, Send, AlertCircle, CheckCircle, Sparkles, Mic, MicOff, Camera, Maximize, Play, Type, AlertTriangle } from 'lucide-react';


const Simulation = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { role, level, customQuestions } = location.state || {};

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

    const [faceWarning, setFaceWarning] = useState('');
    const [alertCount, setAlertCount] = useState(0); 
    const faceMeshRef = useRef(null);
    const lastViolationLogTimeRef = useRef(0);
    const alertTimeoutRef = useRef(null);
    const previousStatusRef = useRef('Face detected');
    const [faceStatus, setFaceStatus] = useState('Face detected');





    // Camera Visibility Fix
    useEffect(() => {
        if (videoRef.current && cameraStream) {
            videoRef.current.srcObject = cameraStream;
        }
    }, [cameraStream, loading, showStartOverlay, startCount]);


    // Initialize Face Mesh
    useEffect(() => {
        if (loading || !videoRef.current) return;

        const initFaceMesh = async () => {
            if (typeof window.FaceMesh === 'undefined') {
                console.error("FaceMesh not loaded from CDN");
                return;
            }

            const faceMesh = new window.FaceMesh({
                locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`
            });

            faceMesh.setOptions({
                maxNumFaces: 4, // More accurate detection for multiple people
                refineLandmarks: true,
                minDetectionConfidence: 0.6, // Higher confidence for exam accuracy
                minTrackingConfidence: 0.6
            });


            faceMesh.onResults((results) => {
                // Proctoring results should always be processed once the simulation state is active
                // so the user sees real-time status even during start overlay
                processProctoringResults(results);
            });

            faceMeshRef.current = faceMesh;

            const camera = new window.Camera(videoRef.current, {
                onFrame: async () => {
                    if (faceMeshRef.current) {
                        try {
                            await faceMeshRef.current.send({ image: videoRef.current });
                        } catch (e) {
                            // Suppress frame drop errors
                        }
                    }
                },
                width: 640,
                height: 480
            });
            camera.start();
        };

        initFaceMesh();

        return () => {
            if (faceMeshRef.current) {
                faceMeshRef.current.close();
            }
        };
    }, [loading]);

    const processProctoringResults = (results) => {
        const faceLandmarks = results.multiFaceLandmarks;
        const now = Date.now();
        let currentWarning = '';
        let currentStatus = 'Face detected';

        // 1. Check Presence & Multiple People
        if (!faceLandmarks || faceLandmarks.length === 0) {
            currentStatus = 'No face detected';
            currentWarning = '⚠️ Face not detected. Please stay in front of the camera.';
            updateViolation('noFace');
        } else if (faceLandmarks.length > 1) {
            currentStatus = 'Multiple faces detected';
            currentWarning = '⚠️ ERROR: Only one person should be in the interview.';
            updateViolation('multipleFaces');
        } else {
            // Analyze Single Face (Most accurate landmark analysis)
            const landmarks = faceLandmarks[0];
            
            // 2. Check Looking Away (Yaw heuristic: nose should be centered between eyes)
            const noseX = landmarks[1].x;
            const leftEyeX = landmarks[33].x;
            const rightEyeX = landmarks[263].x;
            const eyeWidth = rightEyeX - leftEyeX;
            const noseRelative = (noseX - leftEyeX) / eyeWidth;
            
            // Strict gaze tracking: Ensure the candidate is looking at the screen
            if (noseRelative < 0.32 || noseRelative > 0.68) {
                currentStatus = 'Looking away';
                currentWarning = '⚠️ Please look at the screen. You are being monitored.';
                updateViolation('lookingAway');
            }

            // 3. Distance Check (Z-axis scale)
            const faceBounds = {
                minX: Math.min(...landmarks.map(l => l.x)),
                maxX: Math.max(...landmarks.map(l => l.x))
            };
            const faceWidth = faceBounds.maxX - faceBounds.minX;
            if (faceWidth > 0.55) {
                currentStatus = 'Too close';
                currentWarning = '⚠️ Please sit back slightly from the camera.';
            }
        }


        // Handle Alert Visibility & Resolution
        if (currentStatus !== 'Face detected') {
            setFaceWarning(currentWarning);
            if (alertTimeoutRef.current) clearTimeout(alertTimeoutRef.current);
        } else {
            // Transition from error back to normal: Clear message and show success
            if (faceWarning && !faceWarning.includes('✅')) {
                setFaceWarning(`✅ Behavior Corrected (${alertCount}/3)`);
                if (alertTimeoutRef.current) clearTimeout(alertTimeoutRef.current);
                alertTimeoutRef.current = setTimeout(() => {
                    setFaceWarning('');
                }, 2000); 
            }
        }

        
        previousStatusRef.current = currentStatus;

        // Force Focus Mode Warning if needed
        if (!isFullScreen && !showStartOverlay && (startCount === 0 || startCount === null)) {
             setFaceStatus('Focus Mode Lost');
             setFaceWarning('SECURITY ALERT: PLEASE RE-ENTER FULL SCREEN MODE!');
        } else {
             setFaceStatus(currentStatus);
        }
    };

    const updateViolation = (type) => {
        const now = Date.now();
        // Cooldown to prevent spamming warnings but still logging them properly
        if (now - lastViolationLogTimeRef.current < 4000) return;
        lastViolationLogTimeRef.current = now;

        setAlertCount(prev => {
            const next = prev + 1;
            logViolation(type, `Violation: ${type} (Alert ${next}/3)`);
            return next;
        });
    };



    useEffect(() => {
        if (alertCount >= 3) {
            handleTerminateSession("❌ Exam terminated due to repeated violations.");
        }
    }, [alertCount]);

    const logViolation = async (type, desc) => {
        const storedUser = JSON.parse(localStorage.getItem('ai_coach_user') || '{}');
        const token = storedUser.token;
        if (!token || !sessionId) return;

        try {
            await fetch('http://localhost:5000/api/practice/proctoring-log', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ sessionId, violationType: type, description: desc })
            });
        } catch (err) {
            console.error("Logging failed:", err);
        }
    };

    const handleTerminateSession = async (reason) => {
        const storedUser = JSON.parse(localStorage.getItem('ai_coach_user') || '{}');
        const token = storedUser.token;
        if (!token || !sessionId) return;

        try {
            await fetch('http://localhost:5000/api/practice/terminate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ sessionId, reason })
            });

            // Save results before redirecting
            await handleSubmitTest();
            alert(`EXAM TERMINATED: ${reason}`);
            navigate('/practice/history'); // Or results
        } catch (err) {
            console.error("Termination failed:", err);
        }
    };

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
                    body: JSON.stringify({ role, level, customQuestions })
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

    // Note: Redundant FaceDetector system removed for performance and accuracy consolidation into FaceMesh

    useEffect(() => {
        if (loading || showStartOverlay || startCount !== 0) return;



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
            const isFull = !!(document.fullscreenElement || 
                             document.webkitFullscreenElement || 
                             document.mozFullScreenElement || 
                             document.msFullscreenElement);
            setIsFullScreen(isFull);
        };

        const handleKeyDown = (e) => {
            if (e.key === 'Escape' && document.fullscreenElement) {
                // Browser handles exiting fullscreen on Esc, 
                // but we can add additional logic here if needed.
                console.log('User pressed Esc to exit fullscreen');
            }
        };

        const handleTabSwitch = () => {
            if (document.hidden && !showStartOverlay && startCount === 0) {
                console.warn("User left the simulation focus!");
                // Optionally alert or log this in the database
            }
        };

        const handleFocusLoss = () => {
            if (!document.hasFocus() && !showStartOverlay && startCount === 0) {
                console.warn("User lost focus on simulation window!");
            }
        };

        const handleBeforeUnload = (e) => {
            if (!showStartOverlay && startCount === 0) {
                e.preventDefault();
                e.returnValue = ''; // Shows standard browser prompt
            }
        };

        document.addEventListener('fullscreenchange', handleFullscreenChange);
        document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
        document.addEventListener('mozfullscreenchange', handleFullscreenChange);
        document.addEventListener('MSFullscreenChange', handleFullscreenChange);
        document.addEventListener('keydown', handleKeyDown);
        document.addEventListener("visibilitychange", handleTabSwitch);
        window.addEventListener("blur", handleFocusLoss);
        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            document.removeEventListener('fullscreenchange', handleFullscreenChange);
            document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
            document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
            document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
            document.removeEventListener('keydown', handleKeyDown);
            document.removeEventListener("visibilitychange", handleTabSwitch);
            window.removeEventListener("blur", handleFocusLoss);
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [showStartOverlay, startCount]);

    // Full Screen Logic
    const enterFullScreen = async () => {
        const elem = document.documentElement;
        try {
            if (elem.requestFullscreen) {
                await elem.requestFullscreen();
            } else if (elem.webkitRequestFullscreen) {
                await elem.webkitRequestFullscreen();
            } else if (elem.mozRequestFullScreen) {
                await elem.mozRequestFullScreen();
            } else if (elem.msRequestFullscreen) {
                await elem.msRequestFullscreen();
            }
        } catch (error) {
            console.error("Focus Mode Error:", error);
            // Non-critical: sometimes browser blocks it if it feels gesture was delayed
        }
    };

    const exitFullScreen = async () => {
        try {
            if (document.fullscreenElement) {
                if (document.exitFullscreen) {
                    await document.exitFullscreen();
                } else if (document.webkitExitFullscreen) {
                    await document.webkitExitFullscreen();
                } else if (document.mozCancelFullScreen) {
                    await document.mozCancelFullScreen();
                } else if (document.msExitFullscreen) {
                    await document.msExitFullscreen();
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

                    <h2 className="text-3xl font-bold mb-4 text-white">Ready to start?</h2>
                    <p className="text-slate-400 mb-2 leading-relaxed">
                        This session will be recorded. Please ensure you are in a quiet environment.
                    </p>
                    <p className="text-amber-400 text-xs font-bold uppercase tracking-widest mb-8">
                        AI Proctoring Active: Stay in front of camera & switch to Full Screen
                    </p>

                    {/* Show live proctoring status in overlay so user knows it's working */}
                    <div className="flex flex-col items-center gap-2 mb-6 pointer-events-none select-none">
                        <div className={`px-4 py-1.5 rounded-xl backdrop-blur-md border-2 flex items-center gap-3 transition-all duration-300 shadow-lg ${faceStatus === 'Face detected' ? 'bg-slate-900/80 border-emerald-500/30 text-emerald-400' : 'bg-red-950/90 border-red-500/50 text-red-100 scale-105'}`}>
                            <div className="flex items-center gap-2">
                                <div className={`w-2 h-2 rounded-full ${faceStatus === 'Face detected' ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.7)]' : 'bg-red-500 shadow-[0_0_15px_rgba(239,68,68,1)] animate-ping'}`}></div>
                                <span className="text-[10px] font-black uppercase tracking-[0.2em]">{faceStatus}</span>
                            </div>
                            <div className="h-3 w-[1px] bg-white/10"></div>
                            <div className="text-[10px] font-bold">
                                WARNINGS: {alertCount}/3
                            </div>
                        </div>
                        {faceWarning && (
                            <div className={`${faceWarning.includes('✅') ? 'text-emerald-400' : 'text-red-400'} text-[10px] font-black uppercase tracking-wider animate-pulse`}>
                                {faceWarning}
                            </div>
                        )}
                    </div>

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
        <div className="min-h-screen bg-slate-900 text-white font-sans relative">
            
                    {/* Enhanced Proctoring HUD */}
                    {!showStartOverlay && (
                        <div className="fixed top-6 left-6 z-[100] flex flex-col gap-3 pointer-events-none select-none">
                            <div className={`px-5 py-2.5 rounded-2xl backdrop-blur-2xl border-2 flex items-center gap-4 transition-all duration-500 shadow-2xl ${faceStatus === 'Face detected' ? 'bg-slate-900/80 border-emerald-500/30 text-emerald-400' : 'bg-red-950/90 border-red-500/50 text-red-100 scale-110'}`}>
                                <div className="flex items-center gap-2">
                                    <div className={`w-3 h-3 rounded-full ${faceStatus === 'Face detected' ? 'bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.7)]' : 'bg-red-500 shadow-[0_0_20px_rgba(239,68,68,1)] animate-ping'}`}></div>
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">{faceStatus}</span>
                                </div>
                                
                                <div className="h-4 w-[1px] bg-white/10"></div>
                                
                                <div className={`flex items-center gap-2 px-3 py-1 rounded-lg ${alertCount > 0 ? 'bg-red-500 text-white font-black' : 'bg-white/5 text-slate-400 font-bold'} text-[10px] transition-all`}>
                                    WARNINGS: <span className="text-xs">{alertCount}/3</span>
                                </div>
                            </div>
                            
                            {faceWarning && (
                                <div className={`${faceWarning.includes('✅') ? 'bg-emerald-600/90 shadow-[0_15px_40px_rgba(16,185,129,0.4)]' : 'bg-red-600/90 shadow-[0_15px_40px_rgba(239,68,68,0.4)]'} text-white px-6 py-4 rounded-3xl text-sm font-black uppercase tracking-wider flex items-center justify-between gap-4 animate-pulse border-2 border-white/20 min-w-[350px]`}>
                                    <div className="flex items-center gap-4">
                                        <AlertCircle size={24} className="flex-shrink-0" /> 
                                        <span>{faceWarning}</span>
                                    </div>
                                    {!faceWarning.includes('✅') && alertCount > 0 && (
                                        <div className="bg-white/20 px-3 py-1 rounded-xl text-xs">
                                            {alertCount} / 3
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )}

            {/* Camera Overlay */}
            <div className="fixed bottom-6 right-6 z-50 w-64 h-48 bg-slate-800 rounded-3xl border-2 border-indigo-500/50 overflow-hidden shadow-2xl transition-all hover:scale-105 group">
                <video ref={videoRef} autoPlay muted playsInline className="w-full h-full object-cover" />
                <div className="absolute top-2 left-2 px-2 py-0.5 bg-red-600 text-[10px] font-bold rounded flex items-center gap-1">
                    <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                    LIVE Recording
                </div>
            </div>

            {/* Focus Mode Lock Overlay (Blur everything if not in fullscreen) */}
            {!isFullScreen && !showStartOverlay && startCount === 0 && (
                <div className="fixed inset-0 z-[100] bg-slate-950/90 backdrop-blur-xl flex items-center justify-center p-6 text-center animate-in fade-in duration-500">
                    <div className="max-w-md w-full bg-slate-900 border border-amber-500/30 rounded-3xl p-10 shadow-2xl shadow-amber-500/10">
                        <div className="w-20 h-20 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-amber-500/20">
                            <Maximize size={40} className="text-amber-500 animate-pulse" />
                        </div>
                        <h2 className="text-2xl font-bold mb-4 text-white">Focus Mode Required</h2>
                        <p className="text-slate-400 mb-8 leading-relaxed">
                            To maintain interview integrity, this session must be completed in full screen. Please re-enter focus mode to continue.
                        </p>
                        <button
                            onClick={enterFullScreen}
                            className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 py-4 rounded-xl font-bold text-lg transition-all shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 group"
                        >
                            <Maximize size={20} className="group-hover:scale-110 transition-transform" />
                            Re-enter Focus Mode
                        </button>
                    </div>
                </div>
            )}

            <div className={`pt-20 ${!isFullScreen && !showStartOverlay && startCount === 0 ? 'blur-md pointer-events-none' : ''}`}> {/* Offset for Fixed Navbar */}
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
                                    placeholder={questions[currentQuestionIndex]?.category === 'Coding' ? "Write your code here..." : "Write your answer here..."}
                                    className={`relative w-full h-64 bg-slate-900 border border-slate-700 rounded-2xl p-6 text-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500/50 transition-all resize-none ${questions[currentQuestionIndex]?.category === 'Coding' ? 'font-mono' : ''}`}
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
