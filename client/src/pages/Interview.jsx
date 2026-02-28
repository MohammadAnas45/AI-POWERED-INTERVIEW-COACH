import React, { useState, useRef, useEffect } from 'react';
import { Bot, User, Mic, Send, ShieldAlert, Sparkles, ChevronRight, Code2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Interview = () => {
    const { user } = useAuth();
    const [messages, setMessages] = useState([
        {
            id: 1,
            sender: 'ai',
            text: `Hello ${user?.fullName.split(' ')[0]}! I'm your AI Interview Coach. I'm ready to help you practice. To begin, please select a topic or just say 'I'm ready'!`
        },
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = () => {
        if (!input.trim()) return;

        // Add user message
        const userMsg = { id: Date.now(), sender: 'user', text: input };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsTyping(true);

        // Simulate AI response
        setTimeout(() => {
            const aiResponse = generateResponse(input);
            setMessages(prev => [...prev, { id: Date.now() + 1, sender: 'ai', text: aiResponse }]);
            setIsTyping(false);
        }, 1500);
    };

    const generateResponse = (userInput) => {
        const lower = userInput.toLowerCase();
        if (lower.includes('ready')) return "Great! Let's start with a classic. Can you explain the difference between `var`, `let`, and `const` in JavaScript?";
        if (lower.includes('var') || lower.includes('let')) return "That's a solid start. `var` is function-scoped while `let` and `const` are block-scoped. Can you give me an example of when you'd choose `const` over `let`?";
        if (lower.includes('react')) return "React is powerful! What is your favorite feature of React Hooks, and why?";
        return "Interesting point. Could you elaborate on that in the context of system design or scalability?";
    };

    const topicSuggestions = [
        { title: "Frontend Basics", desc: "HTML/CSS/JS fundamentals" },
        { title: "React Deep Dive", desc: "Hooks, patterns, performance" },
        { title: "System Design", desc: "Scalability, architecture" },
    ];

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500/30 flex flex-col">


            <main className="flex-1 pt-20 pb-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-80px)]">

                {/* Sidebar / Context Panel */}
                <div className="hidden lg:flex flex-col gap-6 col-span-1 h-full overflow-y-auto pr-2 custom-scrollbar">
                    {/* AI Status Card */}
                    <div className="bg-slate-900 border border-slate-700/50 rounded-2xl p-6">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                                <Bot className="w-7 h-7 text-white" />
                            </div>
                            <div>
                                <h3 className="font-bold text-white">Coach AI</h3>
                                <div className="flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                    <span className="text-xs text-emerald-400 font-medium">Online & Ready</span>
                                </div>
                            </div>
                        </div>
                        <p className="text-sm text-slate-400 leading-relaxed">
                            I specialize in Frontend Systems, React Architecture, and Behavioral questions. Let's get you hired!
                        </p>
                    </div>

                    {/* Topic Selector */}
                    <div className="space-y-3">
                        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Suggested Topics</h4>
                        {topicSuggestions.map((topic, idx) => (
                            <button
                                key={idx}
                                onClick={() => setInput(`Let's practice ${topic.title}`)}
                                className="w-full text-left p-4 rounded-xl bg-slate-800/40 border border-slate-700/50 hover:bg-slate-800 hover:border-indigo-500/30 transition-all group"
                            >
                                <div className="flex items-center justify-between mb-1">
                                    <span className="font-semibold text-slate-200 group-hover:text-indigo-300 transition-colors">{topic.title}</span>
                                    <ChevronRight size={14} className="text-slate-600 group-hover:text-indigo-400 group-hover:translate-x-1 transition-transform" />
                                </div>
                                <p className="text-xs text-slate-500">{topic.desc}</p>
                            </button>
                        ))}
                    </div>

                    {/* Stats / Progress */}
                    <div className="bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700/50 rounded-2xl p-6 mt-auto">
                        <div className="flex items-center gap-3 mb-3">
                            <ShieldAlert className="w-5 h-5 text-amber-400" />
                            <h4 className="font-bold text-white text-sm">Feedback Mode</h4>
                        </div>
                        <p className="text-xs text-slate-400 mb-4">
                            I'm analyzing your responses for clarity, technical accuracy, and structure.
                        </p>
                        <div className="w-full h-1.5 bg-slate-700 rounded-full overflow-hidden">
                            <div className="h-full bg-amber-400 w-3/4" />
                        </div>
                        <div className="flex justify-between mt-2 text-[10px] text-slate-500 font-mono">
                            <span>ACCURACY</span>
                            <span>75%</span>
                        </div>
                    </div>
                </div>

                {/* Chat Interface */}
                <div className="col-span-1 lg:col-span-3 bg-slate-900/50 border border-slate-800 rounded-2xl flex flex-col h-full relative overflow-hidden backdrop-blur-sm shadow-2xl">

                    {/* Header (Mobile only) */}
                    <div className="lg:hidden p-4 border-b border-white/5 flex items-center justify-between bg-slate-900/80 backdrop-blur-md sticky top-0 z-10">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center">
                                <Bot className="w-4 h-4 text-white" />
                            </div>
                            <span className="font-bold text-white">Coach AI</span>
                        </div>
                        <span className="text-xs px-2 py-1 bg-emerald-500/10 text-emerald-400 rounded-full border border-emerald-500/20">Online</span>
                    </div>

                    {/* Messages Area */}
                    <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 scroll-smooth custom-scrollbar">
                        {messages.map((msg) => (
                            <div
                                key={msg.id}
                                className={`flex gap-4 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}
                            >
                                {/* Avatar */}
                                <div className={`
                  w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center
                  ${msg.sender === 'ai'
                                        ? 'bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 shadow-lg shadow-purple-500/20'
                                        : 'bg-slate-700 border border-slate-600'
                                    }
                `}>
                                    {msg.sender === 'ai' ? <Bot size={20} className="text-white" /> : <User size={20} className="text-slate-300" />}
                                </div>

                                {/* Bubble */}
                                <div className={`
                  relative max-w-[85%] sm:max-w-[75%] p-4 rounded-2xl text-sm sm:text-base leading-relaxed shadow-sm
                  ${msg.sender === 'ai'
                                        ? 'bg-slate-800 text-slate-100 rounded-tl-none border border-slate-700/50'
                                        : 'bg-indigo-600 text-white rounded-tr-none shadow-indigo-500/10'
                                    }
                `}>
                                    {msg.text}
                                    {msg.sender === 'ai' && (
                                        <div className="absolute -bottom-5 left-0 flex items-center gap-2 opacity-0 hover:opacity-100 transition-opacity">
                                            {/* Interaction buttons for AI messages could reflect here */}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}

                        {isTyping && (
                            <div className="flex gap-4">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                                    <Bot size={20} className="text-white" />
                                </div>
                                <div className="bg-slate-800 p-4 rounded-2xl rounded-tl-none border border-slate-700/50 flex items-center gap-1.5 h-12 w-24">
                                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="p-4 bg-slate-900 border-t border-white/5">
                        <div className="relative max-w-4xl mx-auto flex items-end gap-2 bg-slate-800/50 border border-slate-700 rounded-xl p-2 focus-within:border-indigo-500/50 focus-within:bg-slate-800 transition-all shadow-inner">
                            <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors" title="Record Voice">
                                <Mic size={20} />
                            </button>

                            <textarea
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        handleSend();
                                    }
                                }}
                                placeholder="Type your answer here..."
                                className="flex-1 bg-transparent border-none focus:ring-0 text-white placeholder-slate-500 resize-none max-h-32 py-2.5 custom-scrollbar"
                                rows={1}
                                style={{ minHeight: '44px' }}
                            />

                            <button
                                onClick={handleSend}
                                disabled={!input.trim() && !isTyping}
                                className={`
                  p-2 rounded-lg transition-all duration-200 flex items-center justify-center
                  ${input.trim()
                                        ? 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-lg shadow-indigo-600/20 transform hover:scale-105'
                                        : 'bg-slate-700 text-slate-500 cursor-not-allowed'
                                    }
                `}
                            >
                                <Send size={18} className={input.trim() ? 'ml-0.5' : ''} />
                            </button>
                        </div>
                        <div className="text-center mt-2">
                            <p className="text-[10px] text-slate-600 flex items-center justify-center gap-1.5">
                                <Sparkles size={10} className="text-indigo-400" />
                                AI can make mistakes. Consider checking important information.
                            </p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Interview;
