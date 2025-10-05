import express from 'express';
import cors from 'cors';
import { configDotenv } from 'dotenv';
import mongoose from 'mongoose';
import axios from 'axios'; 
import { createServer } from 'http';
import { Server } from 'socket.io';
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Keep your existing route for other purposes
// In server.js, near your other app.use() lines:

import authRoutes from './routes/auth.js'; 
// ...

// ...



const app = express();
const httpServer = createServer(app);
// Initialize Socket.IO server
const io = new Server(httpServer, {
    cors: {
        origin: "http://localhost:5173", // Allow your React port
        methods: ["GET", "POST"]
    }
});
configDotenv();

app.use(cors());
app.use(express.json());

// You can keep your existing '/api' route
app.use('/api/auth', authRoutes); // Assign the authentication routes
// --- NEW: Circuit Control Endpoint ---
// This endpoint receives the signal from the React frontend
app.post('/api/control/trip', (req, res) => {
    // 1. Get data sent by React
    const { lineId, faultType } = req.body;
    
    if (!lineId || !faultType) {
        return res.status(400).json({ status: "ERROR", message: "Missing line ID or fault type for trip signal." });
    }

    // 2. LOG THE CRITICAL ACTION
    console.log(`\n🚨 TRIP SIGNAL RECEIVED: Isolating Circuit for Line ${lineId}`);
    console.log(`Fault Type Predicted: ${faultType}`);
    
    // --- REAL WORLD ACTION GOES HERE ---
    // For a physical system, this is where you would send a command
    // via a separate protocol (MQTT, IoT API, Serial Port) to trip the relay.
    // Example: sendMqttCommand('RELAY/LINE_TRIP', { line: lineId });
    // -----------------------------------
    // CRITICAL FIX: Update the global state
    if (CIRCUIT_STATUS.hasOwnProperty(lineId)) {
        CIRCUIT_STATUS[lineId] = true; 
    }
    // 3. Return a successful confirmation back to the frontend
    return res.status(200).json({ 
        status: "TRIPPED", 
        message: `Circuit breaker for Line ${lineId} successfully isolated. Action logged on server.`
    });
});

// --- NEW: Circuit Reset Endpoint ---
app.post('/api/control/reset', (req, res) => {
    const { lineId } = req.body;
    
    if (!lineId) {
        return res.status(400).json({ status: "ERROR", message: "Missing line ID for reset signal." });
    }

    // 1. Reset the global state flag
    if (CIRCUIT_STATUS.hasOwnProperty(lineId)) {
        CIRCUIT_STATUS[lineId] = false; // Set status back to 'monitoring'
    }

    console.log(`\n🟢 RESET SIGNAL RECEIVED: Resuming monitoring for Line ${lineId}`);

    return res.status(200).json({ 
        status: "RESET", 
        message: `Monitoring resumed for Line ${lineId}. Data stream restarting.`
    });
});
// --- MongoDB Connection ---
const uri = process.env.MONGO_URI;
mongoose.connect(uri)
  .then(() => {
    console.log("✅ Successfully connected to MongoDB!");
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1); 
  });
// --- Function to Generate Simulated Time-Series Data ---
// Function should generate a plausible 8-feature array
// Inside server.js, replace your current generateSimulatedData function with this:
// Inside server.js, replace your current generateSimulatedData function with this:

const generateSimulatedData = () => {
    const randomRange = (min, max) => Math.random() * (max - min) + min;
    const severityFactor = randomRange(0, 1);
    
    // --- Define Base Noise ---
    const V_NOMINAL = randomRange(0.95, 1.05);
    const I_NOMINAL = randomRange(-0.1, 0.1); 
    
    let V_base = V_NOMINAL;
    let I_base = I_NOMINAL;
    let faultDropMagnitude = 0; // Magnitude of the drop if a fault occurs

    // Randomly select a section for the largest drop (A, B, C, or D)
    const sections = ['A', 'B', 'C', 'D'];
    const dropSection = sections[Math.floor(randomRange(0, sections.length))]; 

    if (severityFactor > 0.4) {
        // --- 60% Chance: Simulate a Distinct Fault ---
        if (severityFactor > 0.8) {
             // Severe Fault
            V_base = randomRange(0.1, 0.3); 
            I_base = randomRange(-4.0, -3.0); 
            faultDropMagnitude = randomRange(0.6, 0.9); // Large drop
        } else {
            // Moderate Fault
            V_base = randomRange(0.4, 0.6);
            I_base = randomRange(-2.5, -1.5);
            faultDropMagnitude = randomRange(0.3, 0.5); // Moderate drop
        }
    } 
    // If severityFactor <= 0.4, V_base remains V_NOMINAL (Normal state)


    // -------------------------------------------------------------
    // Generate 8 features, applying the maximum drop at the selected sensor
    // -------------------------------------------------------------
     const data = [];
    
    // SENSOR A (Features 0, 1) - If drop is NOT here, keep it near nominal.
    const vA_Start = (dropSection === 'A' || faultDropMagnitude === 0) ? V_base : V_NOMINAL;
    data.push(vA_Start - (dropSection === 'A' ? faultDropMagnitude : 0), I_base); 
    
    // SENSOR B (Features 2, 3) - Decays from A
    const vB_Start = (dropSection === 'B' || faultDropMagnitude === 0) ? V_base : vA_Start * randomRange(0.96, 0.98);
    data.push(vB_Start - (dropSection === 'B' ? faultDropMagnitude : 0), I_base * 0.9); 
    
    // SENSOR C (Features 4, 5) - Decays from B
    const vC_Start = (dropSection === 'C' || faultDropMagnitude === 0) ? V_base : data[2] * randomRange(0.96, 0.98);
    data.push(vC_Start - (dropSection === 'C' ? faultDropMagnitude : 0), I_base * 0.8);
    
    // SENSOR D (Features 6, 7) - Decays from C
    const vD_Start = (dropSection === 'D' || faultDropMagnitude === 0) ? V_base : data[4] * randomRange(0.96, 0.98);
    data.push(vD_Start - (dropSection === 'D' ? faultDropMagnitude : 0), I_base * 0.7);

    // Add final noise and clean up
    return data.map(v => Math.max(-4.0, v + randomRange(-0.02, 0.02)));
}

const LINE_CONFIG = [
    { id: 'Line 1', nominal_voltage: 0.51, port: 'SensorA' },
    { id: 'Line 2', nominal_voltage: 0.80, port: 'SensorB' },
    { id: 'Line 3', nominal_voltage: 1.10, port: 'SensorC' },
    // --- NEW LINES ADDED ---
    { id: 'Line 4', nominal_voltage: 0.95, port: 'SensorD' },
    { id: 'Line 5', nominal_voltage: 0.70, port: 'SensorE' },
    { id: 'Line 6', nominal_voltage: 1.05, port: 'SensorF' }
    // Add more lines as needed
];
// NEW: Global state map to track which circuits are tripped
// Initialize all to false (not tripped)
const CIRCUIT_STATUS = LINE_CONFIG.reduce((acc, line) => {
    acc[line.id] = false; 
    return acc;
}, {});
// --- Socket.IO Connection Handler ---
io.on('connection', (socket) => {
    console.log(`User connected with ID: ${socket.id}`);
    
    // Start pushing data to this client every 2 seconds
     const intervalId = setInterval(async () => {
        
        for (const [index, line] of LINE_CONFIG.entries()) {
            // --- CRITICAL FIX: Skip prediction if the line is tripped ---
            if (CIRCUIT_STATUS[line.id] === true) {
                // Optionally send a static 'TRIPPED' status back to React to freeze the card display
                socket.emit('liveAnalysis', { 
                    lineId: line.id, 
                    status: 'TRIPPED', 
                    fault: 'Isolated',
                    voltage: 0, 
                    current: 0,
                    timestamp: Date.now() // <-- ENSURE FRESH TIMESTAMP IS SENT
                });
                continue; // Skip the rest of the loop for this line
            }
            // --- NEW: Stagger the requests ---
            // Introduce a small delay for every line processed (e.g., 50ms per line)
            // This prevents the system from being overwhelmed at the start of the interval.
            if (index > 0) {
                await delay(50); // Pause for 50 milliseconds
            }
            // ------------------------------------
            // Generate distinct data for each line (8 features each)
            const sensorData = generateSimulatedData(); // Use the existing function
            const currentTime = Date.now();
            
            // 1. Send data to Flask for prediction (same as before)
            try {
                const flaskApiUrl = 'http://127.0.0.1:5000/predict_fault'; 
                const response = await axios.post(flaskApiUrl, { sensor_values: sensorData });

                // Get the new location data from the Flask response
                const faultLocation = response.data.fault_location_section || "N/A";
                
                // 2. Prepare data object with the Line ID
                const analysisResult = {
                    lineId: line.id, // <-- NEW: Identify the line
                    timestamp: currentTime,
                    voltage: sensorData[0], // Assuming first feature is Voltage (V_A)
                    current: sensorData[1], // Assuming second feature is Current (I_A)
                     // --- FIXED: Include the fault location section ---
                    faultLocationSection: faultLocation, 
                    fault: response.data.fault_prediction,
                    status: response.data.fault_prediction === 'Normal' ? 'NORMAL' : 'FAULT'
                };

                // 3. Push the analyzed data to the client
                // Note: We use the same 'liveAnalysis' event, but the payload is different.
                socket.emit('liveAnalysis', analysisResult);

            } catch (error) {
                console.error('Error in live analysis loop:', error.message);
                // Emit a general error state to the client for better UI feedback
                socket.emit('liveError', { message: 'Backend analysis failed.' }); 
            }
        }
    }, 2000); 
// ...// 2000ms = update every 2 seconds

    // Stop sending data when the client disconnects
    socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.id}`);
        clearInterval(intervalId);
    });
});


const PORT = process.env.PORT || 5001; 
// CHANGE: Listen on the httpServer, not the Express app directly
httpServer.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
  console.log(`✅ Socket.IO listening on port ${PORT}`);
});