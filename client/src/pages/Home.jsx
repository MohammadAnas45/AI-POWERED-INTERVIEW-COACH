import React from 'react';
import Hero from '../components/Hero';
import RoadmapSection from '../components/RoadmapSection';
import TaskList from '../components/TaskList';
import Milestone from '../components/Milestone';
import Footer from '../components/Footer';
import { week1Data } from '../data/week1Data';
import { Code2, ChevronRight } from 'lucide-react';

const Home = () => {
    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500/30">
            <Hero />

            <main className="relative z-10 space-y-24 pb-24">
                {/* Roadmap Section */}
                <RoadmapSection data={week1Data} />

                {/* Development Tasks */}
                <section id="tasks" className="max-w-4xl mx-auto px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-white mb-4">Development Progress</h2>
                        <p className="text-slate-400">Track the implementation of the AI Interview Coach platform.</p>
                    </div>
                    <TaskList tasks={week1Data.tasks} />
                </section>

                {/* Milestone Review */}
                <section id="milestones" className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-8 lg:p-12 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-50" />

                        <div className="md:flex md:justify-between md:items-end mb-12">
                            <div>
                                <h2 className="text-3xl font-bold text-white mb-4">Milestone Review</h2>
                                <p className="text-slate-400 max-w-xl">
                                    Key checkpoints to ensure the project meets architectural and functional requirements before proceeding to the next phase.
                                </p>
                            </div>
                            <div className="hidden md:block">
                                <button className="flex items-center gap-2 text-indigo-400 hover:text-indigo-300 transition-colors font-medium">
                                    View Full Timeline <ChevronRight size={16} />
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
                            {/* Connector Line for Desktop */}
                            <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-slate-800 -z-10 -translate-y-1/2" />

                            {week1Data.milestones.map((milestone, index) => (
                                <Milestone
                                    key={milestone.id}
                                    title={milestone.title}
                                    status={milestone.completed ? 'confirmed' : 'pending'}
                                    index={index}
                                />
                            ))}
                        </div>

                        <div className="mt-12 p-6 bg-slate-800/50 rounded-xl border border-slate-700/50 flex flex-col sm:flex-row items-center justify-between gap-6">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-indigo-500/20 text-indigo-400 rounded-full">
                                    <Code2 size={24} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-white">Ready for Phase 2?</h4>
                                    <p className="text-sm text-slate-400">Once all milestones are approved, we proceed to AI Integration.</p>
                                </div>
                            </div>
                            <button className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg transition-all shadow-lg hover:shadow-indigo-500/25 whitespace-nowrap">
                                Start Week 2
                            </button>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
};

export default Home;
