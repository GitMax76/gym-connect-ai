import React from 'react';
import PitchDeck from '@/components/PitchDeck';

const PitchPage = () => {
    return (
        <div className="w-full h-screen relative">
            <a
                href="/"
                className="absolute top-4 left-4 z-50 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg hover:bg-white transition-all text-slate-700 hover:text-green-600 flex items-center gap-2 px-4 font-medium"
            >
                ← Home
            </a>
            <PitchDeck />
        </div>
    );
};

export default PitchPage;
