import React from 'react';

const FeatureCard = ({ icon: Icon, title, description, color = "indigo", children }) => {
    const colorClasses = {
        indigo: "bg-indigo-500/10 text-indigo-400 group-hover:text-indigo-300 border-indigo-500/20",
        emerald: "bg-emerald-500/10 text-emerald-400 group-hover:text-emerald-300 border-emerald-500/20",
        blue: "bg-blue-500/10 text-blue-400 group-hover:text-blue-300 border-blue-500/20",
        purple: "bg-purple-500/10 text-purple-400 group-hover:text-purple-300 border-purple-500/20",
        amber: "bg-amber-500/10 text-amber-400 group-hover:text-amber-300 border-amber-500/20",
    };

    return (
        <div className={`
      relative group rounded-2xl bg-slate-800/50 backdrop-blur-sm p-8 
      hover:bg-slate-800 transition-all duration-300 
      border border-slate-700/50 hover:border-${color}-500/50 shadow-lg hover:shadow-xl hover:-translate-y-1
    `}>
            <div className="flex items-center gap-4 mb-4">
                {Icon && (
                    <div className={`p-3 rounded-xl transition-colors ${colorClasses[color]}`}>
                        <Icon className="w-6 h-6" />
                    </div>
                )}
                <h3 className="text-xl font-bold text-white tracking-tight">{title}</h3>
            </div>

            {description && (
                <p className="text-slate-400 text-sm leading-relaxed mb-4">
                    {description}
                </p>
            )}

            {children && (
                <div className="mt-4">
                    {children}
                </div>
            )}
        </div>
    );
};

export default FeatureCard;
