import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Footer from '../components/Footer';
import { User, Mail, Shield, FileText, Upload, Save, Loader2, CheckCircle2, AlertCircle, Briefcase, GraduationCap, Sparkles, Target } from 'lucide-react';
import { Link } from 'react-router-dom';

const Profile = () => {
    const { user, updateProfile, uploadResume } = useAuth();
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
    const [resumeFile, setResumeFile] = useState(null);

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
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2 p-3 bg-white/5 rounded-xl border border-white/10 overflow-hidden">
                                            <FileText size={16} className="text-emerald-400 flex-shrink-0" />
                                            <span className="text-xs text-slate-300 truncate">Resume Uploaded</span>
                                        </div>
                                        <Link 
                                            to="/practice/resume-analysis"
                                            className="w-full flex items-center justify-center gap-2 py-3 bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 rounded-xl text-sm font-bold hover:bg-indigo-600 hover:text-white transition-all"
                                        >
                                            <Sparkles size={16} /> Analyze Saved Resume
                                        </Link>
                                    </div>
                                )}

                                <div className="flex gap-2 pt-2">
                                    {user?.github_url && (
                                        <a href={user.github_url} target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center gap-2 p-3 bg-white/5 rounded-xl border border-white/10 text-xs text-slate-400 hover:text-white hover:bg-slate-800 transition-all group">
                                            <div className="p-1.5 bg-slate-950 rounded-lg group-hover:bg-slate-900">
                                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                                            </div>
                                            GitHub
                                        </a>
                                    )}
                                    {user?.linkedin_url && (
                                        <a href={user.linkedin_url} target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center gap-2 p-3 bg-white/5 rounded-xl border border-white/10 text-xs text-slate-400 hover:text-white hover:bg-slate-800 transition-all group">
                                            <div className="p-1.5 bg-slate-950 rounded-lg group-hover:bg-slate-900 text-[#0077b5]">
                                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                                            </div>
                                            LinkedIn
                                        </a>
                                    )}
                                </div>
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
