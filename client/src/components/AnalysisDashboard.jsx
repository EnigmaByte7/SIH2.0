import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Initialize the Socket.IO connection
// Point this to your Express server port (e.g., 5001)
const socket = io('http://localhost:5001'); 

const MAX_DATA_POINTS = 50; // Max points to display on the chart before shifting

// ====================================================================
// 1. REUSABLE STATUS CARD COMPONENT
// ====================================================================
const StatusCard = ({ lineId, data }) => {
    const getCardClasses = (status) => {
        if (status === 'FAULT') return 'bg-red-100 border-red-500 text-red-700';
        if (status === 'NORMAL') return 'bg-green-100 border-green-500 text-green-700';
        if (status === 'ERROR' || status === 'AWAITING_DATA') return 'bg-gray-100 border-gray-500 text-gray-700';
        return 'bg-gray-100 border-gray-500 text-gray-700';
    };

    const status = data.status;
    const faultType = data.fault;

    return (
        <div className={`p-6 rounded-lg border-2 shadow-xl transition-all duration-300 ${getCardClasses(status)}`}>
            <h3 className="text-xl font-bold border-b-2 pb-2 mb-4 border-inherit">Line: {lineId}</h3>
            <div className="text-left space-y-2">
                <p className="text-lg">
                    <strong className="w-32 inline-block">Status:</strong> 
                    <span className="font-bold">{status}</span>
                </p>
                
                {status === 'FAULT' && (
                    <p className="text-lg">
                        <strong className="w-32 inline-block">Fault Type:</strong> 
                        <code className="bg-red-200 p-1 rounded-sm text-sm">{faultType}</code>
                    </p>
                )}
                 {status !== 'FAULT' && (
                    <p className="text-lg">
                        <strong className="w-32 inline-block">Last Predict:</strong> 
                        <span>{faultType}</span>
                    </p>
                )}
            </div>
        </div>
    );
};

// ====================================================================
// 2. REUSABLE CHART COMPONENT
// ====================================================================
const ChartComponent = ({ lineId, data }) => {
    return (
        <div className="bg-white p-6 rounded-lg shadow-xl">
            <h4 className="text-xl font-semibold mb-4 text-center">{lineId} Sensor Readings</h4>
            <div style={{ width: '100%', height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                        data={data}
                        margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="time" interval="preserveEnd" angle={-30} textAnchor="end" height={50} />
                        <YAxis yAxisId="left" stroke="#8884d8" label={{ value: 'Voltage', angle: -90, position: 'insideLeft' }} />
                        <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" label={{ value: 'Current', angle: 90, position: 'insideRight' }} />
                        <Tooltip />
                        <Legend />
                        <Line yAxisId="left" type="monotone" dataKey="Voltage" stroke="#8884d8" dot={false} isAnimationActive={false} />
                        <Line yAxisId="right" type="monotone" dataKey="Current" stroke="#82ca9d" dot={false} isAnimationActive={false} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

// ====================================================================
// 3. MAIN DASHBOARD COMPONENT
// ====================================================================
const AnalysisDashboard = () => {
    // Stores time-series data: { 'Line 1': [...], 'Line 2': [...], ... }
    const [lineData, setLineData] = useState({}); 
    // Stores latest prediction status: { 'Line 1': {status, fault}, 'Line 2': {...}, ... }
    const [latestStatus, setLatestStatus] = useState({}); 
    const [isSocketConnected, setIsSocketConnected] = useState(false);

    useEffect(() => {
        // Handle connection status
        socket.on('connect', () => setIsSocketConnected(true));
        socket.on('disconnect', () => setIsSocketConnected(false));
        
        // Event listener for incoming live analysis results from Express
        socket.on('liveAnalysis', (data) => {
            const { lineId, status, fault } = data;

            // 1. Update latest status card for this line
            setLatestStatus(prevStatus => ({
                ...prevStatus,
                [lineId]: { status, fault }
            }));

            // 2. Update chart data for this line
            setLineData(prevData => {
                const newPoint = {
                    time: new Date(data.timestamp).toLocaleTimeString(),
                    Voltage: data.voltage,
                    Current: data.current,
                };
                
                // Get data for this specific line, defaulting to an empty array
                const currentLineData = prevData[lineId] || [];
                
                // Add new data and remove the oldest point if over limit
                const newData = [...currentLineData, newPoint];
                if (newData.length > MAX_DATA_POINTS) {
                    newData.shift();
                }
                
                return {
                    ...prevData,
                    [lineId]: newData
                };
            });
        });

        // Event listener for errors
        socket.on('liveError', (error) => {
            console.error("Live Analysis Error:", error.message);
            // Push error to all currently displayed lines
            setLatestStatus(prevStatus => {
                const updated = { ...prevStatus };
                for (const lineId in updated) {
                    updated[lineId] = { status: 'ERROR', fault: error.message };
                }
                return updated;
            });
        });

        // Cleanup: disconnect the socket when the component unmounts
        return () => {
            socket.off('liveAnalysis');
            socket.off('liveError');
            socket.off('connect');
            socket.off('disconnect');
        };
    }, []); // Run only once on mount

    // Full return block for the main dashboard component
    return (
        <section className="bg-slate-50 py-10 min-h-screen">
            <div className="container mx-auto px-8">
                <h2 className="text-3xl font-bold mb-4 text-center">Multi-Line Fault Diagnosis Dashboard</h2>
                
                {/* Connection Status Indicator */}
                <div className={`text-center py-2 rounded-lg mb-8 font-semibold ${isSocketConnected ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}>
                    {isSocketConnected ? '✅ Real-Time Connection Active' : '❌ Connecting to Server...'}
                </div>
                
                {/* 1. STATUS CARDS SECTION (The "Nice Space") */}
                <h3 className="text-2xl font-bold mb-6 border-b pb-2">Line Status Overview</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                    {/* Iterate over the keys in latestStatus to display one card per line */}
                    {Object.keys(latestStatus).length > 0 ? (
                        Object.keys(latestStatus).map((lineId) => (
                            <StatusCard key={lineId} lineId={lineId} data={latestStatus[lineId]} />
                        ))
                    ) : (
                        <p className="col-span-3 text-center text-gray-500">Awaiting first data push from Express server...</p>
                    )}
                </div>

                {/* 2. GRAPH SECTION */}
                <h3 className="text-2xl font-bold mb-6 border-b pb-2">Real-Time Sensor Plots</h3>
                <div className="space-y-12">
                    {/* Iterate over the keys in lineData to display one chart per line */}
                    {Object.keys(lineData).length > 0 ? (
                        Object.keys(lineData).map((lineId) => (
                            <ChartComponent key={lineId} lineId={lineId} data={lineData[lineId]} />
                        ))
                    ) : (
                        <p className="text-center text-gray-500">No data received yet. Start the Express server to begin streaming.</p>
                    )}
                </div>
            </div>
        </section>
    );
};

export default AnalysisDashboard;