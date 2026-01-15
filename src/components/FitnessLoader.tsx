
import React from 'react';
import { Dumbbell } from 'lucide-react';

const FitnessLoader = () => {
    return (
        <div className="flex flex-col items-center justify-center p-8 space-y-4">
            {/* Animated Dumbbell */}
            <div className="relative">
                <Dumbbell
                    className="w-16 h-16 text-blue-500 animate-sprint"
                    style={{ animationDuration: '0.8s', animationIterationCount: 'infinite' }}
                />
                {/* Sweat drops (particles) */}
                <div className="absolute -right-2 top-0 w-2 h-2 bg-blue-400 rounded-full animate-ping" style={{ animationDelay: '0.2s' }} />
                <div className="absolute -left-2 top-4 w-1.5 h-1.5 bg-blue-300 rounded-full animate-ping" style={{ animationDelay: '0.5s' }} />
            </div>

            {/* Text with "Pump" effect */}
            <h3 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-green-500 bg-clip-text text-transparent animate-pulse">
                Training in progress...
            </h3>
        </div>
    );
};

export default FitnessLoader;
