import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Footer from '../components/Footer';
import { User, Mail, Shield, FileText, Upload, Save, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

const Profile = () => {
    const { user, updateProfile, uploadResume } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const [formData, setFormData] = useState({
        fullName: user?.fullName || '',
        email: user?.email || ''
    });
    const [resumeFile, setResumeFile] = useState(null);

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setSuccessMsg('');
        setErrorMsg('');

        try {
            await updateProfile(formData.fullName, formData.email);
            setSuccessMsg('Profile updated successfully!');
        } catch (err) {
            setErrorMsg(err.message || 'Failed to update profile');
        } finally {
            setIsLoading(false);
        }
    };

    const handleResumeUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (file.type !== 'application/pdf') {
            setErrorMsg('Please upload only PDF files');
            return;
        }

        setIsLoading(true);
        setSuccessMsg('');
        setErrorMsg('');

        try {
            await uploadResume(file);
            setSuccessMsg('Resume uploaded successfully!');
            setResumeFile(file.name);
        } catch (err) {
            setErrorMsg(err.message || 'Failed to upload resume');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col">


            <main className="flex-grow pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full">
                <div className="space-y-8">
                    <div className="flex items-center gap-4 border-b border-white/10 pb-6">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                            <User size={32} className="text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-white">Profile Settings</h1>
                            <p className="text-slate-400">Manage your account information and preferences</p>
                        </div>
                    </div>

                    {successMsg && (
                        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center gap-3">
                            <CheckCircle2 size={18} /> {successMsg}
                        </div>
                    )}

                    {errorMsg && (
                        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center gap-3">
                            <AlertCircle size={18} /> {errorMsg}
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Account Info */}
                        <div className="md:col-span-2 bg-slate-900/40 border border-white/10 rounded-3xl p-8">
                            <form onSubmit={handleUpdateProfile} className="space-y-6">
                                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                    <Shield size={20} className="text-indigo-400" /> General Information
                                </h3>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-400 ml-1">Full Name</label>
                                    <div className="relative">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                        <input
                                            type="text"
                                            className="w-full bg-slate-950/50 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                                            value={formData.fullName}
                                            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-400 ml-1">Email Address</label>
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                        <input
                                            type="email"
                                            className="w-full bg-slate-950/50 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="flex items-center justify-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition-all disabled:opacity-50"
                                >
                                    {isLoading ? <Loader2 size={18} className="animate-spin" /> : <><Save size={18} /> Save Changes</>}
                                </button>
                            </form>
                        </div>

                        {/* Resume Management */}
                        <div className="bg-slate-900/40 border border-white/10 rounded-3xl p-8">
                            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                                <FileText size={20} className="text-indigo-400" /> Resume / CV
                            </h3>
                            <div className="space-y-4">
                                <p className="text-sm text-slate-400">Upload your resume for AI analysis and personalized questions.</p>

                                <div className="border-2 border-dashed border-white/10 rounded-2xl p-6 text-center hover:border-indigo-500/50 transition-all bg-slate-950/30">
                                    <Upload className="mx-auto text-slate-500 mb-2" size={32} />
                                    <label className="mt-2 block text-sm font-bold text-indigo-400 cursor-pointer hover:text-indigo-300">
                                        Click to upload
                                        <input type="file" className="hidden" accept=".pdf" onChange={handleResumeUpload} />
                                    </label>
                                    <p className="text-[10px] text-slate-500 mt-2 uppercase">PDF only (Max 5MB)</p>
                                </div>

                                {user?.resume_path && (
                                    <div className="flex items-center gap-2 p-3 bg-white/5 rounded-xl border border-white/10 overflow-hidden">
                                        <FileText size={16} className="text-emerald-400 flex-shrink-0" />
                                        <span className="text-xs text-slate-300 truncate">Resume Uploaded</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default Profile;
