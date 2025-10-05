import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const HomePage = () => {
    const navigate = useNavigate();
    const [userName, setUserName] = useState('Operator');
    
    // Static KPIs to simulate recent activity for the user's login session
    const kpis = [
        { label: "Active Lines", value: 6, unit: "/ 6", color: "text-lime-400" },
        { label: "Faults Detected (24h)", value: 3, unit: "", color: "text-red-400" },
        { label: "Last Trip Time", value: "09:30 AM", unit: "", color: "text-sky-400" }
    ];

    useEffect(() => {
        // Fetch or load the username upon mounting
        const storedUserId = localStorage.getItem('userId');
        if (storedUserId) {
            // For a prototype, just display a generalized username
            setUserName(`User ${storedUserId.substring(0, 4)}`);
        }
    }, []);

    const handleLogout = () => {
        // Clear authentication state and redirect
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('userId');
        navigate('/login'); 
    };

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
                    High-level summary of system stability.
                </p>
            </div>
            
            {/* 2. Key Performance Indicators (KPI Cards) */}
            <div className="grid grid-cols-3 gap-8 max-w-4xl w-full mb-16">
                {kpis.map((kpi, index) => (
                    <div 
                        key={index}
                        className="p-6 bg-zinc-900 border border-zinc-800 rounded-xl shadow-lg transition duration-300 hover:shadow-indigo-500/30"
                    >
                        <p className="text-sm font-medium text-zinc-500 uppercase">{kpi.label}</p>
                        <div className="flex items-baseline mt-2">
                            <span className={`text-4xl font-extrabold ${kpi.color}`}>
                                {kpi.value}
                            </span>
                            <span className="ml-2 text-md text-zinc-400">{kpi.unit}</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* 3. Navigation and Control */}
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