import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Briefcase, Code, Database, Shield, Users, Headset, FolderKanban } from 'lucide-react';

const RoleSelection = () => {
    const [roles, setRoles] = useState({ technical: [], nonTechnical: [] });
    const [selectedRole, setSelectedRole] = useState('');
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchRoles = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/practice/roles');
                const data = await response.json();
                setRoles(data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching roles:', error);
                setLoading(false);
            }
        };
        fetchRoles();
    }, []);

    const handleRoleSelect = (role) => {
        setSelectedRole(role);
    };

    const handleProceed = () => {
        if (selectedRole) {
            navigate('/practice/level', { state: { role: selectedRole } });
        }
    };

    const getIcon = (role) => {
        switch (role) {
            case 'Developer': return <Code className="w-6 h-6" />;
            case 'Software Engineer': return <Code className="w-6 h-6" />;
            case 'Data Analyst': return <Database className="w-6 h-6" />;
            case 'Cyber Security': return <Shield className="w-6 h-6" />;
            case 'HR': return <Users className="w-6 h-6" />;
            case 'Customer Support': return <Headset className="w-6 h-6" />;
            case 'Project Manager': return <FolderKanban className="w-6 h-6" />;
            default: return <Briefcase className="w-6 h-6" />;
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-900 text-white pt-24 pb-12 px-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">
                    Select Your Target Role
                </h1>

                <div className="grid md:grid-cols-2 gap-12">
                    {/* Technical Roles */}
                    <div>
                        <h2 className="text-xl font-semibold mb-6 flex items-center gap-2 text-blue-400">
                            <Code className="w-5 h-5" /> Technical Roles
                        </h2>
                        <div className="space-y-3">
                            {roles.technical.map((role) => (
                                <button
                                    key={role}
                                    onClick={() => handleRoleSelect(role)}
                                    className={`w-full p-4 rounded-xl flex items-center gap-4 transition-all duration-200 border ${selectedRole === role
                                        ? 'bg-blue-600/20 border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.3)]'
                                        : 'bg-slate-800/50 border-slate-700 hover:border-slate-500'
                                        }`}
                                >
                                    <div className={`${selectedRole === role ? 'text-blue-400' : 'text-slate-400'}`}>
                                        {getIcon(role)}
                                    </div>
                                    <span className="font-medium text-lg text-slate-200">{role}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Non-Technical Roles */}
                    <div>
                        <h2 className="text-xl font-semibold mb-6 flex items-center gap-2 text-indigo-400">
                            <Users className="w-5 h-5" /> Non-Technical Roles
                        </h2>
                        <div className="space-y-3">
                            {roles.nonTechnical.map((role) => (
                                <button
                                    key={role}
                                    onClick={() => handleRoleSelect(role)}
                                    className={`w-full p-4 rounded-xl flex items-center gap-4 transition-all duration-200 border ${selectedRole === role
                                        ? 'bg-indigo-600/20 border-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.3)]'
                                        : 'bg-slate-800/50 border-slate-700 hover:border-slate-500'
                                        }`}
                                >
                                    <div className={`${selectedRole === role ? 'text-indigo-400' : 'text-slate-400'}`}>
                                        {getIcon(role)}
                                    </div>
                                    <span className="font-medium text-lg text-slate-200">{role}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="mt-12 flex justify-center">
                    <button
                        onClick={handleProceed}
                        disabled={!selectedRole}
                        className={`px-12 py-4 rounded-full font-bold text-lg transition-all duration-300 ${selectedRole
                            ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:shadow-lg hover:shadow-blue-500/25 transform hover:-translate-y-1'
                            : 'bg-slate-700 text-slate-500 cursor-not-allowed'
                            }`}
                    >
                        Next Step
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RoleSelection;
