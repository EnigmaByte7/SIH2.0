import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const HomePage = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        // Clear authentication state and redirect
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('userId');
        navigate('/login'); 
    };
    
    // --- STATIC DATA ---
    const TOTAL_LINES = 6;
    const userName = 'Operator';

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-950 text-white p-8">
            
            {/* 1. Header and Welcome Message */}
            <div className="text-center mb-12">
                <h1 className="text-2xl font-semibold text-zinc-400 mb-1">
                    Welcome Back, {userName}
                </h1>
                <h2 className="text-6xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-lime-400 to-teal-400">
                    Grid Operations Center
                </h2>
                <p className="text-xl text-zinc-500 mt-4">
                    Monitoring System Status and Capacity.
                </p>
            </div>
            
            {/* 2. System Capacity Display */}
            <div className="p-8 bg-zinc-900 border border-zinc-800 rounded-2xl shadow-xl mb-16">
                <p className="text-xl text-zinc-400 uppercase font-medium">Monitoring Capacity</p>
                <div className="mt-2 text-center">
                    <span className="text-7xl font-extrabold text-indigo-400">
                        {TOTAL_LINES}
                    </span>
                    <span className="ml-4 text-3xl text-white">
                        Lines
                    </span>
                </div>
            </div>

            {/* 3. Navigation */}
            <Link 
                to="/dashboard" 
                className="bg-indigo-600 text-white font-bold py-4 px-12 rounded-xl shadow-xl transition-all duration-300 hover:bg-indigo-700 transform hover:scale-105 border border-indigo-500/50"
            >
                Launch Real-Time Dashboard 🚀
            </Link>
            
            {/* Logout Button */}
            <button
                onClick={handleLogout}
                className="mt-10 text-zinc-500 hover:text-red-400 transition duration-200 text-sm font-semibold"
            >
                ← Logout and Exit
            </button>
        </div>
    );
};

export default HomePage;