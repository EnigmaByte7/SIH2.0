import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('Logging in...');

        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });
            
            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('isAuthenticated', 'true'); 
                localStorage.setItem('userId', data.userId); 
                
                setMessage('Success! Redirecting to home hub...');
                window.location.href = '/home'; 
            } else {
                setMessage(data.message || 'Login failed. Check credentials.');
                localStorage.removeItem('isAuthenticated');
            }
        } catch (error) {
            setMessage('Network error. Check Express server status.');
            console.error('Login request failed:', error);
        }
    };

    return (
        // Full screen dark background
        <div className="flex items-center justify-center min-h-screen bg-zinc-950 text-white p-4">
            
            <div className="p-10 bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl w-full max-w-sm backdrop-blur-md">
                <h2 className="text-3xl font-extrabold text-white mb-2 text-center bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-sky-400">
                    System Access
                </h2>
                <p className="text-zinc-400 text-center mb-8">Enter credentials to monitor the grid.</p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-zinc-400 text-sm mb-2">Username</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full p-3 bg-zinc-800 text-white rounded-lg border border-zinc-700 placeholder-zinc-500 focus:ring-indigo-500 focus:border-indigo-500 transition"
                            placeholder="operator_name"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-zinc-400 text-sm mb-2">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-3 bg-zinc-800 text-white rounded-lg border border-zinc-700 placeholder-zinc-500 focus:ring-indigo-500 focus:border-indigo-500 transition"
                            placeholder="••••••••"
                            required
                        />
                    </div>
                    
                    <button
                        type="submit"
                        className="w-full bg-indigo-600 text-white font-bold py-3 rounded-xl hover:bg-indigo-700 transition duration-300 shadow-md hover:shadow-indigo-500/50 transform hover:scale-[1.01]"
                    >
                        Log In
                    </button>
                    <Link to="/" className="block text-center text-zinc-500 text-sm mt-3 hover:text-indigo-400 transition">
                         ← Back to Public Site
                    </Link>
                    <p className={`text-center text-sm mt-4 ${message.includes('Success') ? 'text-lime-400' : 'text-rose-400'}`}>
                        {message}
                    </p>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;