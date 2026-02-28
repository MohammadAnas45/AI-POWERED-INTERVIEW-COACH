import React, { useState } from 'react';
import { CheckCircle2, Clock, UserCheck } from 'lucide-react';

const Milestone = ({ title, status, index }) => {
    const [complete, setComplete] = useState(status === 'confirmed' || status === 'approved');

    const toggleStatus = () => setComplete(!complete);

    return (
        <div
            onClick={toggleStatus}
            className={`
        relative group p-6 rounded-xl border transition-all duration-300 cursor-pointer overflow-hidden
        ${complete
                    ? 'bg-emerald-500/10 border-emerald-500/30'
                    : 'bg-slate-800/50 border-slate-700 hover:border-indigo-500/30'
                }
      `}
        >
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <span className="text-6xl font-black">{index + 1}</span>
            </div>

            <div className="flex items-center justify-between relative z-10">
                <div className="flex items-center gap-4">
                    <div className={`
            p-3 rounded-full transition-colors duration-300
            ${complete ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-700/50 text-slate-400'}
          `}>
                        {complete ? <CheckCircle2 size={24} /> : <UserCheck size={24} />}
                    </div>

                    <div>
                        <h4 className={`text-lg font-bold transition-colors ${complete ? 'text-white' : 'text-slate-300'}`}>
                            {title}
                        </h4>
                        <div className="flex items-center gap-2 mt-1">
                            <span className={`text-xs font-semibold px-2 py-1 rounded-full uppercase tracking-wider ${complete
                                    ? 'bg-emerald-500/20 text-emerald-300'
                                    : 'bg-amber-500/10 text-amber-300'
                                }`}>
                                {complete ? 'Completed' : 'Pending Review'}
                            </span>
                            {!complete && (
                                <span className="text-xs text-slate-500 flex items-center gap-1">
                                    <Clock size={12} /> Due soon
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                <div className={`
          w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-300
          ${complete
                        ? 'border-emerald-500 bg-emerald-500 text-white scale-110'
                        : 'border-slate-600 text-transparent scale-100 group-hover:border-indigo-400'}
        `}>
                    <CheckCircle2 size={16} />
                </div>
            </div>
        </div>
    );
};

export default Milestone;
