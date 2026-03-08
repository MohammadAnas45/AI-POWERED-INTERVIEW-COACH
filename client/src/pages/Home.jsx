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

            <main className="relative z-10 pb-24">
                {/* Roadmap Section (Referred to as 'Main' in Nav) */}
                <RoadmapSection data={week1Data} />
            </main>

            <Footer />
        </div>
    );
};

export default Home;
