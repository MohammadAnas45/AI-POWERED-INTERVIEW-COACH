import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Bot, Mail, Lock, Eye, EyeOff, ArrowRight, Github, Chrome, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';

const Login = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const from = location.state?.from?.pathname || '/dashboard';

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            await login(formData.email, formData.password, rememberMe);
            setIsSuccess(true);
            setTimeout(() => {
                navigate(from, { replace: true });
            }, 1000);
        } catch (err) {
            setError(err.message || 'Something went wrong. Please try again.');
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500/30 flex flex-col">


            <main className="flex-grow flex items-center justify-center px-4 py-24 relative overflow-hidden">
                {/* Background Blobs */}
                <div className="absolute top-1/4 -left-20 w-80 h-80 bg-indigo-600/20 rounded-full blur-[100px] -z-10 animate-pulse" />
                <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-purple-600/20 rounded-full blur-[100px] -z-10 animate-pulse delay-700" />

                <div className="w-full max-w-md">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="inline-flex p-3 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-xl shadow-indigo-500/20 mb-4 animate-float">
                            <Bot className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
                        <p className="text-slate-400">Enter your credentials to access your AI coach</p>
                    </div>

                    {/* Form Card */}
                    <div className="bg-slate-900/40 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl relative overflow-hidden">
                        {isSuccess && (
                            <div className="absolute inset-0 bg-slate-900/90 backdrop-blur-md z-50 flex flex-col items-center justify-center animate-fade-in">
                                <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center mb-4 shadow-lg shadow-emerald-500/20">
                                    <CheckCircle2 className="w-8 h-8 text-white" />
                                </div>
                                <h3 className="text-xl font-bold text-white">Login Successful!</h3>
                                <p className="text-slate-400">Redirecting to workspace...</p>
                            </div>
                        )}

                        {error && (
                            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-3 animate-shake">
                                <AlertCircle size={18} />
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-300 ml-1">Email Address</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-indigo-400 transition-colors">
                                        <Mail size={18} />
                                    </div>
                                    <input
                                        type="email"
                                        required
                                        disabled={isLoading}
                                        className="w-full bg-slate-950/50 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                        placeholder="name@example.com"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between items-center ml-1">
                                    <label className="text-sm font-medium text-slate-300">Password</label>
                                    <a href="#" className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors font-medium">Forgot Password?</a>
                                </div>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-indigo-400 transition-colors">
                                        <Lock size={18} />
                                    </div>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        required
                                        disabled={isLoading}
                                        className="w-full bg-slate-950/50 border border-white/10 rounded-xl py-3 pl-11 pr-12 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                        placeholder="••••••••"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    />
                                    <button
                                        type="button"
                                        disabled={isLoading}
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-500 hover:text-slate-300 transition-colors"
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 ml-1">
                                <input
                                    type="checkbox"
                                    id="remember"
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                    className="w-4 h-4 rounded border-white/10 bg-slate-950 text-indigo-600 focus:ring-indigo-500 focus:ring-offset-slate-950 cursor-pointer"
                                />
                                <label htmlFor="remember" className="text-sm text-slate-400 cursor-pointer select-none">Remember me for 30 days</label>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2 group disabled:opacity-70 disabled:hover:bg-indigo-600 active:scale-[0.98]"
                            >
                                {isLoading ? (
                                    <Loader2 size={20} className="animate-spin" />
                                ) : (
                                    <>
                                        Sign In
                                        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </button>
                        </form>

                        {/* Divider */}
                        <div className="my-8 flex items-center gap-4">
                            <div className="h-px flex-grow bg-white/5" />
                            <span className="text-xs text-slate-500 uppercase tracking-widest font-bold">Or continue with</span>
                            <div className="h-px flex-grow bg-white/5" />
                        </div>

                        {/* Social Logins */}
                        <div className="grid grid-cols-2 gap-4">
                            <button disabled={isLoading} className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-sm font-medium disabled:opacity-50">
                                <Chrome size={18} />
                                Google
                            </button>
                            <button disabled={isLoading} className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-sm font-medium disabled:opacity-50">
                                <Github size={18} />
                                GitHub
                            </button>
                        </div>
                    </div>

                    {/* Footer Link */}
                    <p className="text-center mt-8 text-slate-400">
                        Don't have an account?{' '}
                        <Link to="/register" className="text-indigo-400 hover:text-indigo-300 font-bold transition-colors">
                            Create for free
                        </Link>
                    </p>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default Login;
