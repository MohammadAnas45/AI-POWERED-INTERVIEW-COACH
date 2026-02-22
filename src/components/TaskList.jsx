import React, { useState } from 'react';
import { Target, Terminal, Code2, Server, Database } from 'lucide-react';

const TaskList = ({ tasks, title = "Development Tasks" }) => {
    const [taskList, setTaskList] = useState(tasks);

    const toggleTask = (id) => {
        setTaskList(prev => prev.map(task =>
            task.id === id ? { ...task, completed: !task.completed } : task
        ));
    };

    const progress = Math.round((taskList.filter(t => t.completed).length / taskList.length) * 100);

    return (
        <div id="tasks" className="p-8 bg-slate-900 border border-slate-700/50 rounded-2xl shadow-2xl relative overflow-hidden group hover:border-indigo-500/30 transition-all duration-500">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-emerald-500/20 transition-all duration-700" />

            <div className="relative z-10">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-xl transition-all duration-300 ${progress === 100 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-indigo-500/10 text-indigo-400'}`}>
                            <Terminal className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold text-white tracking-tight">{title}</h3>
                            <p className="text-slate-400 text-sm">Track implementation progress</p>
                        </div>
                    </div>

                    <div className="text-right">
                        <span className={`text-3xl font-bold mb-1 block transition-colors ${progress === 100 ? 'text-emerald-400' : 'text-indigo-400'}`}>
                            {progress}%
                        </span>
                        <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Complete</span>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full h-2.5 bg-slate-800 rounded-full mb-8 overflow-hidden border border-slate-700/50">
                    <div
                        className={`h-full transition-all duration-700 ease-out shadow-lg ${progress === 100 ? 'bg-gradient-to-r from-emerald-500 to-green-400' : 'bg-gradient-to-r from-indigo-500 to-purple-500'}`}
                        style={{ width: `${progress}%` }}
                    />
                </div>

                <div className="space-y-3">
                    {taskList.map((task) => (
                        <div
                            key={task.id}
                            onClick={() => toggleTask(task.id)}
                            className={`
                flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all duration-200 group/item
                ${task.completed
                                    ? 'bg-emerald-500/5 border-emerald-500/30 hover:bg-emerald-500/10'
                                    : 'bg-slate-800/50 border-slate-700 hover:bg-slate-800 hover:border-indigo-500/50 hover:shadow-lg hover:shadow-indigo-500/5 hover:-translate-y-0.5'
                                }
              `}
                        >
                            <div className={`
                w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all duration-300
                ${task.completed
                                    ? 'bg-emerald-500 border-emerald-500 rotate-0 scale-100'
                                    : 'border-slate-600 rotate-0 scale-90 group-hover/item:border-indigo-400'
                                }
              `}>
                                {task.completed && (
                                    <svg className="w-4 h-4 text-white animate-check-pop" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                    </svg>
                                )}
                            </div>

                            <span className={`flex-1 font-medium transition-colors ${task.completed ? 'text-emerald-300/70 line-through decoration-emerald-500/30' : 'text-slate-300 group-hover/item:text-white'}`}>
                                {task.text}
                            </span>

                            {/* Icon based on task type */}
                            <div className={`transition-colors ${task.completed ? 'text-emerald-500/30' : 'text-slate-600 group-hover/item:text-indigo-400'}`}>
                                {task.text.includes('Git') && <Code2 size={18} />}
                                {task.text.includes('Backend') && <Server size={18} />}
                                {task.text.includes('Database') && <Database size={18} />}
                                {task.text.includes('Frontend') && <Target size={18} />}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TaskList;
