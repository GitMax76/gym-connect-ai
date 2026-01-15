import React from 'react';
import { Link } from 'react-router-dom';
import { Dumbbell } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-white border-t border-slate-200 py-8 text-slate-500 font-sans">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center text-sm">
                <div className="mb-4 md:mb-0 flex items-center">
                    &copy; {new Date().getFullYear()} GymConnect AI. <span className="mx-2">|</span>
                    <div className="flex items-center group cursor-pointer">
                        <span className="mr-1">Created by</span>
                        <Link to="/credits" className="flex items-center font-extrabold text-base bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent hover:opacity-80 transition-opacity ml-1">
                            Massimiliano Sabato
                            <Dumbbell className="ml-2 w-5 h-5 text-blue-500 animate-bounce" style={{ animationDuration: '2s' }} />
                        </Link>
                    </div>
                </div>
                <div className="flex flex-wrap justify-center gap-6 mt-4 md:mt-0">
                    <Link to="/pitch" className="hover:text-green-600 transition-colors text-sm">
                        Vision
                    </Link>
                    <Link to="/contact" className="hover:text-green-600 transition-colors text-sm">
                        Contatti
                    </Link>
                    <a href="/business.html" className="hover:text-green-600 transition-colors font-medium">
                        Investors & Partners
                    </a>
                    <Link to="/privacy" className="hover:text-green-600 transition-colors text-sm">Privacy</Link>
                    <Link to="/terms" className="hover:text-green-600 transition-colors text-sm">Terms</Link>
                    <Link to="/investors" className="hover:text-green-600 transition-colors text-sm font-semibold">Investors</Link>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
