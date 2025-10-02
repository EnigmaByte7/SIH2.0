import React, { useState } from 'react';

const AnalysisDashboard = () => {
    const [result, setResult] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleAnalysis = async () => {
        setIsLoading(true);
        setResult(null);
        try {
            const response = await fetch('/api/analyze', { method: 'POST' });
            if (!response.ok) throw new Error('Network response was not ok');
            const data = await response.json();
            setResult(data);
        } catch (error) {
            console.error("Failed to analyze data:", error);
            setResult({ status: "ERROR", message: "Failed to connect to the backend. Is it running?" });
        }
        setIsLoading(false);
    };

    const getCardClasses = () => {
        if (!result) return '';
        if (result.status === 'FAULT') return 'bg-red-100 border-red-500 text-red-700';
        if (result.status === 'NORMAL') return 'bg-green-100 border-green-500 text-green-700';
        return 'bg-gray-100 border-gray-500 text-gray-700';
    };

    return (
        <section className="bg-slate-50 py-20">
            <div className="container mx-auto text-center px-8">
                <h2 className="text-3xl font-bold mb-4">Live Grid Analysis</h2>
                <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
                    Click the button below to analyze the latest grid data using our trained AI model. The system will predict the grid status in real-time.
                </p>
                <button
                    onClick={handleAnalysis}
                    disabled={isLoading}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-lg shadow-md transition-all duration-300 ease-in-out disabled:bg-gray-400 disabled:cursor-not-allowed transform hover:scale-105"
                >
                    {isLoading ? 'Analyzing...' : 'Analyze Grid Status'}
                </button>

                {result && (
                    <div className={`mt-12 max-w-2xl mx-auto p-6 rounded-lg border-2 shadow-xl transition-opacity duration-500 ease-in ${getCardClasses()}`}>
                        <h3 className="text-2xl font-bold border-b-2 pb-2 mb-4 border-inherit">Analysis Result</h3>
                        <div className="text-left space-y-2">
                            <p className="text-lg"><strong className="w-32 inline-block">Status:</strong> {result.status}</p>
                            {result.status === 'FAULT' && (
                                <>
                                    <p className="text-lg"><strong className="w-32 inline-block">Fault Type:</strong> {result.type}</p>
                                    <p className="text-lg"><strong className="w-32 inline-block">Time of Fault:</strong> {result.time} seconds</p>
                                </>
                            )}
                            {result.status === 'ERROR' && (
                                <p className="text-lg"><strong className="w-32 inline-block">Details:</strong> {result.message}</p>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
};

export default AnalysisDashboard;