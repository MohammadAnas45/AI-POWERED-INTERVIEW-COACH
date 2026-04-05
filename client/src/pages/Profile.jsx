import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Footer from '../components/Footer';
import { User, Mail, Shield, Save, Loader2, CheckCircle2, AlertCircle, Briefcase, GraduationCap, Sparkles, Target } from 'lucide-react';

const Profile = () => {
    const { user, updateProfile } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const [formData, setFormData] = useState({
        fullName: user?.fullName || user?.full_name || '',
        email: user?.email || '',
        professionalRole: user?.professional_role || '',
        experienceLevel: user?.experience_level || '',
        skills: user?.skills || '',
        phone: user?.phone || '',
        location: user?.location || '',
        github_url: user?.github_url || '',
        linkedin_url: user?.linkedin_url || '',
        jobType: user?.job_type || ''
    });

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setSuccessMsg('');
        setErrorMsg('');

        try {
            await updateProfile(formData.fullName, formData.email, {
                professionalRole: formData.professionalRole,
                experienceLevel: formData.experienceLevel,
                skills: formData.skills,
                phone: formData.phone,
                location: formData.location,
                github_url: formData.github_url,
                linkedin_url: formData.linkedin_url,
                job_type: formData.jobType
            });
            setSuccessMsg('Profile updated successfully!');
        } catch (err) {
            setErrorMsg(err.message || 'Failed to update profile');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col">
            <main className="flex-grow pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-2xl mx-auto w-full">
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

                    <div className="bg-slate-900/40 border border-white/10 rounded-3xl p-8">
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

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-400 ml-1">Professional Role</label>
                                    <div className="relative">
                                        <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                        <select
                                            className="w-full bg-slate-950/50 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all appearance-none"
                                            value={formData.professionalRole}
                                            onChange={(e) => setFormData({ ...formData, professionalRole: e.target.value })}
                                        >
                                            <option value="">Select Role</option>
                                            <option value="Software Engineer">Software Engineer</option>
                                            <option value="Frontend Developer">Frontend Developer</option>
                                            <option value="Backend Developer">Backend Developer</option>
                                            <option value="Full Stack Developer">Full Stack Developer</option>
                                            <option value="Mobile App Developer">Mobile App Developer</option>
                                            <option value="Data Scientist">Data Scientist</option>
                                            <option value="Machine Learning Engineer">Machine Learning Engineer</option>
                                            <option value="DevOps Engineer">DevOps Engineer</option>
                                            <option value="Cyber Security Engineer">Cyber Security Engineer</option>
                                            <option value="UI/UX Designer">UI/UX Designer</option>
                                            <option value="Product Manager">Product Manager</option>
                                            <option value="QA/Testing Engineer">QA/Testing Engineer</option>
                                            <option value="Cloud Architect">Cloud Architect</option>
                                            <option value="System Administrator">System Administrator</option>
                                            <option value="Database Administrator">Database Administrator</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-400 ml-1">Experience Level</label>
                                    <div className="relative">
                                        <GraduationCap className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                        <select
                                            className="w-full bg-slate-950/50 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all appearance-none"
                                            value={formData.experienceLevel}
                                            onChange={(e) => setFormData({ ...formData, experienceLevel: e.target.value })}
                                        >
                                            <option value="">Select Level</option>
                                            <option value="intern">Intern / Student</option>
                                            <option value="entry">Entry Level (0-2 years)</option>
                                            <option value="mid">Mid Level (2-5 years)</option>
                                            <option value="senior">Senior Level (5+ years)</option>
                                            <option value="lead">Lead / Manager</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-400 ml-1">Phone Number</label>
                                    <div className="relative">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-xs font-bold">TEL</div>
                                        <input
                                            type="text"
                                            placeholder="+1 (555) 000-0000"
                                            className="w-full bg-slate-950/50 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-400 ml-1">Location</label>
                                    <div className="relative">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-xs font-bold">LOC</div>
                                        <input
                                            type="text"
                                            placeholder="City, Country"
                                            className="w-full bg-slate-950/50 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                                            value={formData.location}
                                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-400 ml-1">Key Skills</label>
                                    <div className="relative">
                                        <Sparkles className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                        <input
                                            type="text"
                                            placeholder="e.g. React, Node.js, Python, System Design"
                                            className="w-full bg-slate-950/50 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                                            value={formData.skills}
                                            onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-400 ml-1">Preferred Job Type</label>
                                    <div className="relative">
                                        <Target className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                        <select
                                            className="w-full bg-slate-950/50 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all appearance-none"
                                            value={formData.jobType}
                                            onChange={(e) => setFormData({ ...formData, jobType: e.target.value })}
                                        >
                                            <option value="">Select Type</option>
                                            <option value="Remote">Remote</option>
                                            <option value="Onsite">Onsite</option>
                                            <option value="Hybrid">Hybrid</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4 pt-2 border-t border-white/5">
                                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Social Profiles</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="relative">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-xs font-bold">GH</div>
                                        <input
                                            type="text"
                                            placeholder="GitHub URL"
                                            className="w-full bg-slate-950/50 border border-white/10 rounded-xl py-2 pl-12 pr-4 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                                            value={formData.github_url}
                                            onChange={(e) => setFormData({ ...formData, github_url: e.target.value })}
                                        />
                                    </div>
                                    <div className="relative">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-xs font-bold">LI</div>
                                        <input
                                            type="text"
                                            placeholder="LinkedIn URL"
                                            className="w-full bg-slate-950/50 border border-white/10 rounded-xl py-2 pl-12 pr-4 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                                            value={formData.linkedin_url}
                                            onChange={(e) => setFormData({ ...formData, linkedin_url: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition-all disabled:opacity-50"
                            >
                                {isLoading ? <Loader2 size={18} className="animate-spin" /> : <><Save size={18} /> Save Changes</>}
                            </button>
                        </form>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default Profile;
