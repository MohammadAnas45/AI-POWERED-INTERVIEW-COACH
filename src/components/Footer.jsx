import React from 'react';
import { Github, Twitter, Linkedin, Heart } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-slate-950 border-t border-slate-800 text-slate-400 py-12">
            <div className="max-w-7xl mx-auto px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-8">

                <div className="flex flex-col items-center md:items-start gap-4">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-lg">AI</span>
                        </div>
                        <span className="font-bold text-white text-xl">Interview Coach</span>
                    </div>
                    <p className="text-sm max-w-xs text-center md:text-left">
                        Empowering developers to ace technical interviews with intelligent practice and real-time feedback.
                    </p>
                </div>

                <div className="flex gap-6">
                    <a href="#" className="hover:text-white transition-colors"><Github size={20} /></a>
                    <a href="#" className="hover:text-white transition-colors"><Twitter size={20} /></a>
                    <a href="#" className="hover:text-white transition-colors"><Linkedin size={20} /></a>
                </div>

                <div className="text-sm text-center md:text-right">
                    <p className="mb-2">© {new Date().getFullYear()} AI Interview Coach. All rights reserved.</p>
                    <p className="flex items-center justify-center md:justify-end gap-1 text-slate-500">
                        Built with <Heart size={14} className="text-red-500 fill-red-500 animate-pulse" /> using React & Tailwind
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
