import express from 'express';
import cors from 'cors';
import { configDotenv } from 'dotenv';
import mongoose from 'mongoose';
import axios from 'axios'; 
import { createServer } from 'http';
import { Server } from 'socket.io';

// Keep your existing route for other purposes
import testRoute from './routes/test.js';

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
app.use('/api', testRoute);

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
const generateSimulatedData = () => {
    // Generates a plausible 8-feature array (4 Sensors * V/I) 
    // The feature order MUST match the columns used during model training:
    // [SensorA_V, SensorA_I, SensorB_V, SensorB_I, SensorC_V, SensorC_I, SensorD_V, SensorD_I]
    
    // We use Math.random() to add noise, simulating slight changes over time.
    const noise = () => Math.random() * 0.1; // Generates a random number between 0 and 0.1

    return [
        // Sensor A (Voltage and Current)
        0.51 + noise(),  // SensorA_V (e.g., nominal 0.51)
        -0.75 + noise(), // SensorA_I (e.g., nominal -0.75)
        
        // Sensor B (Voltage and Current)
        1.20 + noise(),  // SensorB_V (e.g., nominal 1.20)
        -0.80 + noise(), // SensorB_I (e.g., nominal -0.80)
        
        // Sensor C (Voltage and Current)
        0.45 + noise(),  // SensorC_V (e.g., nominal 0.45)
        -0.55 + noise(), // SensorC_I (e.g., nominal -0.55)
        
        // Sensor D (Voltage and Current)
        -0.10 + noise(), // SensorD_V (e.g., nominal -0.10)
        0.05 + noise()   // SensorD_I (e.g., nominal 0.05)
        
        // Total features: 8
    ];
};

const LINE_CONFIG = [
    { id: 'Line 1', nominal_voltage: 0.51, port: 'SensorA' },
    { id: 'Line 2', nominal_voltage: 0.80, port: 'SensorB' },
    { id: 'Line 3', nominal_voltage: 1.10, port: 'SensorC' }
    // Add more lines as needed
];
// --- Socket.IO Connection Handler ---
io.on('connection', (socket) => {
    console.log(`User connected with ID: ${socket.id}`);
    
    // Start pushing data to this client every 2 seconds
     const intervalId = setInterval(async () => {
        
        for (const line of LINE_CONFIG) {
            
            // Generate distinct data for each line (8 features each)
            const sensorData = generateSimulatedData(); // Use the existing function
            const currentTime = Date.now();
            
            // 1. Send data to Flask for prediction (same as before)
            try {
                const flaskApiUrl = 'http://127.0.0.1:5000/predict_fault'; 
                const response = await axios.post(flaskApiUrl, { sensor_values: sensorData });
                
                // 2. Prepare data object with the Line ID
                const analysisResult = {
                    lineId: line.id, // <-- NEW: Identify the line
                    timestamp: currentTime,
                    voltage: sensorData[0], // Assuming first feature is Voltage (V_A)
                    current: sensorData[1], // Assuming second feature is Current (I_A)
                    fault: response.data.fault_prediction,
                    status: response.data.fault_prediction === 'Normal' ? 'NORMAL' : 'FAULT'
                };

                // 3. Push the analyzed data to the client
                // Note: We use the same 'liveAnalysis' event, but the payload is different.
                socket.emit('liveAnalysis', analysisResult);

            } catch (error) {
                // ... (error handling remains the same) ...
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